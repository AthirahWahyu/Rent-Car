import express from "express"
import { verifyAdmin } from "../middleware/verifyAdmin"
import { createRent, deleteRent, readRent, updateRent } from "../controller/rentController"

const app = express()

app.use(express.json())

app.get(`/rent`, readRent)
app.post(`/rent`,  createRent)

app.put(`/rent/: id`, updateRent)
app.delete(`/rent/: id`, deleteRent)

export default app 