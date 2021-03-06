'use strict';
var path = require('path');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

module.exports = function (app) {

    var facebookConfig = app.getValue('env').FACEBOOK;

    var facebookCredentials = {
        clientID: facebookConfig.clientID,
        clientSecret: facebookConfig.clientSecret,
        callbackURL: facebookConfig.callbackURL
    };

    var verifyCallback = function (accessToken, refreshToken, profile, done) {

        UserModel.findOne({ 'facebook.id': profile.id }, function (err, user) {
            if (err) return done(err);

            if (user) {
                done(null, user);
            } else {
                UserModel.create({
                    facebook: {
                        id: profile.id
                    },
                    first_name: profile.name.givenName,
                    last_name: profile.name.familyName
                }).then(function (err, user) {
                    done(null, user);
                });
            }

        });

            
    };

    passport.use(new FacebookStrategy(facebookCredentials, verifyCallback));

    app.get('/auth/facebook', passport.authenticate('facebook'));
    console.log('looking app.get/auth');
    app.get('/auth/facebook/callback',
        function(req, res, next){
            console.log('anything at all')
            next();
        },
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function (req, res, next) {
            console.log('something different')
            next();
        },
        function (req, res) {
            res.redirect('/');
        });

};