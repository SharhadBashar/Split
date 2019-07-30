ObjectId = require('mongodb').ObjectID;
const User = require('../Models/User');

exports.add = function(req, res, next) {
    email = req.body.email;
    phone = req.body.phone;

    if(!email && !phone) {
        return res.status(422).send({error: 'Must include one method of contact'});
    }

    User.findOne({$or: [{email: email} , {phone: phone}]})
    .then(function(user) {
        if(!user) {
            return res.status(404).send({error: 'User not found'});
        }
        return user._id;
    }, function(err) {
        return next(err);
    })
    .then(function (userId) {
        User.findOneAndUpdate(
            {_id: req.body.id}, 
            {$addToSet: {'roommates': userId}}
        ).exec();
        res.send(userId);
    });
};

exports.getAll = function(req, res, next) {
    User.findById(req.body.id)
    .then(function(user) {
        res.send(user['roommates']);
    });
};

exports.delete = function(req, res, next) {
    User.findOneAndUpdate(
        {_id: ObjectId(req.body.id)},
        {$pull: {'roommates': ObjectId(req.body.roommateId)}}    
    ).exec()
    .then(function(user) {
        res.status(200).send('Done');
    });
};