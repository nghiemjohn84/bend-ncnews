const { fetchAllArticles } = require('../models/articlesModel');

exports.sendAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then(articles => {
      res.status(200).send({ articles });
    }).catch(next);
};
