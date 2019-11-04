const express = require('express')
const { createReadStream } = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const port = 3002
const users = {
  bo: 'pass',
  yu: '123'
}

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser('secret that is really hard to guess'))

app.get('/', (req, res) => {
  if (req.signedCookies.username) {
    res.send('Hello ' + req.signedCookies.username)
  } else {
    createReadStream('login.html').pipe(res)
  }
})

app.post('/login', (req, res) => {
  const password = users[req.body.username]
  if (password === req.body.password) {
    res.cookie('username', req.body.username, { signed: true })
    res.redirect('/')
  } else {
    res.send('fail!')
  }
})

app.get('/logout', (req, res) => {
  res.clearCookie('username')
  res.redirect('/')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
