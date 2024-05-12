const express = require('express')
const { createUser, getUserDetails, loginUser, signupAdmin } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupAdmin)


// Require authentication for public routes
router.use(requireAuth)


// GET all user information 
router.get('/details', getUserDetails)

// POST new user information
router.post('/new', createUser)


module.exports = router