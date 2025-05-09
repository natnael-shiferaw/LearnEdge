
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Register a new User
const registerUser = async (req, res) => {
    console.log("🎯 registerUser body:", req.body);
    // get user input
    const { username, email, password, role = 'user' } = req.body;
    // check if the user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
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

// Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body();
    const checkUser = await User.findOne({ email });
    const comparedPassword = await bcrypt.compare(password, checkUser.password);

    //check if user credential is valid
    if (!checkUser || !comparedPassword) {
        return res.status(401).json({
            success: false,
            message: "Invalid Credentials"
        });
    }
    // create an access token
    const accessToken = jwt.sign({
        _id: checkUser._id,
        username: checkUser.username,
        email: checkUser.email,
        role: checkUser.role
    }, 'JWT_SECRET', { expiresIn: '120m' });

    return res.status(200).json({
        success: true,
        message: "Logged In successfully",
        data: {
            accessToken,
            user: {
                _id: checkUser._id,
                username: checkUser.username,
                email: checkUser.email,
                role: checkUser.role
            }
        }
    })
}

module.exports = { registerUser };
