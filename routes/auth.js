/* eslint-disable no-undef */
require('dotenv').config();
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = process.env.JWT_SECRET;

//ROUTE 1: Create a user using : POST "/api/auth/createuser". No login required
router.post(
    "/createuser",
    [
        body("name", "Enter a valid name").isLength({ min: 3 }),
        body("email", "Enter a valid email").isEmail(),
        body("password", "password must be 5 characters").isLength({ min: 5 }),
    ],
    async (req, res) => {
        // if there are errors return bad request and the errors
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }
        try {
            // check whether the user with this email exists already

            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res
                    .status(400)
                    .json({ success, error: "sorry a user with this email already exists" });
            }
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            // create a new user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            })
            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);

            // res.json(user)
            success = true;
            res.json({ success, authtoken })
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);

//ROUTE 2: Authenticate a user using: POST "api/auth/login". No login requrired
router.post(
    "/login",
    [
        body("email", "Enter a valid email").isEmail(),
        body("password", "Password cannot be blank").exists(),
    ],
    async (req, res) => {
        // if there are errors return bad request and the errors
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ success, error: " Please try to login with correct credentials" });
            }
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                success = false;
                return res.status(400).json({ success, error: " Please try to login with correct credentials" });
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authtoken })
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

//   ROUTE 3: Get loggedin User details using: POST "/api/auth/getuser". login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error")

    }
})
//  ROUTE 4: Route to update user details (PUT "/api/auth/updateuser/:id"). Requires user to be logged in.
router.put('/updateuser', fetchuser, async (req, res) => {
    try {
        // Extract user ID from request
        const userId = req.user.id;

        // Extract updated user details from request body
        const { name, email, password } = req.body;

        // Find user by ID
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user fields if provided in the request
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            // Hash the new password before saving
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        // Save updated user details
        user = await user.save();

        // Exclude sensitive information from response
        const updatedUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            // Exclude password from response
        };

        // Send updated user details in response
        res.json({ user: updatedUser });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
