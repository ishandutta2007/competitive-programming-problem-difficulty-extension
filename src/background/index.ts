import Browser from 'webextension-polyfill'
import { getProviderConfigs, ProviderType } from '../config'
import { ChatGPTProvider } from './providers/chatgpt'
// import { ChatGPTProvider, getChatGPTAccessToken, sendMessageFeedback } from './providers/chatgpt'
import { OpenAIProvider } from './providers/openai'
import { Provider } from './types'

async function generateAnswers(
  port: Browser.Runtime.Port,
  problem_ids: string,
  // conversationId: string | undefined,
  // parentMessageId: string | undefined,
) {
  const providerConfigs = await getProviderConfigs()

  let provider: Provider
  if (providerConfigs.provider === ProviderType.ChatGPT) {
    // const token = await getChatGPTAccessToken()
    provider = new ChatGPTProvider()//token)
  } else if (providerConfigs.provider === ProviderType.GPT3) {
    const { apiKey, model } = providerConfigs.configs[ProviderType.GPT3]!
    provider = new OpenAIProvider(apiKey, model)
  } else {
    throw new Error(`Unknown provider ${providerConfigs.provider}`)
  }

  const controller = new AbortController()
  port.onDisconnect.addListener(() => {
    controller.abort()
    // cleanup?.()
  })

  problem_ids.forEach(function (problem_id, i) {
    // console.log('%d: %s', i, problem_id);
    // for (const problem_id of problem_ids) {

    // const { cleanup } ;
    setTimeout(
       provider.generateAnswer({
        problem_id: problem_id,
        // signal: controller.signal,
        onEvent(event) {
          console.log("index event", event);
          if (event.type === 'done') {
            port.postMessage({ event: 'DONE' })
            return
          } else {
            // console.log("event.data",event.data)
            Object.assign(event.data, {"problem_id": problem_id});
            console.log("event.data",event.data)
          }
          port.postMessage(event.data)
        },
        // conversationId: conversationId,
        // parentMessageId: parentMessageId,
      })
    // }
   , i*200);
  });
}

Browser.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (msg) => {
    console.debug('received msg', msg)
    try {
      await generateAnswers(port, msg.problem_ids)//, msg.conversationId, msg.parentMessageId)
    } catch (err: any) {
      console.error(err)
      port.postMessage({ error: err.message })
    }
  })
})

Browser.runtime.onMessage.addListener(async (message) => {
  if (message.type === 'FEEDBACK') {
    // const token = await getChatGPTAccessToken()
    // await sendMessageFeedback(token, message.data)
  } else if (message.type === 'OPEN_OPTIONS_PAGE') {
    Browser.runtime.openOptionsPage()
  // } else if (message.type === 'GET_ACCESS_TOKEN') {
  //   return getChatGPTAccessToken()
  }
})

Browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    Browser.runtime.openOptionsPage()
  }
})
