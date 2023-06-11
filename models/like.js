import {DataTypes, Sequelize} from "sequelize";
import User from "../models/user.js";
import Message from "../models/message.js"
import db from "../db/db.js";



const Like = db.define('like', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    islike: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    messageId: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull:false
    
    }
});

// @ts-ignore
Like.associate = function (models) {
    User.belongsToMany(models.Message, {
        through: models.Like,
        foreignKey: 'userId',
        otherKey: 'messageId'
    });
    Message.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'messageId',
        otherKey: 'userId'
    });

return Like    
}

export default Like 