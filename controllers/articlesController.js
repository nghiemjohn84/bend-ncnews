const { fetchAllArticles, fetchArticleById, addVoteToArticle } = require('../models/articlesModel');

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

exports.updateArticleVote = (req, res, next) => {
  const increment = req.body.inc_votes;
  const {article_id} = req.params;
  addVoteToArticle(article_id, increment).then((article) => {
    res.status(201).send({ article })
  })
  .catch(next)
}