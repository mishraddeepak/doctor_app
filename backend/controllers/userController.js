const bcrypt = require('bcrypt')
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')



////api to register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        console.log(name, email, password)
        // hashing user
        const hashPassword = await bcrypt.hash(password, 10)
        const userData = {
            name,
            email,
            password: hashPassword
        }
        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '24hr' })
        return res.json({ success: true, token, userID: user._id })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }

}

// Api for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User not found" })

        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '24hr' })
            return res.json({ success: true, token,userID: user._id })
        }
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })

    }
}
//api to get the user
const getUserByID = async (req, res) => {
    const { userID } = req.params
    try {
        const user = await userModel.findById(userID)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { registerUser, loginUser, getUserByID }