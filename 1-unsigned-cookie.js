const express = require('express')
const { createReadStream } = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const port = 3001
const users = {
  bo: 'pass',
  yu: '123'
}

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req, res) => {
  if (req.cookies.username) {
    res.send('Hello ' + req.cookies.username)
  } else {
    createReadStream('login.html').pipe(res)
  }
})

app.post('/login', (req, res) => {
  const password = users[req.body.username]
  if (password === req.body.password) {
    res.cookie('username', req.body.username)
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
