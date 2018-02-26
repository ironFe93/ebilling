const express = require('express');
const routes = express.Router();
const { celebrate, Joi, errors } = require('celebrate');

const passport = require('../config/passport-config');

var jwt = require('jsonwebtoken');


var User = require('../models/user');
var bcrypt = require('bcrypt');

const saltRounds = 10;

routes.post('/register', (req, res, next) => {

    const usr = req.body.username;
    const psw = req.body.password;

    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(psw, salt, function (err, hash) {

            if (err) return next(err);
            const newUser = new User({ username: usr, password: hash });

            newUser.save((err, user) => {
                if (err) return next(err);

                if (user) {
                    res.send({ message: 'success' });
                } else {
                    return next(new Error("User created empty"))
                }
            });


        });
    });


});

routes.post('/login', (req, res, next) => {

    const usr = req.body.username;
    const psw = req.body.password;

    User.findOne(
        { "username": usr },
        (err, user) => {
            if (err) return next(err);

            if (user) {

                bcrypt.compare(psw, user.password, function (err, resp) {
                    if (err) return next(err);

                    if (resp) {
                        var token = jwt.sign({
                            id: user._id
                          }, 'nancy', { expiresIn: '10h' }); //https://dev.to/neilmadden/7-best-practices-for-json-web-tokens

                        res.json({ message: "ok", token: token });
                        //res.send(resp);
                    } else {
                        res.status(401).json({ message: "passwords did not match" });
                    }
                });

            } else {
                res.status(401).json({ message: "User does not exist" });
            }
        });
});

routes.get("/secret", passport.authenticate('jwt', { session: false }), function (req, res) {
    res.json("Success! You can not see this without a token");
});

routes.get("/secretless", function (req, res) {
    console.log(req.headers);
    res.json("Success! You can see this without a token");
});

module.exports = routes;