
const User = require('../../models/User')
const bcrypt = require('bcryptjs')

// Register a new User
const registerUser = async (req, res) => {
    console.log("🎯 registerUser body:", req.body);
    // get user input
    const {username, email, password} = req.body;
    // check if the user exists
    const existingUser = await User.findOne({$or: [{email}, {username}]});
    if(existingUser) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        })
    };
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create a new user
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role
    });
    // save the new user
    await newUser.save();
    
    return res.status(201).json({
        success: true,
        message: "User created successfully"
    });
}

module.exports = {registerUser};
