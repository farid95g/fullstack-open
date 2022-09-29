const bcrypt = require('bcrypt')
const User = require('../models/user')

const getAllUsers = async (request, response) => {
    const users = await User.find({})
    response.json(users)
}

const createUser = async (request, response) => {
    const { username, name, password } = request.body

    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return response.status(400).json({
            error: `Username ${username} has been already taken.`
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