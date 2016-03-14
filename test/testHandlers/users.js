'use strict';

var request = require('supertest');
var expect = require('chai').expect;

var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var PreparingDb = require('./preparingDb');
var app = require('../../app');

describe('Manage Users', function () {

    var agent = request.agent(app);
    var preparingDb = new PreparingDb();
    var userOneId;

    before(function (done) {
        console.log('>>> before');

        preparingDb.dropCollection(CONST.MODELS.USER + 's', function (err, result) {
            if (err) {
                return done(err);
            }
            done();
        });
    });

    it('Create one user', function (done) {

        var userData = USERS.CLIENT_1;
        var data = {
            email: userData.email,
            pass : userData.pass
        };

        agent
            .post('/user/')
            .send(data)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                preparingDb
                    .User
                    .findOne({email: data.email})
                    .exec(function (err, model) {
                        if (err) {
                            return done(err);
                        }

                        if (!model) {
                            return done('Not Created');
                        }

                        done();
                    });
            });
    });

    it('Create one more user', function (done) {

        var userData = USERS.CLIENT_2;
        var data = {
            email: userData.email,
            pass : userData.pass
        };

        agent
            .post('/user/')
            .send(data)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                preparingDb
                    .User
                    .findOne({email: data.email})
                    .exec(function (err, model) {
                        if (err) {
                            return done(err);
                        }

                        if (!model) {
                            return done('Not Created');
                        }

                        done();
                    });
            });
    });

    it('Create user with same email', function (done) {

        var userData = USERS.CLIENT_2;
        var data = {
            email: userData.email,
            pass : userData.pass
        };

        agent
            .post('/user/')
            .send(data)
            .expect(400)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                done();
            });
    });

    it('Get all users', function (done) {

        agent
            .get('/user/')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                expect(res.body).to.have.deep.property('[0].email', USERS.CLIENT_1.email);
                expect(res.body).to.have.deep.property('[1].email', USERS.CLIENT_2.email);
                expect(res.body).to.have.deep.property('[0]._id');
                userOneId = res.body[0]._id;

                done();
            });
    });

    it('Get users count', function (done) {

        agent
            .get('/user/count')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                expect(res.body).to.have.property('count');
                expect(res.body.count).equal(2);

                done();
            });
    });

    it('Get user by id', function (done) {

        agent
            .get('/user/' + userOneId)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                expect(res.body).to.have.property('_id');
                expect(res.body).to.have.property('email');
                expect(res.body._id).equal(userOneId);
                expect(res.body.email).equal(USERS.CLIENT_1.email);

                done();
            });
    });

    it('Update user by id', function (done) {

        var updateEmail = 'update.' + USERS.CLIENT_1.email;
        var foundUser;

        agent
            .put('/user/' + userOneId)
            .send({email: updateEmail})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                preparingDb
                    .User
                    .findOne({_id: userOneId})
                    .exec(function (err, model) {
                        if (err) {
                            return done(err);
                        }

                        if (!model) {
                            return done('Not Found');
                        }

                        foundUser = JSON.parse(JSON.stringify(model));

                        expect(foundUser).to.have.property('_id');
                        expect(foundUser).to.have.property('email');
                        expect(foundUser._id).equal(userOneId);
                        expect(foundUser.email).equal(updateEmail);

                        done();
                    });
            });
    });

    it('Delete user', function (done) {

        agent
            .delete('/user/' + userOneId)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                preparingDb
                    .User
                    .findOne({_id: userOneId})
                    .exec(function (err, model) {
                        if (err) {
                            return done(err);
                        }

                        if (model) {
                            return done('Not Deleted');
                        }

                        done();
                    });
            });
    });

});
