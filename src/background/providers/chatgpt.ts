import ExpiryMap from 'expiry-map'
import { v4 as uuidv4 } from 'uuid'
import { fetchSSE } from '../fetch-sse'
import { GenerateAnswerParams, Provider } from '../types'

const KEY_ACCESS_TOKEN = 'accessToken'

const cache = new ExpiryMap(10 * 1000)

export class ChatGPTProvider implements Provider {
  constructor(private token: string) {
    this.token = token
  }

  async generateAnswer(params: GenerateAnswerParams) {
    let conversationId: string | undefined

    const cleanup = () => {
    }

    await fetchSSE('https://www.spoj.com/ranks/ANADIV/', {
      method: 'GET',
      signal: params.signal,
      headers: {
        'Content-Type': 'text/html',
        'Authority': 'www.spoj.com',
        'Access-Control-Allow-Origin': '*',
        'Method': 'GET',
        // 'Path': '/ranks/ANADIV',
        // 'url': "https://facebook/api/login",
        'Cookie': 'SPOJ=47ridequis6iojn3coi324efg3; pspdf=; googtrans=/auto/en; comments_table=none; _ga=GA1.2.1310880144.1682767203; _hjSessionUser_334656=eyJpZCI6IjY0NTJmN2I1LTgwYWUtNWQyYy1hNTU5LTgzZmViNzY4OWRiNyIsImNyZWF0ZWQiOjE2ODI3NjcyMDI2MzcsImV4aXN0aW5nIjp0cnVlfQ==; autologin_hash=fa7bcaf8496457c60bd01701b8a97cec; autologin_login=ishandutta2007; _gid=GA1.2.77752192.1685906876; __utma=102885826.1310880144.1682767203.1685984964.1685984964.1; __utmc=102885826; __utmz=102885826.1685984964.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); _hjIncludedInSessionSample_334656=1; _hjSession_334656=eyJpZCI6ImEzZGFjZTM3LTFlODctNGY0OC04YjAyLTkwMmFjYzUxMzhlNiIsImNyZWF0ZWQiOjE2ODYwMjcwNjc5NjYsImluU2FtcGxlIjp0cnVlfQ==; _hjAbsoluteSessionInProgress=0; cto_bundle=clp-J19sSEpRU1BYWkE2bG1wVmRjdDhEUlVQNnNTNW1zZHdURFd6WDdCclRvYlpRaDJ6dHpLVTRXT082JTJGcFRZeVdpZ2RjZ25mVWJpTnBBdE1zZ0s5ZDh4dllTS1ZLYkwlMkJrWFM4SXYzU1FWbVVLcSUyQlBWR0hTNG16VzlXR0dtemdmYktrZ3BXMk5zTE9QVFh5VnY1aGExdms1akhBTk1MTWhzTyUyRjJhUWhqd2RqamZxSWVteG45VG9tZEhod0xuNFBrT0xycA'
        // Authorization: `Bearer ${this.token}`,
      },
      onMessage(message: string) {
        console.debug('sse message', message)
      },
    })
    return { cleanup }
  }
}
