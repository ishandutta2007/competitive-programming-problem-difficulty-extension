import ExpiryMap from 'expiry-map'
import { v4 as uuidv4 } from 'uuid'
import { fetchSSE } from '../fetch-sse'
import { GenerateAnswerParams, Provider } from '../types'

// async function request(token: string, method: string, path: string, data?: unknown) {
//   return fetch(`https://chat.openai.com/backend-api${path}`, {
//     method,
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     body: data === undefined ? undefined : JSON.stringify(data),
//   })
// }

// export async function sendMessageFeedback(token: string, data: unknown) {
//   await request(token, 'POST', '/conversation/message_feedback', data)
// }

// export async function setConversationProperty(
//   token: string,
//   conversationId: string,
//   propertyObject: object,
// ) {
//   await request(token, 'PATCH', `/conversation/${conversationId}`, propertyObject)
// }

const KEY_ACCESS_TOKEN = 'accessToken'

const cache = new ExpiryMap(10 * 1000)

// export async function getChatGPTAccessToken(): Promise<string> {
//   if (cache.get(KEY_ACCESS_TOKEN)) {
//     return cache.get(KEY_ACCESS_TOKEN)
//   }
//   const resp = await fetch('https://chat.openai.com/api/auth/session')
//   if (resp.status === 403) {
//     throw new Error('CLOUDFLARE')
//   }
//   const data = await resp.json().catch(() => ({}))
//   if (!data.accessToken) {
//     throw new Error('UNAUTHORIZED')
//   }
//   cache.set(KEY_ACCESS_TOKEN, data.accessToken)
//   return data.accessToken
// }

export class ChatGPTProvider implements Provider {
  constructor(){//private token: string) {
    // this.token = token
  }

  // private async fetchModels(): Promise<
  //   { slug: string; title: string; description: string; max_tokens: number }[]
  // > {
  //   const resp = await request(this.token, 'GET', '/models').then((r) => r.json())
  //   return resp.models
  // }

  // private async getModelName(): Promise<string> {
  //   try {
  //     const models = await this.fetchModels()
  //     return models[0].slug
  //   } catch (err) {
  //     console.error(err)
  //     return 'text-davinci-002-render'
  //   }
  // }

  async generateAnswer(params: GenerateAnswerParams) {
    // let conversationId: string | undefined

    // const cleanup = () => {
    //   if (conversationId) {
    //     setConversationProperty(this.token, conversationId, { is_visible: false })
    //   }
    // }

    // const modelName = await this.getModelName()
    // console.log('Using model:', modelName, params.conversationId, params.parentMessageId)
    // console.log("Will call GET from generateAnswer in ChatGPTProvider", params)

    await fetchSSE('https://www.spoj.com/ranks/ANADIV/', {
      method: 'GET',
      signal: params.signal,
      headers: {
        'Content-Type': 'text/html',
        'Authority': 'www.spoj.com',
        'Method': 'GET',
        'Path': '/ranks/ANADIV/',
        // 'Cookie': 'SPOJ=47ridequis6iojn3coi324efg3; pspdf=; googtrans=/auto/en; comments_table=none; _ga=GA1.2.1310880144.1682767203; _hjSessionUser_334656=eyJpZCI6IjY0NTJmN2I1LTgwYWUtNWQyYy1hNTU5LTgzZmViNzY4OWRiNyIsImNyZWF0ZWQiOjE2ODI3NjcyMDI2MzcsImV4aXN0aW5nIjp0cnVlfQ==; autologin_hash=fa7bcaf8496457c60bd01701b8a97cec; autologin_login=ishandutta2007; _gid=GA1.2.77752192.1685906876; __utma=102885826.1310880144.1682767203.1685984964.1685984964.1; __utmc=102885826; __utmz=102885826.1685984964.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); _hjIncludedInSessionSample_334656=1; _hjSession_334656=eyJpZCI6ImEzZGFjZTM3LTFlODctNGY0OC04YjAyLTkwMmFjYzUxMzhlNiIsImNyZWF0ZWQiOjE2ODYwMjcwNjc5NjYsImluU2FtcGxlIjp0cnVlfQ==; _hjAbsoluteSessionInProgress=0; cto_bundle=clp-J19sSEpRU1BYWkE2bG1wVmRjdDhEUlVQNnNTNW1zZHdURFd6WDdCclRvYlpRaDJ6dHpLVTRXT082JTJGcFRZeVdpZ2RjZ25mVWJpTnBBdE1zZ0s5ZDh4dllTS1ZLYkwlMkJrWFM4SXYzU1FWbVVLcSUyQlBWR0hTNG16VzlXR0dtemdmYktrZ3BXMk5zTE9QVFh5VnY1aGExdms1akhBTk1MTWhzTyUyRjJhUWhqd2RqamZxSWVteG45VG9tZEhod0xuNFBrT0xycA',
      },
      onMessage(message: string) {
        console.debug('sse message', message)
        // if (message === '[DONE]') {
        //   params.onEvent({ type: 'done' })
        //   cleanup()
        //   return
        // }
        // let data
        // try {
        //   data = JSON.parse(message)
        // } catch (err) {
        //   if (new Date(message) !== 'Invalid Date' && !isNaN(new Date(message)))
        //     console.debug('This is known issue')
        //   else console.error(err)
        //   return
        // }
        // const text = data.message?.content?.parts?.[0] + '✏'
        // if (text) {
        //   conversationId = data.conversation_id
        //   params.onEvent({
        //     type: 'answer',
        //     data: {
        //       text,
        //       // messageId: data.message.id,
        //       // conversationId: data.conversation_id,
        //       // parentMessageId: data.parent_message_id,
        //     },
        //   })
        // }
        // return true
      },
    })
    return { }//cleanup }
  }
}
