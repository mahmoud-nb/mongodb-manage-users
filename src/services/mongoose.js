require('dotenv').config()
const mongoose = require('mongoose')

async function connectDB () {
    await mongoose.connect(process.env.MONGO_URL).catch(error => console.error(error))
    console.log('Db connecté!')
}

module.exports = {
    connectDB
}