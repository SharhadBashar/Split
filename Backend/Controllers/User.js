//Where users are authenticated
const jwt = require('jwt-simple');
const User = require('../Models/User'); //This is a class of user. It represents all the users, not just one user
const config = require('../config');

function token(user) {
    const timestamp = new Date().getTime();
    //the code below is standard
    //sub is subject. who is this token about and stuff
    //iat: issued at time 
    return jwt.encode({sub: user.id, iat: timestamp}, config.secret);
}

exports.create = function(req, res, next) {
    //See if user with a given username exists
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;

    if(!name && (!email || !phone)) {
        return res.status(422).send({error: 'Must provide Name and one method of contact'});
    }
    //if user with a given username exists, throw an error
    User.findOne({$or: [{email: email} , {phone: phone}]})
    .then(function(existingUser) {
        if (existingUser) {
            return res.status(422).send({error: 'Username is taken. Please pick another username'});
        }
        //else, create a new user
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            credit: [],
            debit: [],
            roommates: []
        });
        user.save()
        .then(function() {
            //respond to request
            res.json({
                id: user._id,
                name: name,
                email: email,
                phone: phone,
                token: token(user)
            });
        }, function(err) {
            return next(err);
        });
    }, function(err) {
        return next(err);
    });
}

exports.getOne = function(req, res) {
    const email = req.body.email;
    const phone = req.body.phone;
    User.findOne({$or: [{email: email} , {phone: phone}]})
    .then(function(user) {
        if(!user) {
            return res.status(404).send({error: 'User not found'});
        }
        res.send(user);
    }, function(err) {
        return next(err);
    });
}

exports.signIn = function(req, res, next) {
    const email = req.body.email;
    const phone = req.body.phone;
    User.findOne({$or: [{email: email} , {phone: phone}]})
    .then(function(user) {
        if(!user) {
            return res.status(404).send({error: 'User not found'});
        }
        user.token = token(user);
        res.send({
            user: user,
            token: token(user)
        });
    }, function(err) {
        return next(err);
    });
}