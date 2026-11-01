import connection from "./connection.js";
import { DataTypes } from "sequelize";

const User = connection.define(
    "User",
    {
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
    },
    { timestamps: false, tableName: "User" }
);

export default User;