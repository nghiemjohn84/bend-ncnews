const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../index.js");

const { formatDate, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(connection, Promise) {
  return connection.migrate
    .rollback()
    .then(() => {
      return connection.migrate.latest();
    })
    .then(() => {
      const topicsInsertions = connection("topics")
        .insert(topicData)
        .returning("*");
      const usersInsertions = connection("users")
        .insert(userData)
        .returning("*");
      return Promise.all([topicsInsertions, usersInsertions])
        .then(() => {
          const changedDate = formatDate(articleData)
          return connection
            .insert(changedDate)
            .into(('articles'))
            .returning("*")
        .then(articleRows => {
          const articleRef = makeRefObj(articleRows);
          const formattedComments = formatComments(commentData, articleRef);
          return connection
          .insert(formattedComments)
          .into('comments')
          .returning('*')
        });
    });
  });
};
