import { DataTypes } from "sequelize";
import { client } from "../utils/db.js";

export const User = client.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activationToken: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    }
  },
  {
    tableName: 'users',
    updatedAt: false,
    createdAt: false,
  },
);
