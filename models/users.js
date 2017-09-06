const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let emailLenthChecker = (email) => {
  if (!email) return false;
  else if (email.length < 6 || email.length > 254) {
      return false;
  } else {
    return true;
  }
};

let validEmailChecker = (email) => {
  if (!email) return false;
  else {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email);
  }
};

const emailValidators = [
  {
    validator: emailLenthChecker, 
    message: 'email must be at least 6 characters but no more than 254'
  },
  {
    validator: validEmailChecker,
    message: 'must be a valid email'
  }
];

let usernameLengthChecker = (username) => {
  if (!username) return false;
  else if (username.length < 3 || username.length > 15) {
    return false;
  } else {
    return true;
  }
};

let validUsername = (username) => {
  if (!username) return false;
  else {
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    return regExp.test(username);
  }
};

const usernameValidators = [
  {
    validator: usernameLengthChecker,
    message: 'username be at least 3 characters but no more than 15'
  },
  {
    validator: validUsername,
    message: 'username must not contain special characters'
  }
];

let passwordLengthChecker = (password) => {
  if (!password) return false;
  else if (password.length < 8  || password.length > 35) {
    return false;
  } else {
    return true;
  }
};

let validPassword = (password) => {
  if (!password) return false;
  else {
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    return regExp.test(password);
  }
};

const passwordValidators = [
  {
    validator: passwordLengthChecker,
    message: 'password must be at least 8 characters but no more than 35'
  },
  {
    validator: validPassword,
    message: 'must contain at least one uppercase, lowercase, number and special character'
  }
];

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
  username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
  password: { type: String, required: true, validate: passwordValidators }
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password'))
    return next();

  bcrypt.hash(this.password, null, null, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);