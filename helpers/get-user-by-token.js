const jwt = require('jsonwebtoken')

const User = require("../models/User")
const getToken = require('./get-token')

//get user by jwt token
const getUserByToken = async (token) => {
    if (!token) {
        return res.status(401).json({ message: 'Tente novamente!'})
    }


    const decoded = jwt.verify(token, 'nossosecret')
    
    const userId = decoded.id

    const user = await User.findOne({ _id: userId })

    return user
}

module.exports = getUserByToken