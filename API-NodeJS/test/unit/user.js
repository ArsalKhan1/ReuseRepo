const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
const utilities = require('../utilities');
let should = chai.should();

chai.use(chaiHttp);

let testUser = utilities.testUser;

// Test the user service in isolation
describe('User', function () {

    // Test adding a user
    describe('Register new user', function () {
        it('it should fail to access an invalid id', done => {
            chai.request(server)
                .get('/users/a')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('it should register a new user', done => {
            chai.request(server)
                .post('/users/register')
                .send(testUser)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.id.should.be.a('string');
                    done();
                });
        });
        it('it should fail to register the same user twice', (done) => {
            chai.request(server)
                .post('/users/register')
                .send(testUser)
                .end((err, res) => {
                    res.should.have.status(406);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
});