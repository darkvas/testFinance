'use strict';

var request = require('supertest');
var expect = require('chai').expect;

var USER_FIXTURES = require('./../fixtures/userFixtures');
var dbHelper = require('./../dbHelper');
var app = require('../../app');

describe('Manage Users', function () {

    var agent = request.agent(app);
    var userOneId;

    before(function (done) {
        dbHelper.clearDB(function (err) {
            if (err) {
                return done(err);
            }
            done();
        });
    });

    it('Create one user', function (done) {

        var userData = USER_FIXTURES.CLIENT_1;
        var data = {
            email: userData.email,
            pass : userData.pass
        };

        agent
            .post('/user/')
            .send(data)
            .expect(201)
            .end(function (err, res) {
                done(err);
            });
    });

    it('Create one more user', function (done) {

        var userData = USER_FIXTURES.CLIENT_2;
        var data = {
            email: userData.email,
            pass : userData.pass
        };

        agent
            .post('/user/')
            .send(data)
            .expect(201)
            .end(function (err, res) {
                done(err);
            });
    });

    it('Create user with same email', function (done) {

        var userData = USER_FIXTURES.CLIENT_2;
        var data = {
            email: userData.email,
            pass : userData.pass
        };

        agent
            .post('/user/')
            .send(data)
            .expect(400)
            .end(function (err, res) {
                done(err);
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

                expect(res.body).to.have.deep.property('[0].email', USER_FIXTURES.CLIENT_1.email);
                expect(res.body).to.have.deep.property('[1].email', USER_FIXTURES.CLIENT_2.email);
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
                expect(res.body.email).equal(USER_FIXTURES.CLIENT_1.email);

                done();
            });
    });

    it('Update user by id', function (done) {

        var updateEmail = 'update.' + USER_FIXTURES.CLIENT_1.email;
        var foundUser;

        agent
            .put('/user/' + userOneId)
            .send({email: updateEmail})
            .expect(200)
            .end(function (err, res) {
                done(err);
            });
    });

    it('Delete user', function (done) {

        agent
            .delete('/user/' + userOneId)
            .expect(200)
            .end(function (err, res) {
                done(err);
            });
    });

});
