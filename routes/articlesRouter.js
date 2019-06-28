const articlesRouter = require('express').Router();
const {
  sendAllArticles,
  sendArticleById,
  updateArticleVote,
  postCommentByArticleId,
  sendCommentsByArticleId
} = require('../controllers/articlesController');

const { handleMethodErrors } = require('../errors/index');

articlesRouter
  .route('/')
  .get(sendAllArticles)
  .all(handleMethodErrors);

articlesRouter
  .route('/:article_id')
  .get(sendArticleById)
  .patch(updateArticleVote)
  .all(handleMethodErrors);

articlesRouter
  .route('/:article_id/comments')
  .post(postCommentByArticleId)
  .get(sendCommentsByArticleId)
  .all(handleMethodErrors);

module.exports = articlesRouter;
