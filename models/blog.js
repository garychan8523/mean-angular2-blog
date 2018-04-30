const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

let titleLengthChecker = (title) => {
  if (!title) return false;
  else if (title.length < 2 || title.length > 100) {
      return false;
  } else {
    return true;
  }
};

// let alphaNumericTitleChecker = (title) => {
//   if (!title) return false;
//   else {
//     //const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
//     const regExp = new RegExp(/[-a-zA-Z0-9《》（）「」＜＞〈〉，。<>():：!！?？#＃．・…\/／\u4e00-\u9eff]/g);
//     return regExp.test(title);
//   }
// };

const titleValidators = [
  {
    validator: titleLengthChecker, 
    message: 'title must be at least 2 but no more than 100 characters'
  }
];

let bodyLengthChecker = (body) => {
  if (!body) return false;
  else if (body.length < 1 || body.length > 1500) {
    return false;
  } else {
    return true;
  }
};

const bodyValidators = [
  {
    validator: bodyLengthChecker,
    message: 'body must be at least 1 but no more than 1500 characters'
  }
];

let commentLengthChecker = (comment) => {
  if (!comment[0]) return false;
  else if (comment[0].length < 1  || comment[0].length > 1500) {
    return false;
  } else {
    return true;
  }
};

const commentValidators = [
  {
    validator: commentLengthChecker,
    message: 'comment must be at least 1 but no more than 1500 characters'
  }
];

const blogSchema = new Schema({
  title: { type: String, required: true, validate: titleValidators },
  body: { type: String, required: true, validate: bodyValidators },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now() },
  likes: { type: Number, default: 0 },
  likedBy: { type: Array },
  dislikes: { type: Number, default: 0 },
  dislikedBy: { type: Array },
  comments: [{
    comment: { type: String, validate: commentValidators },
    commentator: { type: String }
  }]
});

module.exports = mongoose.model('Blog', blogSchema);