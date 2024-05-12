const mongoose = require('mongoose')
const cryptoJS = require('crypto-js')
const validator = require('validator')

const Schema = mongoose.Schema

const userDetailsSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    basic_info: {
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        dob: {
            type: Date,
            required: true
        },
        gender: {
            type: String,
            required: true
        }
    },
    contact_info: {
        mobile_number: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        }
    },
    auth_info: {
        password: {
            type: String,
        }
    }
}, { timestamps: true })


// static sign Up method
userDetailsSchema.statics.signup = async function(type, status, basic_info, contact_info, auth_info) {

    if (!type || !status || 
        !basic_info || !basic_info.first_name || !basic_info.last_name || !basic_info.dob || !basic_info.gender ||
        !contact_info || !contact_info.mobile_number || !contact_info.email ||
        !auth_info || !auth_info.password) {
        throw new Error('All fields must be filled');
    }

    if (!validator.isEmail(contact_info.email)){
        throw Error('Email is not valid')
    }

    if (!validator.isStrongPassword(auth_info.password)){
        throw Error('Password not strong enough')
    }

    // Check if ADMIN already exists
    const userExists = await this.findOne({ 'contact_info.email': contact_info.email });
    if (userExists) {
        throw new Error('Admin email already in use');
    }

    // Check for password
    if (!auth_info.password || auth_info.password.trim() === '') {
        throw new Error('Password is required');
    }

    const hashedPassword = cryptoJS.SHA3(auth_info.password, { outputLength: 512 }).toString(cryptoJS.enc.Hex);

    const user = await this.create({
        type,
        status,
        basic_info: basic_info,
        contact_info: contact_info,
        auth_info: { password: hashedPassword },
    });

    return user;
};


// Compare the passwords
const comparePassword = (incomingPassword, storedHash) => {

    const hashedPassword = cryptoJS.SHA3(incomingPassword, { outputLength: 512 }).toString(cryptoJS.enc.Hex);

    return hashedPassword === storedHash;
};



// static login method
userDetailsSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw new Error('All fields must be filled');
    }

    const user = await this.findOne({ 'contact_info.email': email });
    if (!user) {
        throw new Error('User not found');
    }

    // check whether the passwords match
    const isValid = comparePassword(password, user.auth_info.password);

    if (!isValid) {
        throw new Error('Incorrect password');
    }

    return user;
};


module.exports = mongoose.model('userDetails', userDetailsSchema)
