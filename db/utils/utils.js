exports.formatDate = list => {
  return list.map(obj => {
    const newObj = { ...obj };
    const newDate = new Date(obj.created_at);
    newObj.created_at = newDate;
    return newObj;
  });
};

exports.makeRefObj = list => {
  const refObj = {};
  list.forEach(item => {
    refObj[item.title] = item.article_id;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    let { belongs_to, created_by, created_at, ...restOfComments } = comment;
    const author = comment.created_by;
    const article_id = articleRef[belongs_to];
    const newDate = new Date(created_at);
    created_at = newDate
    return { article_id, author, created_at, ...restOfComments };
  });
};
