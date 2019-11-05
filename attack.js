const express = require('express')
const { createReadStream } = require('fs')

const port = 5000
const app = express()

app.get('/', (req, res) => {
  createReadStream('attack.html').pipe(res)
})

app.listen(port, () => console.log(`Attacker app listening on port ${port}!`))
