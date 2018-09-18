const express = require('express');
const routes = express.Router();
const passport = require('../config/passport-config');

var jwt = require('jsonwebtoken');
var User = require('../models/user');
var bcrypt = require('bcrypt');

const saltRounds = 10;

routes.post('/register', async (req, res, next) => {
    try {
        const usr = req.body.username;
        const psw = req.body.password;
        salt = await bcrypt.genSalt(saltRounds);
        hash = await bcrypt.hash(psw, salt);

        const newUser = new User({ username: usr, password: hash });
        user = await newUser.save().exec();
        res.send({ message: 'success' });
    } catch (error) {
        next(error);
    }
});

routes.post('/login', async (req, res, next) => {

    try {
        const usr = req.body.username;
        const psw = req.body.password;

        const user = await User.findOne({ "username": usr }).exec();
        if (user) {
            resp = await bcrypt.compare(psw, user.password);
            if (resp) {
                var token = jwt.sign({
                    id: user._id
                }, 'nancy', { expiresIn: '10h' });
                //https://dev.to/neilmadden/7-best-practices-for-json-web-tokens

                res.json({ message: "ok", token: token });
                //res.send(resp);
            } else {
                res.status(401).json({ message: "passwords did not match" });
            }

        } else {
            res.status(401).json({ message: "User does not exist" });
        }
    } catch (error) {
        next(error);
    }
});

routes.get("/secret", passport.authenticate('jwt', { session: false }), function (req, res) {
    res.json("Success! You can not see this without a token");
});

routes.get("/secretless", function (req, res) {
    console.log(req.headers);
    res.json("Success! You can see this without a token");
});

module.exports = routes;