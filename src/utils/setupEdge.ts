import { Edge } from 'edge.js'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Express } from 'express'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function setupEdge(app: Express) {
  const edgeEngine = Edge.create({ cache: false })

  edgeEngine.global('formatDate', (date: Date) => {
    if (!date) return ''
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  })

  edgeEngine.global('expiration_status', (expires_at: any) => {
    const today = new Date();
    const expire = new Date(expires_at);

    const todayStr = today.toISOString().split('T')[0];
    const expireStr = expire.toISOString().split('T')[0];

    if (expireStr === todayStr) return 'orange';
    if (expire > today) return 'green';
    return 'red';
  })

  const viewsPath = path.join(__dirname, "../..", 'views')
  edgeEngine.mount(viewsPath)

  app.engine('edge', async (filePath, options, callback) => {
    try {
      const viewName = path
        .relative(viewsPath, filePath)
        .replace(/\\/g, '/')
        .replace('.edge', '')

      const html = await edgeEngine.render(viewName, options)
      return callback(null, html)
    } catch (err) {
      return callback(err)
    }
  })

  app.set('views', viewsPath)
  app.set('view engine', 'edge')
}
