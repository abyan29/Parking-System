import { Sequelize } from "sequelize";
import "dotenv/config";

//isi nama database, username_mysql, password_mysql di .env
const sequelizeConnection = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
    });

export default sequelizeConnection;