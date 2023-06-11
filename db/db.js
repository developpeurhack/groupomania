import { Sequelize } from "sequelize" 

export default new Sequelize('essai', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    port:8889

})