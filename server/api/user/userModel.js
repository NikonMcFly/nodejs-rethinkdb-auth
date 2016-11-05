var thinky = require('thinky')();
var type = thinky.type;
var bcrypt = require('bcrypt');

var User = thinky.createModel('user', {

	username        : type.string(),
	password        : type.string()

});

User.pre('save', function(next) {
  if (!this.isModified('password')) return next();

  this.password = this.encryptPassword(this.password);
  next();
})

User.methods = {
  // check the passwords on signin
  authenticate: function(plainTextPword) {
    return bcrypt.compareSync(plainTextPword, this.password);
  },
  // hash the passwords
  encryptPassword: function(plainTextPword) {
    if (!plainTextPword) {
      return ''
    } else {
      var salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(plainTextPword, salt);
    }
  },

  toJson: function() {
    var obj = this.toObject()
    delete obj.password;
    return obj;
  }
};

module.exports = User;
