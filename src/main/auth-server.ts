import http from 'http'
import { AddressInfo } from 'net'

const SUCCESS_HTML = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Authentication Successful</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    display: flex; align-items: center; justify-content: center; height: 100vh;
    margin: 0; background: #f8fafc; color: #1e293b; }
  .card { text-align: center; padding: 3rem; }
  h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
  p { color: #64748b; }
</style></head>
<body><div class="card"><h1>Signed in successfully</h1><p>You can close this tab and return to Component Studio.</p></div></body>
</html>`

export class AuthCallbackServer {
  private server: http.Server | null = null
  private port = 0

  async start(onToken: (token: string) => void): Promise<number> {
    await this.stop()

    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        const url = new URL(req.url || '/', `http://localhost:${this.port}`)
        console.log(`[AuthServer] ${req.method} ${url.pathname}`)

        if (url.pathname === '/auth/callback') {
          const token = url.searchParams.get('token')
          console.log(`[AuthServer] Token received: ${token ? `${token.substring(0, 20)}...` : 'NONE'}`)

          res.writeHead(200, {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*'
          })
          res.end(SUCCESS_HTML)

          if (token) {
            console.log('[AuthServer] Sending token to renderer via IPC')
            onToken(token)
          } else {
            console.warn('[AuthServer] No token found in callback URL')
          }

          setTimeout(() => this.stop(), 1000)
          return
        }

        res.writeHead(404)
        res.end('Not found')
      })

      this.server.on('error', (err) => {
        console.error('[AuthServer] Server error:', err)
        reject(err)
      })

      this.server.listen(0, '127.0.0.1', () => {
        const addr = this.server!.address() as AddressInfo
        this.port = addr.port
        console.log(`[AuthServer] Listening on http://127.0.0.1:${this.port}`)
        resolve(this.port)
      })
    })
  }

  async stop(): Promise<void> {
    if (!this.server) return
    console.log('[AuthServer] Shutting down')
    return new Promise((resolve) => {
      this.server!.close(() => {
        this.server = null
        resolve()
      })
    })
  }
}
