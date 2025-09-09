// lib/streaming-text-response.ts

export class StreamingTextResponse extends Response {
  constructor(stream: ReadableStream<Uint8Array>, init: ResponseInit = {}) {
    const headers = new Headers(init.headers);
    headers.set('Content-Type', 'text/plain; charset=utf-8');
    headers.set('Transfer-Encoding', 'chunked');
    super(stream, {
      ...init,
      headers,
    });
  }
}

