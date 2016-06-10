'use strict';

var request = require('supertest');
var expect = require('chai').expect;

var USER_FIXTURES = require('./../fixtures/userFixtures');
var dbHelper = require('./../dbHelper');
var app = require('../../app');
var User = require('../../models/user');

describe('User Register/ LogIn / LogOut', function () {

    var agent = request.agent(app);

    before(function (done) {
        dbHelper.clearDB(function (err) {
            if (err) {
                return done(err);
            }
            done();
        });
    });

    it.skip('Register user', function (done) {

        var userData = USER_FIXTURES.CLIENT_1;
        var registerData = {
            login      : userData.login,
            pass       : userData.pass,
            confirmPass: userData.pass,
            email      : userData.email
        };

        agent
            .post('/user/register')
            .send(registerData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                User
                    .findOne({login: userData.login, pass: userData.pass})
                    .exec(function (err, model) {
                        if (err) {
                            return done(err);
                        }

                        if (!model) {
                            return done('Not Created');
                        }

                        User
                            .update({_id: model._id}, {confirmToken: ''}, function (err, data) {
                                done(err);
                            });
                    });
            });
    });

    it.skip('Login with GOOD credentials (' + USER_FIXTURES.CLIENT_1.email + ', ' + USER_FIXTURES.CLIENT_1.pass + ')', function (done) {

        var loginData = {
            login: USER_FIXTURES.CLIENT_1.login,
            pass : USER_FIXTURES.CLIENT_1.pass
        };

        agent
            .post('/user/login')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                done();
            });
    });

    it.skip('Login with BAD credentials - wrong pass', function (done) {

        var loginData = USER_FIXTURES.CLIENT_1;
        loginData.pass += '_wrong_pass';

        agent
            .post('/user/login')
            .send(loginData)
            .expect(400)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });

    it.skip('SignOut if Logined (' + USER_FIXTURES.CLIENT_1.email + ')', function (done) {

        var loginData = USER_FIXTURES.CLIENT_1;

        agent
            .post('/user/login')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                agent
                    .post('/user/logout')
                    .expect(200)
                    .end(function (err) {
                        done(err);
                    });
            });
    });

});
