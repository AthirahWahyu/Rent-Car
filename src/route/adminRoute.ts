import express from "express"
import { verifyAdmin } from "../middleware/verifyAdmin"
import { createAdmin, deleteAdmin, login, readAdmin, updateAdmin } from "../controller/adminController"

const app = express()

app.use(express.json())

app.get(`/admin`, verifyAdmin, readAdmin)
app.post(`/admin`, createAdmin)

app.put(`/admin/: id`, verifyAdmin, updateAdmin)
app.delete(`/admin/: id`, verifyAdmin, deleteAdmin)

app.post(`/admin/login`, login)

export default app