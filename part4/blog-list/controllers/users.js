const bcrypt = require('bcrypt')
const User = require('../models/user')

const getAllUsers = async (request, response) => {
    const users = await User.find({})
    response.json(users)
}

const createUser = async (request, response) => {
    const { username, name, password } = request.body

    if (!username || !password) {
        return response.status(400).json({
            message: 'Please, provide username and password!'
        })
    }

    if (username.length < 3 || password.length < 3) {
        return response.status(400).json({
            message: 'Username and password must have at least 3 characters!'
        })
    }

    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return response.status(400).json({
            message: `Username ${username} has been already taken!`
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username, name, passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
}

module.exports = {
    getAllUsers,
    createUser
}