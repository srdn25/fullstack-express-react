'use strict';
const {
  Model
} = require('sequelize');
const { consts: { TASK_STATUS }, prepareDate } = require('../../utils');
const { WEBSOCKET_MESSAGE_METHODS, WEBSOCKET_MESSAGE_TYPES } = require('../../utils/consts');
const WebSocketMessageHandler = require('../../controller/actions/task/websockets/MessageHandler');

module.exports = (sequelize, DataTypes, app) => {
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
    hooks: {
      afterCreate(instance, options) {
        // send data to all subscribers
        if (!app.websocket.messageHandler) {
          return;
        }

        app.websocket.messageHandler.sendDataToSubscribers(WEBSOCKET_MESSAGE_METHODS.create, {
          ...instance.serialize(),
        });
      },
      afterBulkCreate(instances, options) {
        // send data to all subscribers
        for (const instance of instances) {
          if (!app.websocket.messageHandler) {
            return;
          }

          app.websocket.messageHandler.sendDataToSubscribers(WEBSOCKET_MESSAGE_METHODS.create, {
            ...instance.serialize(),
          });
        }
      },
      afterDestroy(instance, options) {
        if (!app.websocket.messageHandler) {
          return;
        }

        app.websocket.messageHandler.sendDataToSubscribers(WEBSOCKET_MESSAGE_METHODS.delete, {
          ...instance.serialize(),
        });
      },

      /**
       * This can drastically impact performance,
       * depending on the number of records involved
       * (since, among other things, all instances will be loaded into memory)
       *
       * FOR REAL APPLICATION BETTER DELETE THIS HOOK!
       * Then handle it in afterBulkDestroy hook
       */
      beforeBulkDestroy: function(options){
        options.individualHooks = true;
        return options;
      },
      /**
       * {
       *   "where": {
       *     "id": 76904
       *   },
       *   "hooks": true,
       *   "individualHooks": false,
       *   "force": false,
       *   "cascade": false,
       *   "restartIdentity": false,
       *   "type": "BULKDELETE"
       * }
       */
      afterBulkDestroy(options) {
        // handle deleted entities
      },
      afterSave(instance, options) {
        if (!app.websocket.messageHandler) {
          return;
        }

        app.websocket.messageHandler.sendDataToSubscribers(WEBSOCKET_MESSAGE_METHODS.update, {
          ...instance.serialize(),
        });
      },
      afterUpdate(instance, options) {
        if (!app.websocket.messageHandler) {
          return;
        }

        app.websocket.messageHandler.sendDataToSubscribers(WEBSOCKET_MESSAGE_METHODS.update, {
          ...instance.serialize(),
        });
      },
      /**
       * This can drastically impact performance,
       * depending on the number of records involved
       * (since, among other things, all instances will be loaded into memory)
       *
       * FOR REAL APPLICATION BETTER DELETE THIS HOOK!
       * Then handle it in afterBulkDestroy hook
       */
      beforeBulkUpdate: function(options){
        options.individualHooks = true;
        return options;
      },
      afterBulkUpdate(instances, options) {
        // handle deleted entities
      },
    }
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
      status,
      author,
      dueDate: prepareDate(dueDate),
      createdAt: prepareDate(createdAt),
      updatedAt: prepareDate(updatedAt),
      ...description && { description },
    };
  };

  return Task;
};