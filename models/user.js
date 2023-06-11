import { DataTypes } from "sequelize" 
import db from "../db/db.js"

const User = db.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    bio: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }

});

// @ts-ignore
User.associate = function (models) {
    User.hasMany(models.Message, { foreignKey:'userId'});
    return User
}
export default User
