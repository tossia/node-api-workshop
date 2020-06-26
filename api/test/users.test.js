/* eslint-disable no-unused-expressions */
'use strict';

const test = require('unit.js');
const {User} = require('./config');
const { createUser } = require('./helpers');

describe('Users', function() {
 
  before(function(done) {
    connectMongoDB(done);
  });

  after(function(done) {
    closeMongoDB(done);
  });

  beforeEach(function(done) {
    User
      .deleteMany({})
      .then(() => done())
      .catch(done);
  });

  it('should create an user', async function() {
    let res = await test
      .httpAgent(apiUrl)
      .post('/users')
      .send({username: 'Vasya', email: 'vasya.pupkin@mail.com'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

    let user = res.body;

    user.should.be.an.Object();
    user.id.should.be.ok;
    // Mongo ID should be 24 chars
    user.id.length.should.be.equal(24);
    user.username.should.equal('Vasya');
    user.email.should.equal('vasya.pupkin@mail.com');

    test
      .string(user.createdAt)
      .bool(user.createdAt <= Date.now)

      .string(user.updatedAt)
      .isEqualTo(user.createdAt);
  });

  it('should update an user', async function() {
    let createdUser = await createUser();

    const res = await test
      .httpAgent(apiUrl)
      .put('/users/' + createdUser.id)
      .send({username: 'Petya', email: 'petya.pupkin@mail.moc'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    let user = res.body;

    user.should.be.an.Object();
    // Mongo ID should be 24 chars
    user.id.length.should.be.equal(24);
    user.username.should.equal('Petya');
    user.email.should.equal('petya.pupkin@mail.moc');
    test.assert(user.createdAt < user.updatedAt);
    test.assert(createdUser.updatedAt !== user.updatedAt);
  });

  it('should delete an user', async function() {
    let createdUser = await createUser();

    const res = await test
      .httpAgent(apiUrl)
      .delete('/users/' + createdUser.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    let user = res.body;

    user.should.be.an.Object();
    // Mongo ID should be 24 chars
    user.id.length.should.be.equal(24);
    user.username.should.equal(createdUser.username);
    user.email.should.equal(createdUser.email);

    let foundUser = await User.findById(createdUser.id);

    test.assert(!foundUser);
  });

  it('should list all users', async function() {
    let createdUser = await createUser();
    let res = await test
      .httpAgent(apiUrl)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200);

    // With Unit.js
    test
      .array(res.body)
      .hasLength(1)
      .object(res.body[0])
      .hasProperty('id', createdUser.id)
      .hasProperty('username', createdUser.username)
      .hasProperty('email', createdUser.email);

    // With Should.js
    res.body.length.should.be.equal(1);

    let user = res.body[0];

    user.id.should.equal(createdUser.id);
    user.username.should.equal(createdUser.username);
    user.email.should.equal(createdUser.email);
  });

it('should get only one user', async function() {
  let createdUser, userUp, res;

  createdUser = await createUser();
  createdUser.id.should.be.String();
    // Mongo ID should be 24 chars
  //userUp.id.length.should.be.equal(24);
  createdUser.id.length.should.be.equal(24);

  res =  await test
    .httpAgent(apiUrl)
    .get('/users/' + createdUser.id)
    .expect('Content-Type', /json/)
    .expect(200);

  userUp = res.body;

  userUp.should.be.an.Object();
  userUp.id.should.equal(createdUser.id);
  userUp.username.should.equal(createdUser.username);
  userUp.email.should.equal(createdUser.email);

  });
});