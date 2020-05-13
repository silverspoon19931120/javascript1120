'use strict';
const Sequelize = require('sequelize');

module.exports = {

    /** @param {Sequelize.QueryInterface} queryInterface * @param {Sequelize.DataTypes} Sequelize */
    up: (queryInterface, Sequelize) => {

        return queryInterface.createTable('products', {
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

            description: {
                type: Sequelize.STRING,
                allowNull: false
            },

            price: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },

            category_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'categories', key: 'id' }
            },  

            quantity_stock: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false
            },  

            discount_percent: {
                type: Sequelize.DECIMAL,
                defaultValue: 0
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            },

            deleted_at: {
                type: Sequelize.DATE,
            }
        });
    },

    /** @param {Sequelize.QueryInterface} queryInterface * @param {Sequelize.DataTypes} Sequelize */
    down: (queryInterface, Sequelize) => {

        return queryInterface.dropTable('products');
    }
};