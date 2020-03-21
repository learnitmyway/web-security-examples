const express = require('express')
const crypto = require('crypto')
const { createReadStream } = require('fs')
const escapeHtml = require('escape-html')

const port = 3007

const app = express()

app.use(function(req, res, next) {
  const nonce = crypto.randomBytes(16).toString('hex')
  res.setHeader(
    'Content-Security-Policy',
    `script-src 'unsafe-inline' https: 'nonce-${nonce}' 'strict-dynamic'`
  )
  return next()
})

app.get('/query', (req, res) => {
  const html = `<p>Your query: ${req.query.q}</p>`
  res.send(html)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
