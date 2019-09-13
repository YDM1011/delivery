module.exports.postRead = async (req,res,next, backendApp) => {
    let words = {};

    req.erm.result.forEach((word)=>{
        words[word.value] = {ua:word.ua, ru:word.ru, id:word._id};
    });
    res.ok(words);
};