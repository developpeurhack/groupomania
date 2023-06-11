import { DataTypes, Sequelize } from "sequelize" 
import User from "../models/user.js"
import db from "../db/db.js" 



const Message = db.define('message', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    attachment: {
        type: DataTypes.STRING(250),
        allowNull: true
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

});

// @ts-ignore
Message.associate = function (models) {
    User.hasOne(models.Message)
    Message.belongsTo(models.User, { foreignKey:"userId"})
    return Message
}

export default Message