/**
 * UserController.js
 *
 * @description :: Server-side logic for managing subscriptions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var bcrypt = require("bcrypt")
module.exports = {
  createUser: function (req, res) {
    var reqData = req.allParams();

    if (_.size(reqData) == 0 || !_.has(reqData, 'name') || !_.has(reqData, 'email') || !_.has(reqData, 'password')) {
      return res.ok({
        status: 0,
        result: "Less Params"
      })
    }
    bcrypt.hash(reqData.password, 10, (err, hash) => {
      if (err) {
        return res.ok({
          status: 0,
          result: err
        })
      }
      reqData.password = hash;

      User.findOne({
        email: reqData.email
      }).then((user) => {
        if (user) {
          return res.ok({
            status: -1,
            result: "Email Already Exists!!!"
          })
        }
        return User.create(reqData)
          .then((user) => {
            return res.ok({
              status: 1,
              result: user
            })
          }).catch((err) => {
            console.log(err);
            return res.serverError(err);
          })
      }).catch((err) => {
        console.log(err);
        return res.serverError(err);
      })
    })
  },

  getAllUser: function (req, res) {

    User.find().then((allUser) => {
      if (allUser) {
        _.forEach(allUser, (item) => {
          delete item.password;
        })
        return res.ok({
          status: 1,
          count: allUser.length,
          result: allUser
        })
      }
      return res.ok({
        status: -1
      })
    }).catch((err) => {
      console.log(err);
      return res.serverError(err);
    })
  },

  getUserById: function (req, res) {
    var reqData = req.allParams();

    User.find({
      id: reqData.id
    }).then((user) => {
      if (user) {
        _.forEach(user, (item) => {
          delete item.password;
        })
        return res.ok({
          status: 1,
          count: user.length,
          result: user
        })
      }
      return res.ok({
        status: -1
      })
    }).catch((err) => {
      console.log(err);
      return res.serverError(err);
    })
  },

  updateUser: function (req, res) {
    var reqData = req.allParams();
    if (_.has(reqData, 'password')) {
      delete reqData.password;
    }

    User.update({
      id: reqData.id
    }, reqData).then((updatedUser) => {
      if (updatedUser) {
        return res.ok({
          status: 1,
          result: updatedUser
        })
      }
      return res.ok({
        status: -1
      })
    }).catch((err) => {
      console.log(err);
      return res.serverError(err);
    })
  },

  login: function (req, res) {
    var reqData = req.allParams();

    User.findOne({
      email: reqData.email
    }).then((found) => {
      if (!found) {
        return res.ok({
          status: -1,
          result: "Invalid Email"
        })
      }
      return bcrypt.compare(reqData.password, found.password).then((compareResult) => {
        if (!compareResult) {
          return res.ok({
            status: -1,
            result: "Wrong Password"
          })
        }
        delete found.password;
        return res.ok({
          status: 1,
          result: found
        })
      })
    }).catch((err) => {
      console.log(err);
      return res.serverError(err);
    })
  },

  resetPassword: function (req, res) {
    var reqData = req.allParams();

    User.findOne({
      email: reqData.email
    }).then((user) => {
      if (!user) {
        return res.ok({
          status: -1,
          result: "Please Provide an Registered Email"
        })
      }
      return bcrypt.hash(reqData.password, 10, (err, hash) => {
        if (err) {
          return res.ok({
            status: 0,
            result: err
          })
        }
        reqData.password = hash;
        return User.update({
          email: reqData.email
        }, {
          password: reqData.password
        }).then((reseted) => {
          delete reseted[0].password;
          return res.ok({
            status: 1,
            result: reseted
          })
        })
      })
    }).catch((err) => {
      console.log(err);
      return res.serverError(err);
    })
  },
};
