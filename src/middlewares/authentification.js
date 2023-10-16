const jwt = require('jsonwebtoken')
const User = require('../models/user')
const secret = require('../config').secret

const authentification = async (req, res, next) => {
    try {
        if (!req.headers['authorization']) return res.status(401).send({ message: 'No token provided.' })

        const authToken = req.header('authorization').replace('Bearer ', '')
        const decodedToken = jwt.verify(authToken, secret)
        const user = await User.findOne({ _id: decodedToken._id, 'authTokens.authToken': authToken })

        if (!user) throw new Error()

        req.user = user
        next()
    } catch(error) {
        res.status(401).send({ message: 'No token provided...' })
    }
}

module.exports = authentification