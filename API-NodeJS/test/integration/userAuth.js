const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
const utilities = require('../utilities');
let should = chai.should();

// Ensure the unit tests run first to create the user
require('../unit/user');
require('../unit/auth');

chai.use(chaiHttp);

let testUser = utilities.testUser;
var accessToken;

// Test how the authentication and user component integrate with each other
describe('User Authentication Integration', function () {

    // Test adding a user
    describe('Login new user', function () {
        it('it should get a JWT', done => {
            chai.request(server)
                .post('/auth')
                .send(testUser)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('accessToken');
                    res.body.accessToken.should.be.a('string');
                    res.body.should.have.property('id');
                    res.body.id.should.be.a('string');
                    accessToken = res.body.accessToken;
                    testUser.id = res.body.id;
                    done();
                });
        });
    });

    describe('Get user data', function () {
        it('it should fail if no token is given', done => {
            chai.request(server)
                .get('/users/' + testUser.id)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('it should get user data using the token from login', done => {
            chai.request(server)
                .get('/users/' + testUser.id)
                .set('Authorization', 'Bearer ' + accessToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('firstName');
                    res.body.firstName.should.be.a('string');
                    res.body.should.have.property('lastName');
                    res.body.lastName.should.be.a('string');
                    res.body.should.have.property('permission');
                    res.body.permission.should.be.a('number');
                    res.body.should.have.property('username');
                    res.body.username.should.be.a('string');
                    res.body.should.have.property('email');
                    res.body.email.should.be.a('string');
                    done();
                });
        });
    })

    describe('Patch user', function () {
        let newName = utilities.randomString(10);
        testUser.firstName = newName;
        it('it should update the user data when patched ', done => {
            chai.request(server)
                .patch('/users/' + testUser.id)
                .send(testUser)
                .set('Authorization', 'Bearer ' + accessToken)
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
        it('it should get the updated name', done => {
            chai.request(server)
                .get('/users/' + testUser.id)
                .set('Authorization', 'Bearer ' + accessToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('firstName');
                    res.body.firstName.should.be.a('string');
                    assert.strictEqual(res.body.firstName, newName);
                    done();
                });
        });
    })

    describe('Delete user', function () {
        it('it should delete the user from the database', done => {
            chai.request(server)
                .delete('/users/' + testUser.id)
                .set('Authorization', 'Bearer ' + accessToken)
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
        it('it should fail to find the user after deletion', done => {
            chai.request(server)
                .get('/users/' + testUser.id)
                .set('Authorization', 'Bearer ' + accessToken)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    })
});