const assert = require('assert');
const { util } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { access } = require('fs');
const server = require('../../index');
const utilities = require('../utilities');
let should = chai.should();

chai.use(chaiHttp);

const testUserLogin = {
    username: "rayhaan",
    email: "test@gmail.com",
    password: "passw0rd",
}
const testItem = {
    itemName: "This item name is used for tests only",
    tags: [
        "Test tag",
        "Another test tag"
    ]
}

var accessToken;
var newItemId;
var userId;

// Run the article integration first, as this relies on that systems
require('./article.js');

describe('Items along with all other integration', function () {

    // Test adding an item
    describe('Add a new item', function () {
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
                    res.body.should.have.property('id');
                    res.body.id.should.be.a('string');
                    userId = res.body.id;
                    done();
                });
        });
        it('it should add a new item', done => {
            chai.request(server)
                .post('/users/items/insert')
                .send(testItem)
                .set('Authorization', 'Bearer ' + accessToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body._id.should.be.a('string');
                    res.body.should.have.property('name');
                    assert.strictEqual(res.body.name, testItem.itemName);
                    newItemId = res.body._id;
                    done();
                });
        });
        it('it should fail without a JWT', done => {
            chai.request(server)
                .post('/users/items/insert')
                .send(testItem)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('it should fail with an invalid JWT', done => {
            chai.request(server)
                .post('/users/items/insert')
                .send(testItem)
                .set('Authorization', 'Bearer badToken')
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                });
        });
    });

    // Test getting item data
    describe('Get item data', function () {
        it('it should get item data with valid JWT', done => {
            chai.request(server)
                .get('/users/' + userId + '/items')
                .set('Authorization', 'Bearer ' + accessToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');

                    let foundNewItem = false;
                    for (let i = 0; i < res.body.length; i++) {
                        if(res.body[i]._id == newItemId && res.body[i].name == testItem.itemName) {
                            foundNewItem = true;
                        }                        
                    }
                    assert.strictEqual(foundNewItem, true);

                    done();
                });
        });
        it('it should fail with an invalid user id', done => {
            chai.request(server)
                .get('/users/whoisthis/items')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

    });

    // Test deleting an item
    describe('Delete an item', function () {
        it('it should delete the new item', done => {
            chai.request(server)
                .delete('/users/items/delete/' + newItemId)
                .set('Authorization', 'Bearer ' + accessToken)
                .end((err, res) => {
                    res.should.have.status(204);
                    res.body.should.be.a('object');
                    // Check that returned item is empty
                    assert.strictEqual(Object.keys(res.body).length, 0);
                    done();
                });
        });
        it('it should fail to find the item after deletion', done => {
            chai.request(server)
                .get('/users/' + userId + '/items')
                .set('Authorization', 'Bearer ' + accessToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');

                    let foundNewItem = false;
                    for (let i = 0; i < res.body.length; i++) {
                        if (res.body[i]._id == newItemId && res.body[i].name == testItem.itemName) {
                            foundNewItem = true;
                        }
                    }
                    assert.strictEqual(foundNewItem, false);

                    done();
                });
        });
    });
});