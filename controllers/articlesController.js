const { fetchAllArticles, fetchArticleById } = require('../models/articlesModel');

exports.sendAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then(articles => {
      res.status(200).send({ articles });
    }).catch(next);
};

exports.sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};