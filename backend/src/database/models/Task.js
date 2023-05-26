'use strict';
const {
  Model
} = require('sequelize');
const { consts: { TASK_STATUS } } = require('../../utils');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Task.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(TASK_STATUS)),
      allowNull: false,
      defaultValue: TASK_STATUS.todo,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Task',
    tableName: 'tbl_task',
  });

  Task.prototype.serialize = function serialize() {
    const {
      id,
      title,
      description,
      status,
      author,
      dueDate,
      createdAt,
      updatedAt,
    } = this;

    return {
      id,
      title,
      description,
      status,
      author,
      dueDate,
      createdAt,
      updatedAt,
    };
  };

  return Task;
};