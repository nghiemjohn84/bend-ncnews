const { addVoteToComment, removeComment, fetchAllComments } = require('../models/commentsModel');

exports.amendedComment = (req, res, next) => {
  const increment = req.body.inc_votes;
  const { comment_id } = req.params;
  addVoteToComment(comment_id, increment)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(comment => {
      res.status(204).send('Comment Deleted');
    })
    .catch(next);
};

exports.sendAllComments = (req, res, next) => {
  fetchAllComments()
    .then((comments) => {
      res.status(200).send({comments})
  })
  .catch(next)
}