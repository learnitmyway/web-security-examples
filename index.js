const express = require('express')
const http = require('http')
const https = require('https')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const crypto = require('crypto')
const { createReadStream, readFileSync } = require('fs')

const users = {
  bo: 'pass2',
  yu: '123',
  att: 'abc'
}

const balances = {
  bo: 500,
  yu: 1000,
  att: 0
}

const sessions = {}
const cookieName = 'sessionId'
const cookieOptions = {
  signed: true,
  httpOnly: true,
  secure: false,
  sameSite: 'lax'
}

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser('secret that is really hard to guess'))

app.get('/', (req, res) => {
  if (req.signedCookies.sessionId) {
    const username = sessions[req.signedCookies.sessionId]
    const balance = balances[username]
    const html = `
      <p>Hi ${username}</p>
      <p>Your balance is $${balance}</p>
      <form action="/transfer" method="post">
        <label>
          Send amount:
          <input name="amount" type="text" />
        </label>
        <label>
          To:
          <input name="to" type="text" />
        </label>
        <button type="submit">Transfer</button>
      </form>
      <a href="/logout">Logout</a>
    `
    res.send(html)
  } else {
    createReadStream('login.html').pipe(res)
  }
})

app.post('/login', (req, res) => {
  const password = users[req.body.username]
  if (password === req.body.password) {
    const sessionId = crypto.randomBytes(16).toString('hex')
    const thirtyDays = 30 * 24 * 60 * 60 * 1000
    res.cookie(cookieName, sessionId, { ...cookieOptions, maxAge: thirtyDays })
    sessions[sessionId] = req.body.username
    res.redirect('/')
  } else {
    res.send('fail!')
  }
})

app.post('/transfer', (req, res) => {
  const to = req.body.to
  const amount = Number(req.body.amount)
  const sessionId = req.signedCookies.sessionId
  const from = sessions[sessionId]
  if (
    amount > 0 &&
    balances.hasOwnProperty(from) &&
    balances.hasOwnProperty(to)
  ) {
    balances[from] -= amount
    balances[to] += amount
    res.redirect('/')
  } else {
    res.send('fail!')
  }
})

app.get('/logout', (req, res) => {
  res.clearCookie(cookieName, cookieOptions)
  res.redirect('/')
})

const httpServer = http.createServer(app)

const port = 3006
httpServer.listen(port, () => console.log(`http is listening on port ${port}!`))

const options = {
  key: readFileSync('certs/key.pem'),
  cert: readFileSync('certs/cert.pem')
}

const httpsServer = https.createServer(options, app)

const httpsPort = 443
httpsServer.listen(httpsPort, () =>
  console.log(`https is listening on port ${httpsPort}!`)
)
