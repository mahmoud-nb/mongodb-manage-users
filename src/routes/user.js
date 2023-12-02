const express = require('express')
const User = require('../models/user')
const authentification = require('../middlewares/authentification')
const router = new express.Router()

router.post('/api/user', async (req, res) => {
    const user = new User(req.body)
    try {
        const authToken = await user.generateAuthTokenAndSaveUser()
        res.status(201).send({ user, authToken })
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/api/users/login', async (req, res) => {
    try {
        const user = await User.findUser(req.body.email, req.body.password)
        const authToken = await user.generateAuthTokenAndSaveUser()
        res.send({ user, authToken })
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/api/users/logout', authentification, async (req, res) => {
    try {
        const reqAuthToken = req.header('authorization').replace('Bearer ', '')
        req.user.authTokens = req.user.authTokens.filter( authToken => authToken.authToken !== reqAuthToken )
        
        await req.user.save()
        res.send('User is logout')
    } catch(e) {
        res.status(500).send(e)
    }
})

router.post('/api/users/logout/everywhere', authentification, async (req, res) => {
    try {
        req.user.authTokens = []
        
        await req.user.save()
        res.send('User is logout')
    } catch(e) {
        res.status(500).send(e)
    }
})

router.get('/api/users', authentification, async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.get('/api/users/me', authentification, async (req, res) => {
    try {
        res.send(req.user)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.patch('/api/users/me', authentification, async (req, res) => {
    const userData = req.body
    const updatedInfos = Object.keys(userData)

    try {
        updatedInfos.forEach(update => req.user[update] = userData[update])
        await req.user.save()

        res.send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/api/users/me', authentification, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/api/users/:id', async (req, res) => {
    const userId = req.params.id
    try {
        const user = await User.findById(userId)
        if(!user) return res.status(404).send('User not found')

        res.send(user)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.patch('/api/users/:id', async (req, res) => {
    const userId = req.params.id
    const userData = req.body
    const updatedInfos = Object.keys(userData)

    try {
        const user = await User.findById(userId)
        if(!user) return res.status(404).send('User not found')
        updatedInfos.forEach(update => user[update] = userData[update])
        await user.save()
        res.send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/api/users/:id', async (req, res) => {
    const userId = req.params.id
    try {
        const deletedUser = await User.findByIdAndDelete(userId)
        if(!deletedUser) return res.status(404).send('User not found')
        res.send(deletedUser)
    } catch(e) {
        res.status(400).send(e)
    }
})

module.exports = router