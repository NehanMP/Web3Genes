const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const validator = require('validator')

// create tokens
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d'})
}

// get users details
const getUserDetails = async (req, res) => {
    try {
        const details = await User.find({ type: "USER" }).sort({ createdAt: -1 });
        res.status(200).json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// create a new user
const createUser = async (req, res) => {
    try {
        const { type, status, basic_info, contact_info, auth_info } = req.body;

        if (!basic_info || !contact_info || !auth_info) {
            return res.status(400).json({ error: 'All fields must be filled' });
        }

        
        // Validate email address
        if (!contact_info.email || !validator.isEmail(contact_info.email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        
        // This example assumes international format (like +1234567890)
        // Regular expression for basic phone number validation
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;

        // Validate phone number
        if (!contact_info.mobile_number || !phoneRegex.test(contact_info.mobile_number)) {
            return res.status(400).json({ error: 'Invalid phone number' });
        }


        const { first_name, last_name, dob, gender } = basic_info;
        const { mobile_number, email } = contact_info;

        if (!first_name || !last_name || !dob || !gender || !mobile_number || !email) {
            return res.status(400).json({ error: 'All fields must be filled' });
        }
        
        let hashedPassword = '';

        const newUser = await User.create({
            type: type || 'USER', 
            status: status || 'ONBOARD', 
            basic_info: { first_name, last_name, dob, gender },
            contact_info: { mobile_number, email },
            auth_info: { password: hashedPassword },
        });

        res.status(201).json(newUser);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ error: 'Validation error' });
        } else {
            console.error(error); 
            res.status(500).json({ error: 'Server error' });
        }
    }
};


// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields must be filled' });
    }

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        
        res.status(200).json({ email: user.contact_info.email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// admin signup
const signupAdmin = async (req, res) => {
    const {
        type,
        status,
        basic_info,
        contact_info,
        auth_info
    } = req.body;

    try {
        const admin = await User.signup(
            type,
            status,
            basic_info,
            contact_info,
            auth_info
        );

        // Create a token
        const token = createToken(admin._id)

        res.status(200).json({ email: contact_info.email, token })
    } catch (error) {
        // Error handling for failed signup
        res.status(400).json({ error: error.message });
    }
}


module.exports = {
    createUser,
    getUserDetails,
    loginUser,
    signupAdmin
}