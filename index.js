const express = require('express')
const { createReadStream } = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const port = 3000
const users = {
  bo: 'pass',
  yu: '123'
}

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req, res) => {
  createReadStream('index.html').pipe(res)
})

app.post('/login', (req, res) => {
  const password = users[req.body.username]
  if (password === req.body.password) {
    res.cookie('username', req.body.username)
  }

  if (users[req.cookies.username]) {
    res.send('Hello ' + req.cookies.username)
  } else {
    res.redirect('/')
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
