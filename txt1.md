const { Sequelize, DataTypes } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('database', 'username', 'password', {
host: 'localhost',
dialect: 'mysql', // Replace with your database dialect
});

// Define the models
const User = sequelize.define('User', {
name: {
type: DataTypes.STRING,
allowNull: false,
},
});

const Task = sequelize.define('Task', {
title: {
type: DataTypes.STRING,
allowNull: false,
},
});

const Project = sequelize.define('Project', {
name: {
type: DataTypes.STRING,
allowNull: false,
},
});

// Define the one-to-many relationship
Project.hasMany(Task);
Task.belongsTo(Project);

// Define the many-to-many relationship
User.belongsToMany(Project, { through: 'UserProject' });
Project.belongsToMany(User, { through: 'UserProject' });

// Sync the models with the database
sequelize.sync()
.then(() => {
console.log('Models synchronized successfully');
})
.catch((error) => {
console.error('Error synchronizing models:', error);
});

///////////////

const { Sequelize, DataTypes } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('database', 'username', 'password', {
host: 'localhost',
dialect: 'mysql', // Replace with your database dialect
});

// Define the models
const User = sequelize.define('User', {
name: {
type: DataTypes.STRING,
allowNull: false,
},
});

const Group = sequelize.define('Group', {
name: {
type: DataTypes.STRING,
allowNull: false,
},
});

// Define the many-to-many association
const UserGroup = sequelize.define('UserGroup', {});

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

// Sync the models with the database
sequelize.sync()
.then(() => {
console.log('Models synchronized successfully');
})
.catch((error) => {
console.error('Error synchronizing models:', error);
});
