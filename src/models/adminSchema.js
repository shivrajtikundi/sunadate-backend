var mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const adminschema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email:{
        type: String, 
        required: true
    },
    role:{
        type: String,
        enum : ['Editor', 'Admin','Viewer'],
        default: 'Viewer'
    },
    password:{
        type: String, 
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

})


adminschema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, "test", {
      expiresIn: "3d",
    });
  };

adminschema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    return resetToken;
};

adminschema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.confirmPassword = await bcrypt.hash(this.confirmPassword, 12);
    }
    next()
})

module.exports = mongoose.model("adminschema", adminschema)