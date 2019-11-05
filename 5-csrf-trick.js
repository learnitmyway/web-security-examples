const express = require('express')
const { createReadStream } = require('fs')

const port = 5005
const app = express()

app.get('/', (req, res) => {
  createReadStream('5-csrf-trick.html').pipe(res)
})

app.get('/attack', (req, res) => {
  createReadStream('5-csrf-attack.html').pipe(res)
})

app.listen(port, () => console.log(`Attacker app listening on port ${port}!`))
