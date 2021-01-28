const assert = require('assert');
const { util } = require('chai');
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
const testArticle = {
    title: "Unit tests article",
    description: "This is for a unit test",
    tags: [
        { name: "Unit" },
        { name: "Test" }
    ]
}
const testSearchQuery = {
    query: {
        tags: [
            { name: "unit" }
        ]
    }
}

var accessToken;
var newArticle;

// Run the auth and user integration first, as this relies on those systems
require('./userAuth.js');

// Test the article functionality along with how it integrates with user and authentication services
describe('Article along with user and authentication integration', function () {

    // Test adding an article
    describe('Add a new article', function () {
        it('it should authenticate a user', done => {
            chai.request(server)
                .post('/auth')
                .send(testUserLogin)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('accessToken');
                    res.body.accessToken.should.be.a('string');
                    accessToken = res.body.accessToken;
                    done();
                });
        });
        it('it should add a new article', done => {
            chai.request(server)
                .post('/article/create')
                .send(testArticle)
                .set('Authorization', 'Bearer ' + accessToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body._id.should.be.a('string');
                    res.body.should.have.property('authorUsername');
                    assert.strictEqual(res.body.authorUsername, testUserLogin.username);
                    newArticle = res.body._id;
                    done();
                });
        });
        it('it should fail without a JWT', done => {
            chai.request(server)
                .post('/article/create')
                .send(testArticle)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('it should fail with an invalid JWT', done => {
            chai.request(server)
                .post('/article/create')
                .send(testArticle)
                .set('Authorization', 'Bearer badToken')
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                });
        });
    });

    // Get article data
    describe('Get article data', function () {
        it('it should get article data without a JWT', done => {
            chai.request(server)
                .get('/article/' + newArticle)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body._id.should.be.a('string');
                    res.body.should.have.property('description');
                    assert.strictEqual(res.body.description, testArticle.description);
                    done();
                });
        });
        it('it should fail with an invalid article id', done => {
            chai.request(server)
                .get('/article/notarealid')
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

    });

    // Test modifying an article
    describe('Modify an article', function () {
        it('it should modify the new article', done => {
            let newDiscription = utilities.randomString(20);
            testArticle.description = newDiscription;

            chai.request(server)
                .put('/article/update/' + newArticle)
                .send(testArticle)
                .set('Authorization', 'Bearer ' + accessToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body._id.should.be.a('string');
                    res.body.should.have.property('description');
                    assert.strictEqual(res.body.description, newDiscription);
                    done();
                });
        });
    });

    // Test searching for articles by tag
    describe('Search articles by tag', function() {
        let findArticle = (articles) => {
            for (i = 0; i < articles.length; i++) {
                if (articles[i]._id == newArticle) {
                    return true;
                }
            }
            return false;
        };

        it('it should find the new article', done => {
            chai.request(server)
                .post('/article/search')
                .send(testSearchQuery)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    assert.strictEqual(findArticle(res.body), true);
                    done();
                });
        });
        it('it should fail to find the new article with bad tags', done => {
            testSearchQuery.query.tags[0].name = 'wrong tag';

            chai.request(server)
                .post('/article/search')
                .send(testSearchQuery)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    assert.strictEqual(findArticle(res.body), false);
                    done();
                });
        });
    });

    // Test deleting an article
    describe('Delete an article', function () {
        it('it should delete the new article', done => {
            chai.request(server)
                .delete('/article/' + newArticle)
                .set('Authorization', 'Bearer ' + accessToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    // Check that returned article is empty
                    assert.strictEqual(Object.keys(res.body).length, 0);
                    done();
                });
        });
        it('it should fail to find the article after deletion', done => {
            chai.request(server)
                .get('/article/' + newArticle)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });
});