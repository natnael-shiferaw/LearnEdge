
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI= process.env.MONGODB_URI

cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
});

//middleware
app.use(express.json());

//database connection
mongoose.connect(MONGODB_URI)
    .then(console.log("connected to database"))
    .catch((e) => console.log(e))

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
