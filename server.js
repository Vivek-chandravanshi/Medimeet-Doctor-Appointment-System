// const { configDotenv } = require('dotenv')
const express = require('express')
const colors = require('colors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const connectDB = require('./config/database')
const path = require('path')

//rest object
const app = express()
//middlewares
app.use(express.json())
app.use(morgan('dev'))


app.use('/api/v1/user', require('./routes/userRoutes'))
app.use('/api/v1/admin', require('./routes/adminRoutes'))
app.use('/api/v1/doctor', require('./routes/doctorRoutes'))

require('dotenv').config();


app.use(express.static(path.join(__dirname, './client/build')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})



const port = process.env.PORT || 8080
app.listen(port, ()=>{
    //console.log(`server running at port no. ${port}`.bgCyan.white)
})

connectDB()


//