/* eslint-disable no-unused-expressions */
'use strict';

const test = require('unit.js');

describe('Articles', function() {
  const apiUrl = 'http://localhost:3000';

  it('should create an article', function(done) {
    test
      .httpAgent(apiUrl)
      .post('/articles')
      .send({
        title: 'article de test',
        content: 'le contenu article test',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function(err, res) {
        if (err) {
          return done(err);
          // test.fail(err.message);
        }

        let article = res.body;

        article.should.be.an.Object();
        article.id.should.be.ok;
        // Mongo ID should be 32 chars
        article.id.length.should.be.equal(24);
        article.title.should.equal('article de test');
        article.content.should.equal('le contenu article test');

        test
          .string(article.createdAt)
          .bool(article.createdAt <= Date.now)

          .string(article.updatedAt)
          .isEqualTo(article.createdAt)
        ;

        done();
      });
  });

  it.skip('should list all articles', function() {
    test
      .httpAgent(apiUrl)
      .get('/articles')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          test.fail(err.message);
        }

        test.dump(res.body);
      });
  });
});
