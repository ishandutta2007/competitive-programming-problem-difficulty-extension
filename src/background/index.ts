import Browser from 'webextension-polyfill'
import { getProviderConfigs, ProviderType } from '../config'
import { SPOJProvider } from './providers/spoj'
import { Provider } from './types'

async function generateAnswers(
  port: Browser.Runtime.Port,
  problem_ids: string,
) {
  const providerConfigs = await getProviderConfigs()

  let provider: Provider
  if (providerConfigs.provider === ProviderType.ChatGPT) {
    provider = new SPOJProvider()//token)
  } else {
    throw new Error(`Unknown provider ${providerConfigs.provider}`)
  }

  const controller = new AbortController()
  port.onDisconnect.addListener(() => {
    controller.abort()
  })

  problem_ids.forEach(function (problem_id, i) {
    setTimeout(
       provider.generateAnswer({
        problem_id: problem_id,
        onEvent(event) {
          console.log("index event", event);
          if (event.type === 'done') {
            port.postMessage({ event: 'DONE' })
            return
          } else {
            Object.assign(event.data, {"problem_id": problem_id});
            console.log("event.data",event.data)
          }
          port.postMessage(event.data)
        },
      })
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
  if (message.type === 'OPEN_OPTIONS_PAGE') {
    Browser.runtime.openOptionsPage()
  }
})
