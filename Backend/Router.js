//Different routes for the page
const passport = require('passport');
const User = require('./Controllers/User');
const Roommate = require('./Controllers/Roommate');
const Expense = require('./Controllers/Expense');
const passportService = require('./Services/Passport');

//sessoin = false cause we are using tokens and not cookies
const requireAuth = passport.authenticate('jwt', {session: false})
const requireSignin = passport.authenticate('local', {session: false});

module.exports = function(app) {
    app.post('/CreateUser', User.create);
    app.post('/getOneUser', User.getOne);
    app.post('/signIn', User.signIn);

    app.post('/addRoommate', Roommate.add);
    app.post('/getRoommates', Roommate.getAll);
    app.post('/deleteRoommate', Roommate.delete);

    app.post('/addExpense', Expense.add);
    app.post('/payExpense',Expense.pay);
}