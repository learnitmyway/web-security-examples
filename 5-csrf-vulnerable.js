const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const crypto = require('crypto')
const { createReadStream } = require('fs')

const port = 3005
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
    res.cookie(cookieName, sessionId, {
      signed: true,
      httpOnly: true
    })
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
  res.clearCookie(cookieName)
  res.redirect('/')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
