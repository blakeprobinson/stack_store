'use strict';
var router = require('express').Router();
var User = require('../../db/models/user.js');
var Item = require('../../db/models/item.js').Item;
var Review = require('../../db/models/item.js').Review;
// var Cart = require('../../db/models/cart.js');
var Order = require('../../db/models/orders.js');

router.use('/tutorial', require('./tutorial'));

function isAuthenticated(req, res, next) {
    if (req.user) next();
    else {
        var err = new Error('Unknown user');
        err.status = 401;
        next(err);
    }
}

// router.get('/user', function (req, res, next) {
//     User.find({}).exec(function (err, users) {
//         if (err) return next(err);
//         res.send(users);
//     })
// })

router.get('/user/:email', function (req, res, next) { //requested by angular when item is selected
    var info = req.params.email;
    console.log('into the user email router with: ', info);
    User.find({email: info}).exec(function(err, data){
        if(err) return next(err);
        res.send(data);
    })
})

router.post('/user', function (req, res, next) {
    console.log('into the join router');
    var info = req.body;
    console.log(info);
    User.create(info, function(err, result){
        console.log(err, 'err', result, 'result');
        if (err) return next(err);
        else res.send(result);
    });
})

router.post('/item', function(req, res, next){
    console.log('into the router');
    var info = req.body;
    console.log(info);
    Item.create(info, function(err, result){
        console.log(err, 'err', result, 'result');
        if (err) return next(err);
        else res.send(result);
    });
})

router.post('/user/edit', isAuthenticated, function (req, res, next) { //username sent as a query
    var userinfo = req.body;
})

router.get('/logout', function (req, res) {
    // passport attaches this function to req for us
    req.logout();
    res.redirect('/');
});

router.get('/itemlist', function (req, res, next) {  //should be requested by angular when page loads
    Item.find({}).exec(function (err, users) {
        if (err) return next(err);
        res.send(users);
    })
})

router.get('/item/:name', function (req, res, next) { //requested by angular when item is selected
    var itemName = req.params.name;
    console.log(itemName);
    Item.find({name: itemName}).exec(function(err, data){
        if(err) return next(err);
        res.send(data);
    })
})

router.post('/reviews', function(req, res, next){
    var review = req.body.review;
    var userId = req.body.userId;
    var itemId = req.body.itemId;

    Review.create(review, function(err, submittedReview){
        if (err) throw next(err);
        submittedReview.setReview(userId, itemId, function(err, resp){
            if(err) throw next(err);
            res.send(resp);
        })
    })

})

router.get('/order', function(req, res, next){
	var user = req.user.session;
	res.send(user);
})

router.post('/item/addToOrder', function (req, res, err) {
    // Quantity, userid, itemid
    // req.params.productId
    // Check to see if there is a cart for user with userid
    // If not, create one
    // Then check to see if this productid is already in user cart
    // If so, increment quantity
    // If not, add productid & quantity to cart
    var productId = req.body.productId;
    var quantity = req.body.quantity;
    res.send(200);
    
})



module.exports = router;
