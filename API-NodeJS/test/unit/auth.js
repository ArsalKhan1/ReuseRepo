const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
const utilities = require('../utilities');
let should = chai.should();

chai.use(chaiHttp);

const testUserLogin = {
    username: "rayhaan",
    email: "test@gmail.com",
    password: "passw0rd",
}

// Test the authentication service in isolation
describe('Auth', function () {

    // Test adding a user
    describe('Login', function () {
        it('it should get a JWT', done => {
            chai.request(server)
                .post('/auth')
                .send(testUserLogin)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('accessToken');
                    res.body.accessToken.should.be.a('string');
                    done();
                });
        });
        it('it should reject the wrong password', done => {
            chai.request(server)
                .post('/auth')
                .send({
                    username: testUserLogin.username,
                    email: testUserLogin.email,
                    password: "wrongpassword"
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });
});