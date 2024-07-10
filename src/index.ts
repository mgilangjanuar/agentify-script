import http from 'http'
import ivm from 'isolated-vm'

const _runScript = async (code: string) => {
  const isolate = new ivm.Isolate({ memoryLimit: 128 })
  const context = isolate.createContextSync()
  const jail = context.global
  jail.setSync('global', jail.derefInto())

  const hostile = isolate.compileScriptSync(code)
  const fn = await hostile.run(context)
  return fn
}

const runScript = async (code: string) => {
  return eval(code)
}

http.createServer((req, res) => {
  if (req.headers.authorization !== `Bearer ${process.env.SECRET}`) {
    res.writeHead(401, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Unauthorized' }))
    return
  }

  let body = ''
  req.on('data', (chunk) => {
    body += chunk
  })
  req.on('end', async () => {
    if (!body) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Bad Request' }))
      return
    }

    try {
      const json = JSON.parse(body)
      const resp = await (await runScript(`(${json.script})`))(...json.args)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ result: resp }))
    } catch (error: any) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: error.message }))
    }
  })
}).listen(process.env.PORT || 4014)

console.log(`Server running at http://localhost:${process.env.PORT || 4014}`)
