const { DataTypes } = require('sequelize');
import { sequelize } from './index';

const User = sequelize.define('user', {
  name: DataTypes.STRING,
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING
});

export { User }