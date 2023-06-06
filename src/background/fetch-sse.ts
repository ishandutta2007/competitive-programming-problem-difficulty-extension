import { createParser } from 'eventsource-parser'
import { isEmpty } from 'lodash-es'
import { streamAsyncIterable } from './stream-async-iterable.js'
import * as cheerio from 'cheerio';

export async function fetchSSE(
  resource: string,
  options: RequestInit & { onMessage: (message: string) => void },
) {
  const { onMessage, ...fetchOptions } = options
  const resp = await fetch(resource, fetchOptions)
  console.log("fetchSSE resp:", resp)
  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}))
    throw new Error(!isEmpty(error) ? JSON.stringify(error) : `${resp.status} ${resp.statusText}`)
  }
  for await (const chunk of streamAsyncIterable(resp.body!)) {
    try {
      const str0 = new TextDecoder().decode(chunk)
      const htmlDoc = cheerio.load(str0)
      const users_accepted  = Number(htmlDoc('table tr.lightrow td:nth-child(1)').text())
      let j = {
        data: {
          message: {
            users_accepted: users_accepted
          }
        }
      };
      onMessage(j);
    } catch (err) {
      console.log("fetchSSE err:", err)
    }
  }
}
