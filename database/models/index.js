const { Sequelize, DataTypes } = require('sequelize')
const fs = require('fs');
const path = require('path');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + './../config/config.js');

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// const sequelize = new Sequelize(config.database, config.username, config.password, config);
const sequelize = new Sequelize('database', 'username', 'password', {dialect: 'sqlite', storage: './mydb.db'});
// Create an instance of sequelize

// Validate and connect to the database
sequelize.authenticate()
    .then(() => {console.log('Successfully connected to database!')})
    .catch((error) => console.log('Failed to connect database:', error))


export {sequelize};