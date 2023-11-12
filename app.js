
const express = require('express')
const app = express();

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

app.use(bodyParser.json())

const authRoute = require('./routes/auth')
app.use('/api/user',authRoute);
mongoose.connect(process.env.DB_CONNECTOR).then(r => {
    console.log("Database running!!")
});
app.listen(3000,()=>{
    console.log('Server is running!')
})

