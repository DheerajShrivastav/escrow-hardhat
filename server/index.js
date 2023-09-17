const express = require('express')
const app = express()
const existingContracts = []
const cors = require('cors')

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send(existingContracts)
})

app.post('/add-contract', (req, res) => {
  const newContract = req.body
  existingContracts.push(newContract)
  res.send(existingContracts)
})

const PORT = 5000
app.listen(PORT, () => console.log('Server is running  ' + PORT))
