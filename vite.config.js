import react from '@vitejs/plugin-react'
import net from 'node:net'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

function listenIpv6Loopback() {
  return {
    name: 'listen-ipv6-loopback',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        const addr = server.httpServer.address()
        const port = typeof addr === 'object' && addr ? addr.port : 5173
        const proxy = net.createServer((incoming) => {
          const upstream = net.connect({ port, host: '127.0.0.1' })
          incoming.pipe(upstream)
          upstream.pipe(incoming)
          const fail = () => {
            incoming.destroy()
            upstream.destroy()
          }
          incoming.on('error', fail)
          upstream.on('error', fail)
        })
        proxy.listen({ port, host: '::1', ipv6Only: true })
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    listenIpv6Loopback(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
});
