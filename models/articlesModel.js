const connection = require('../db/connection');
const {checkExists} = require('./index')

exports.fetchAllArticles = (sort_by = 'created_at', order = 'desc', author, topic) => {
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
    } else if (topic) {
      query.where('articles.topic', topic )
    }
  })
  .then (articles => {
    const authorExists = author ? checkExists(author, 'users', 'username') : null
    const topicExists = topic ? checkExists(topic, 'topics', 'slug') : null 
    return Promise.all([authorExists, topicExists, articles]);
  })
  .then(([authorExists, topicExists, articles]) => {
    if(authorExists === false){
      return Promise.reject({status: 404, msg: `Author ${author} Not Found`})
    } else if (topicExists === false) {
      return Promise.reject({status: 404, msg: `Topic ${topic} Not Found`})
    } else return articles
  })

}

exports.fetchArticleById = article_id => {
  return connection
    .first('articles.*')
    .from('articles')
    .count('comments.article_id as comment_count')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
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

exports.addVoteToArticle = (article_id, increment = 0) => {
  return connection
    .returning('*')
    .from('articles')
    .where('article_id', article_id)
    .increment({votes: increment })
    .then(([article]) => {
      return article
    })
};

exports.addCommentByArticleId = (article_id, username, body) => {
  return connection
    .insert({ article_id: article_id, author: username, body: body })
    .into('comments')
    .returning('*')
    .then(([comment]) => {
      if(!username) {
        return Promise.reject({
          status: 400,
          msg: 'Username Required'
        })
      } else return comment
    })
    }
    //   const articleExists = article_id ? checkExists(article_id, 'articles', 'article_id') : null
    //   return Promise.all([articleExists, comment])
    // })
    // .then (([articleExists, comment]) => {
    //   if (articleExists === false) {
    //     return Promise.reject({status: 404, msg: `Article ${article_id} Does Not Exist`})
    //   } else return comment
    // })


exports.fetchCommentsByArticleId = (article_id, sort_by = 'created_at', order = 'desc') => {
  return connection
    .select('*')
    .from('comments')
    .where('article_id', article_id)
    .returning('*')
    .orderBy(sort_by, order)
    .then((comments) => {
      const articleExists = article_id ? checkExists(article_id, 'articles', 'article_id') : null
      return Promise.all([articleExists, comments])
    })
    .then (([articleExists, comments]) => {
      if (articleExists === false) {
        return Promise.reject({status: 404, msg: `Article ${article_id} Does Not Exist`})
      } else return comments
    })
}


