const express = require("express")
const app = express()
require('dotenv').config()

const PORT = process.env.PORT || 6599
require("./db")

const cors = require('cors')
app.use(cors())

const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(express.static('Upload'))

const Adminrouter = require("./Router/AdminRoutes")
app.use("/api",Adminrouter)

const userStaffRouter = require("./Router/userStaffRouter")
app.use("/api",userStaffRouter)

const FormRouter = require("./Router/FormRouter")
app.use("/api",FormRouter)

app.listen(PORT,()=>{
    console.log(`Server listening on Port : ${PORT}`)
})