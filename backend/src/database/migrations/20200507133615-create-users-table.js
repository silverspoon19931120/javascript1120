'use strict';
const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {

    /** @param {QueryInterface} queryInterface * @param {DataTypes} Sequelize */
    up: (queryInterface, Sequelize) => {

        return queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            name: {
                type: Sequelize.STRING,
                allowNull: false
            },

            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },

            password: {
                type: Sequelize.STRING,
                allowNull: false
            },

            admin: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },

            reset_password_token: {
                type: Sequelize.STRING,
            },

            reset_password_expires: {
                type: Sequelize.DATE,
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },

    /** @param {QueryInterface} queryInterface * @param {DataTypes} Sequelize */
    down: (queryInterface, Sequelize) => {

        return queryInterface.dropTable('users');
    }
};
