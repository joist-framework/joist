import { service } from '@joist/di';

@service()
export class HttpService {
  get<T>(input: string, init?: RequestInit): Promise<T> {
    return fetch(input, init).then((res) => res.json());
  }

  post<P extends object, R>(input: string, data: P, init?: RequestInit): Promise<R> {
    return fetch(input, {
      ...init,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  }
}
