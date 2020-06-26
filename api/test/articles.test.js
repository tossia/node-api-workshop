/* eslint-disable no-unused-expressions */
'use strict';

const test = require('unit.js');
const {Article} = require('./config');
const { createArticle } = require('./helpers');

describe('Articles', function() {
  before(connectMongoDB);

  // Same as:
  // after(function(done) {
  //   closeMongoDB(done);
  // });
  after(closeMongoDB);

  beforeEach(function(done) {
    Article
      .deleteMany({})
      .then(() => done())
      .catch(done);
  });

  it('should create an article', async function() {
    const res = await test
      .httpAgent(apiUrl)
      .post('/articles')
      .send({title: 'article de test', content: 'le contenu article test'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

    let article = res.body;

    article.should.be.an.Object();
    article.id.should.be.ok;
    // Mongo ID should be 24 chars
    article.id.length.should.be.equal(24);
    article.title.should.equal('article de test');
    article.content.should.equal('le contenu article test');

    test
      .string(article.createdAt)
      .bool(article.createdAt <= Date.now)

      .string(article.updatedAt)
      .isEqualTo(article.createdAt)
    ;
  });

  it('should list all articles', async function() {
    let createdArticle = await createArticle();
    let res = await test
      .httpAgent(apiUrl)
      .get('/articles')
      .expect('Content-Type', /json/)
      .expect(200);

    // With Unit.js
    test
      .array(res.body)
      .hasLength(1)

      .object(res.body[0])
      .hasProperty('id', createdArticle.id)
      .hasProperty('title', createdArticle.title)
      .hasProperty('content', createdArticle.content);

    // With Should.js
    res.body.length.should.be.equal(1);

    let article = res.body[0];

    article.id.should.equal(createdArticle.id);
    article.title.should.equal(createdArticle.title);
    article.content.should.equal(createdArticle.content);
  });
});
