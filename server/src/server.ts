import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import { router } from './router'

const app = express()

app.use(express.json())
app.use(cors())
app.use(router)


app.listen(3336, () => {
    console.log(`running port in 3336`)
})