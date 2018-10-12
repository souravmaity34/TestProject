/**
 * User.js
 *
 * @description :: The User table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'user',
  attributes: {
    id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    createdAt: {
      type: 'datetime'
    },
    updatedAt: {
      type: 'datetime'
    }
  }
};