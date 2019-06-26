const connection = require('../db/connection');

exports.fetchAllArticles = () => {
  return connection.select('*').from('articles');
};

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