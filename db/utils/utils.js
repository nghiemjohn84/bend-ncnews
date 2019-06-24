exports.formatDate = list => {
    return list.map(obj => {
        const newObj = {...obj}
        const newDate = new Date(obj.created_at).toLocaleString()
        newObj.created_at = newDate
        // console.log(newObj.created_at, '<-----date')
        return newObj
    }) 
};

exports.makeRefObj = list => {
    const refObj = {}
    list.forEach(item => {
        refObj[item.title] = item.article_id;
    })
    return refObj
};

exports.formatComments = (comments, articleRef) => {};
