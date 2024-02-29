import  express  from "express";
import { createCar, deleteCar, readCar, updateCar } from "../controller/carController";

const app = express()

app.use(express.json())

app.get(`/car`, readCar)
app.post(`/car`, createCar)

app.put(`/car/:id`, updateCar)
app.delete(`/car/:id`, deleteCar)

export default app