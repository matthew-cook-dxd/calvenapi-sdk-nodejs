/** Copyright 2023 Calven Pty Ltd

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, 
provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE 
INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY 
SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, 
WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION 
WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

*/

import { ServiceError } from '../exception'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

export class BaseClient<T, R> {
  axios: AxiosInstance

  constructor(
    public readonly baseUrl: string,
    public readonly path = '',
    public readonly correlationId?: string
  ) {
    if (!baseUrl) {
      throw new ServiceError(
        500,
        `Unable to construct ${this.constructor.name} due to missing service URL`,
        'Missing service URL',
        {
          baseUrl,
          path,
        }
      )
    }

    try {
      const url = new URL(path, baseUrl).toString()

      this.axios = axios.create({
        baseURL: url,
        // headers: {
        //   'x-calven-region': 'ause1'
        // }
      })
    } catch (e) {
      throw new ServiceError(
        500,
        `Unable to construct ${this.constructor.name} with baseUrl '${baseUrl}' and path '${path}'`,
        'Invalid service URL',
        e
      )
    }
  }

  async post(entity: Partial<T>, config?: AxiosRequestConfig): Promise<R> {
    const res = await this.axios.post('/', entity, config)

    return res.data as R
  }
}
