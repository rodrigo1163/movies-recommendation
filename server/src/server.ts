import express from 'express'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())


app.listen(3336, () => {
    console.log(`running port in 3336`)
})