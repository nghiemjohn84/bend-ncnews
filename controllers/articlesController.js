const { 
  fetchAllArticles, 
  fetchArticleById, 
  addVoteToArticle, 
  addCommentByArticleId, 
  fetchCommentsByArticleId 
} = require('../models/articlesModel');

exports.sendAllArticles = (req, res, next) => {
  const {sort_by, order, author, topic} = req.query;
  fetchAllArticles(sort_by, order, author, topic)
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
    res.status(200).send({ article })
  })
  .catch(next)
}

exports.postCommentByArticleId = (req, res, next) => {
  const {article_id} = req.params
  const username = req.body.username
  const body = req.body.body
  addCommentByArticleId(article_id, username, body).then(comments =>{
    res.status(201).send({comments})
  })
  .catch(next)
}

exports.sendCommentsByArticleId = (req, res, next) => {
  const {sort_by, order} = req.query
  const {article_id} = req.params
  fetchCommentsByArticleId(article_id, sort_by, order).then((comments) => {
    res.status(200).send({comments})
  })
  .catch(next)
}
  