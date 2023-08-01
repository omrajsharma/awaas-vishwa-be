const bcrypt = require('bcryptjs')
const User = require('../model/UserModel');

const salt = bcrypt.genSaltSync(10);
const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const usernameFormat = /^[A-Za-z][A-Za-z0-9_]{1,29}$/
const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const registerUser = async (req, res) => {
    const {name, phone, email, username, password} = req.body;

    if (name.length < 2 || name.length > 50) {
        res.status(400).json({error: 'Name should be greater than 1 and less than equal 50 characters'})
        return
    }
    if (phone < 1000000000) {
        res.status(400).json({error: 'Invalid Phone Number'})
        return
    }
    if (!mailformat.test(email)) {
        res.status(400).json({error: 'Invalid Email Address'})
        return
    }
    if (!usernameFormat.test(username)) {
        res.status(400).json({error: 'Invalid username! first character should be alphabet [A-Za-z] and other characters can be alphabets, numbers or an underscore so, [A-Za-z0-9_].'})
        return
    }
    if (!passwordFormat.test(password)) {
        res.status(400).json({error: 'password should have minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:'})
        return
    }

    try {
        const userDoc = await User.create({
            name, 
            phone,
            email,
            username,
            password : bcrypt.hashSync(password, salt)
        });
        res.status(201).json(userDoc);
    } catch (err) {
        res.status(400).end('bad request')
    }
}

module.exports = { registerUser }