import connection from "./connection.js";
import { DataTypes } from "sequelize";
import User from "./user.js";

const Parkir = connection.define(
    "Parkir",
    {
        user_id: {
            type: DataTypes.INTEGER,
        },
        duration: DataTypes.INTEGER,
        total: DataTypes.INTEGER,
        nopol: DataTypes.STRING,
    },
    { timestamps: false, tableName: "Parkir" }
);
Parkir.belongsTo(User, {targetKey: "id", foreignKey: "user_id"});

export default Parkir;