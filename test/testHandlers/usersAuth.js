'use strict';

var request = require('supertest');
var expect = require('chai').expect;

var USERS = require('./../testHelpers/usersTemplates');
var PreparingDb = require('./preparingDb');
var app = require('../../app');

describe('User Register/ LogIn / LogOut', function () {

    var agent = request.agent(app);
    var preparingDb = new PreparingDb();

    before(function (done) {
        console.log('>>> before');

        preparingDb.dropAllCollections(function (err, result) {
            if (err) {
                return done(err);
            }
            done();
        });
    });

    it('Register user', function (done) {

        var userData = USERS.CLIENT_1;
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

                preparingDb.User
                    .findOne({login: userData.login, pass: userData.pass})
                    .exec(function (err, model) {
                        if (err) {
                            return done(err);
                        }

                        if (!model) {
                            return done('Not Created');
                        }

                        preparingDb.User
                            .update({_id: model._id}, {confirmToken: ''}, function (err, data) {
                                if (err) {
                                    return done(err);
                                }
                                done();
                            });
                    });
            });
    });

    it('Login with GOOD credentials (' + USERS.CLIENT_1.login + ', ' + USERS.CLIENT_1.pass + ')', function (done) {

        var loginData = {
            login: USERS.CLIENT_1.login,
            pass : USERS.CLIENT_1.pass
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

    it('Login with BAD credentials - wrong pass', function (done) {

        var loginData = USERS.CLIENT_1;
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

    it('SignOut if Logined (' + USERS.CLIENT_1.login + ')', function (done) {

        var loginData = USERS.CLIENT_1;

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
                        if (err) {
                            return done(err);
                        }
                        done();
                    });
            });
    });

});
