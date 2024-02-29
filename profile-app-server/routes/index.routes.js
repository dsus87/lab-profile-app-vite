const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const router = express.Router();
const saltRounds = 10;


// POST /auth/signup
router.post('/signup', (req, res, next) => {
    const { username, password, campus, course } = req.body;

    // Check if the required fields are provided
    if (!username || !password || !campus || !course) {
        res.status(400).json({ message: "Provide username, password, campus, and course" });
        return;
    }

    // Check the users collection if a user with the same username already exists
    User.findOne({ username })
        .then((foundUser) => {
            // If the user with the same username already exists, send an error response
            if (foundUser) {
                res.status(400).json({ message: "User already exists." });
                return;
            }

            // If the username is unique, proceed to hash the password
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            // Create a new user in the database
            return User.create({ username, password: hashedPassword, campus, course });
        })
        .then((createdUser) => {
            // Deconstruct the newly created user object to omit the password
            const { username, campus, course, _id } = createdUser;
            const newUser = { username, campus, course, _id };

            // Send a json response containing the user object
            res.status(201).json({ user: newUser });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        });
});

// POST /auth/login
router.post('/login', (req, res, next) => {
    const { username, password } = req.body;

    // Check if username or password are provided as empty string
    if (!username || !password) {
        res.status(400).json({ message: "Provide username and password." });
        return;
    }

    // Check the users collection if a user with the same username exists
    User.findOne({ username })
        .then((foundUser) => {
            if (!foundUser) {
                // If the user is not found, send an error response
                res.status(401).json({ message: "User not found." })
                return;
            }

            // Compare the provided password with the one saved in the database
            const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

            if (passwordCorrect) {
                // Deconstruct the user object to omit the password
                const { _id, username, campus, course } = foundUser;
                const payload = { _id, username, campus, course };

                // Create and sign the token
                const authToken = jwt.sign(
                    payload,
                    process.env.TOKEN_SECRET,
                    { algorithm: 'HS256', expiresIn: "6h" }
                );

                // Send the token as the response
                res.status(200).json({ authToken: authToken });
            } else {
                res.status(401).json({ message: "Unable to authenticate the user" });
            }
        })
        .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

// GET /auth/verify
router.get('/verify', isAuthenticated, (req, res, next) => {   // <== CREATE NEW ROUTE
    console.log(`req.payload`, req.payload);
   // If JWT token is valid the payload gets decoded by the
    // isAuthenticated middleware and made available on `req.payload`
    console.log(`req.payload`, req.payload);
  // Send back the object with user data
    // previously set as the token payload

    res.status(200).json(req.payload);
});

// PUT /api/users
router.put('/users',  isAuthenticated, (req, res, next) => {
    const { image } = req.body;

    // Return updated user object
    res.status(200).json({ message: "User object updated successfully." });
});

// GET /api/users
router.get('/users', isAuthenticated, (req, res, next) => {

    // Return current user object
    res.status(200).json(req.payload);
});

// POST /api/upload
router.post('/upload', isAuthenticated, (req, res, next) => {
    const { file } = req.body;


    // Return uploaded image URL
    res.status(200).json({ imageUrl: "URL_of_uploaded_image" });
});

module.exports = router;
