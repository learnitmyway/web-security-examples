const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const crypto = require('crypto')
const { createReadStream } = require('fs')

const port = 3004
const users = {
  bo: 'pass2',
  yu: '123'
}

const sessions = {}
const cookieName = 'sessionId'

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser('secret that is really hard to guess'))

app.get('/', (req, res) => {
  if (req.signedCookies.sessionId) {
    res.send('Hello ' + sessions[req.signedCookies.sessionId])
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

app.get('/logout', (req, res) => {
  res.clearCookie(cookieName)
  res.redirect('/')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
