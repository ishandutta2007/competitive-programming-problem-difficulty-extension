import ExpiryMap from 'expiry-map'
import { v4 as uuidv4 } from 'uuid'
import { fetchSSE } from '../fetch-sse'
import { GenerateAnswerParams, Provider } from '../types'

const cache = new ExpiryMap(10 * 1000)

export class SPOJProvider implements Provider {
  constructor(private token: string) {
    this.token = token
  }

  async generateAnswer(params: GenerateAnswerParams) {
    let conversationId: string | undefined
    console.log("params", params)
    const cleanup = () => { }

    await fetchSSE(`https://www.spoj.com/ranks/${params.problem_id}/`, {
      method: 'GET',
      signal: params.signal,
      headers: {
        'Content-Type': 'text/html',
        'Authority': 'www.spoj.com',
        'Access-Control-Allow-Origin': '*',
        'Method': 'GET',
      },
      onMessage(message: string) {
        console.debug('sse message create_date', message)
        const users_accepted = message.data.message.users_accepted
        if (users_accepted > 0){
          const create_date = message.data.message.create_date.replace(/\r?\n|\r/g, ' ').trim();
          const d = new Date();
          const ms = Date.parse(d);
          console.debug('sse message ms', ms)
          var k = ms - Date.parse( create_date );
          console.debug('sse message create_date', create_date)
          const yrs = k/1000/86400/365
          console.debug('sse message create_date', k, yrs)
          const score = Math.min(255, 5*2550*yrs/users_accepted)
          console.debug('sse message score', score)
          console.debug('sse message users_accepted', users_accepted)
          params.onEvent({
            type: 'answer',
            data: {
              score: score
            },
          })
        }
      },
    })

    await fetchSSE(`https://www.spoj.com/problems/${params.problem_id}/`, {
      method: 'GET',
      signal: params.signal,
      headers: {
        'Content-Type': 'text/html',
        'Authority': 'www.spoj.com',
        'Access-Control-Allow-Origin': '*',
        'Method': 'GET',
      },
      onMessage(message: string) {
        console.debug('sse message users_accepted', message)
        const users_accepted = message.data.message.users_accepted
        if (users_accepted > 0){
          const create_date = message.data.message.create_date.replace(/\r?\n|\r/g, ' ').trim();
          const d = new Date();
          const ms = Date.parse(d);
          console.debug('sse message ms', ms)
          var k = ms - Date.parse( create_date );
          console.debug('sse message create_date', create_date)
          const yrs = k/1000/86400/365
          console.debug('sse message create_date', k, yrs)
          const score = Math.min(255, 5*2550*yrs/users_accepted)
          console.debug('sse message score', score)
          console.debug('sse message users_accepted', users_accepted)          
          params.onEvent({
            type: 'answer',
            data: {
              score: score
            },
          })
        }
      },
    })
    return { cleanup }
  }
}
