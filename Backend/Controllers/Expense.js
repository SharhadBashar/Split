ObjectId = require('mongodb').ObjectID;
const User = require('../Models/User');

exports.add = function(req, res, next) {
    const _id = new ObjectId();
    const id = req.body.id; //my id
    const roommateId = req.body.roommateId;
    const amount = req.body.amount;

    if (!id || !roommateId || !amount) {
        return res.status(422).send({error: 'Expense not valid'});
    }

    User.findOneAndUpdate(
        {_id: roommateId},
        {$push:{
            'credit': {'_id': _id ,'roommateId': id, 'amount': amount}
        }}
    ).exec()
    .then(function() {
        return User.findOneAndUpdate(
            {_id: id},
            {$push:{
                'debit': {'_id': _id, 'roommateId': roommateId, 'amount': amount}
            }}
        ).exec()
    })
    .then(res.send('Added'), function(err) {
        return next(err);
    });
}

exports.getAllCredit = function(req,res,next) {
    User.findOneById(req.body.id)
    .then(function(user) {
        res.send(user['credit']);
    }, function(err) {
        return next(err);
    });
}

exports.getAllDebit = function(req,res,next) {
    User.findOneById(req.body.id)
    .then(function(user) {
        res.send(user['debit']);
    }, function(err) {
        return next(err);
    });
}

exports.pay = function(req, res, next) {
    const id = req.body.id;
    const roommateId = req.body.roommateId;
    const expenseId = req.body.expenseId;

    if (!id || !roommateId || !expenseId) {
        return res.status(422).send({error: 'Payment not valid'});
    }

    User.findOneAndUpdate(
        {_id: id},
        {$pull:{
            'credit': {'_id': ObjectId(expenseId)}
        }}
    ).exec()
    .then(function() {
        return User.findOneAndUpdate(
            {_id: roommateId},
            {$pull:{
                'debit': {'_id': ObjectId(expenseId)}
            }}
        ).exec()
    })
    .then(res.send('Removed'), function(err) {
        return next(err);
    });
}