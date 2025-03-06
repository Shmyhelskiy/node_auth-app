import { client } from '../utils/db.js';
import { DataTypes } from 'sequelize';
import { User } from './users.js';

export const Token = client.define(
  'token',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'tokens',
    updatedAt: false,
    createdAt: false,
  },
);

Token.belongsTo(User);
User.hasOne(Token);
