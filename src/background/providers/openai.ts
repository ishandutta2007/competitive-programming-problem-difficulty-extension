import { fetchSSE } from '../fetch-sse'
import { GenerateAnswerParams, Provider } from '../types'

export class OpenAIProvider implements Provider {
  constructor(private token: string, private model: string) {
  }
}
