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

let leadinLengthChecker = (leadin) => {
  if (leadin && leadin.length > 200) {
    return false;
  } else {
    return true;
  }
};

const leadinValidators = [
  {
    validator: leadinLengthChecker,
    message: 'lead-in must be no more than 200 characters'
  }
];

// backend would accept up to 60000 for json syntax overhead
let bodyLengthChecker = (body) => {
  if (!body) return false;
  else if (body.length < 1 || body.length > 60000) {
    return false;
  } else {
    return true;
  }
};

const bodyValidators = [
  {
    validator: bodyLengthChecker,
    message: 'body must be at least 1 but no more than 50000 characters'
  }
];

// backend would accept up to 60000 for json syntax overhead
let commentLengthChecker = (comment) => {
  if (!comment[0]) return false;
  else if (comment[0].length < 1 || comment[0].length > 60000) {
    return false;
  } else {
    return true;
  }
};

const commentValidators = [
  {
    validator: commentLengthChecker,
    message: 'comment must be at least 1 but no more than 50000 characters'
  }
];

const blogSchema = new Schema({
  title: { type: String, required: true, validate: titleValidators },
  leadin: { type: String, validate: leadinValidators },
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
}, { usePushEach: true });

module.exports = mongoose.model('Blog', blogSchema);