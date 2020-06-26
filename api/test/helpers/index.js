'use strict';

require('../config');

const { Article } = require('../config');

function createArticle(article) {
  let defaultArticle = {
    title: 'article de test',
    content: 'le contenu article test',
  };

  if (!article) {
    article = defaultArticle;
  }

  return Article.create(article);
}

//module.exports = {createArticle};


const { User } = require('../config');

function createUser(user) {
  let defaultUser= {
    username: 'Vasya',
    email: 'vasya.pupkin@mail.com',
  };

  if (!user) {
    user = defaultUser;
  }

  return User.create(user);
}

module.exports = {createArticle, createUser};