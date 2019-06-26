const connection = require('../db/connection');

exports.fetchAllArticles = () => {
  return connection.select('*').from('articles');
};


