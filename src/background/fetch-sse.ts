import { createParser } from 'eventsource-parser'
import { isEmpty } from 'lodash-es'
import { streamAsyncIterable } from './stream-async-iterable.js'

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
  const parser = createParser((event) => {
    console.log("event:", event)
    if (event.type === 'event') {
      onMessage(event.data)
    }
  })
  for await (const chunk of streamAsyncIterable(resp.body!)) {
    try {
      let str = new TextDecoder().decode(chunk)
      // console.log("fetchSSE str:", str)
      str = "<div>abc</div>"
      str = "apples"
      console.log("fetchSSE new str:", str)
      parser.feed(str)
    } catch (err) {
      console.log("fetchSSE err:", err)
    }
  }
}
