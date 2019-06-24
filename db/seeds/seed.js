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
      return (
        Promise.all([topicsInsertions, usersInsertions])
          //   .then(([mystery, mystery2]) => {
          //     console.log(mystery, mystery2)
          // })
          .then(() => {
            console.log(articleData, "<-----articleData");
            console.log();
            const changedDate = formatDate(articleData);
            console.log(changedDate, "<---- changedDate");
            return connection
              .insert(changedDate)
              .into("articles")
              .returning("*");
          })
      );

      /* 
      
      Your article data is currently in the incorrect format and will violate your SQL schema. 
      
      You will need to write and test the provided formatDate utility function to be able insert your article data.

      Your comment insertions will depend on information from the seeded articles, so make sure to return the data after it's been seeded.
      */
    })
    .then(articleRows => {
      /* 

      Your comment data is currently in the incorrect format and will violate your SQL schema. 

      Keys need renaming, values need changing, and most annoyingly, your comments currently only refer to the title of the article they belong to, not the id. 
      
      You will need to write and test the provided makeRefObj and formatComments utility functions to be able insert your comment data.
      */

      const articleRef = makeRefObj(articleRows);
      const formattedComments = formatComments(commentData, articleRef);
      return connection("comments").insert(formattedComments);
    });
};
