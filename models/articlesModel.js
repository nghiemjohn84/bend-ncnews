const connection = require('../db/connection');

exports.fetchAllArticles = (sort_by = 'created_at', order = 'desc', author) => {
  return connection
  .select('articles.*')
  .from('articles')
  .count('comments.comment_id as comment_count')
  .leftJoin('comments', 'articles.article_id', 'comments.article_id')
  .groupBy('articles.article_id')
  .orderBy(sort_by, order)
  .modify((query) => { 
    if(author) {
      query.where('articles.author', author) 
    }
  })

}

exports.fetchArticleById = article_id => {
  return connection
    .first('articles.*')
    .from('articles')
    .count('comments.article_id as comment_count')
    .join('comments', 'articles.article_id', 'comments.article_id')
    .where('articles.article_id', article_id)
    .groupBy('articles.article_id', 'comments.article_id')
    .then(article => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `article ${article_id} not found`
        });
      } else return article;
    });
};

exports.addVoteToArticle = (article_id, increment) => {
  return connection
    .returning('*')
    .from('articles')
    .where('article_id', article_id)
    .increment({ votes: increment })
    .then(([article]) => {
      if (!increment) {
        return Promise.reject({
          status: 400,
          msg: `Vote Count Value Required`
        });
      } else return article;
    });
};

exports.addCommentByArticleId = (article_id, username, body) => {
  return connection
    .insert({ article_id: article_id, author: username, body: body })
    .into('comments')
    .returning('*')
    .then(([comment]) => {
      if (!username) {
        return Promise.reject({
          status: 400,
          msg: `Username Required`
        });
      } else return comment;
    });
};

exports.fetchCommentsByArticleId = (article_id, sort_by = 'created_at', order = 'desc') => {
  return connection
    .select('*')
    .from('comments')
    .where('article_id', article_id)
    .returning('*')
    .orderBy(sort_by, order)
}