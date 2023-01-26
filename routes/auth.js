const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")

router.post("/register", async (req,res) => {
    try {
        //generate hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        
        //create new user
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            email: (req.body.email).toLowerCase()    
        })
        
        //save user and return response
        const user = await newUser.save();
        res.status(200).json(user)
    } catch (error) {
        console.log(error);
    }
})

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("user not found");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json("wrong password");

        if(user && validPassword){
            req.session.user = { name: 'Chetan' };

            res.status(200).json(user)
        }
    } catch (error) {
        console.log(error);
    }
})
module.exports = router