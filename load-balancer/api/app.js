const express = require('express')
const app = express()
const port = process.env.EXPRESS_PORT ?? 5000

app.get('/', (req, res) => {
  console.log('GET /')
  res.send('Hello World!')
})

const MAX_COUNT = 10000
app.get('/cpu', (req, res) => {
  console.log('GET /cpu')
  count = 0;
  while(count < MAX_COUNT){
    console.log(count)
    count++;
  }
  res.send('/cpu')
})

const IOJOB_TIME_SECOUND = 2
const runIOJob = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))
app.get('/io', async (req, res) => {
  console.log('GET /io')
  await runIOJob(IOJOB_TIME_SECOUND * 1000)
  res.send('/io')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})