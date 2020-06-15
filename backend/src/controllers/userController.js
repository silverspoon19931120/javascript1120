const express = require('express');

const UserModel = require('../models/UserModel');

module.exports = {

    /** @param {express.Request} req * @param {express.Response} res */
    async index(req, res){

        try {
            
            const users = await UserModel.findAll({ attributes: { exclude: ['password'] }});
        
            return res.json(users);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "internal error" });
        }
    },

    /** @param {express.Request} req * @param {express.Response} res */
    async show(req, res){

        const { id } = req.params;

        try {
            
            let user = await UserModel.findByPk(id, { 
                attributes: ['id', 'name', 'email', 'admin'],
                include: [{
                    association: 'addresses',
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                    required: false
                },
                {
                    association: 'orders',
                    attributes: { exclude: ['updatedAt', 'address_id', 'user_id'] },
                    required: false,
                    include: [{
                        association: 'address',
                        attributes: { exclude: ['createdAt', 'updatedAt', 'user_id']},
                        required: false
                    },
                    {
                        association: 'products',
                        attributes: ['id', 'title'],
                        through: { attributes: ['quantity_buyed', 'product_price', 'product_discount_percent'] },
                        required: false,
                        paranoid: false,
                        include: {
                            association: 'images',
                            attributes: ['id', 'url'],
                            required: false
                        }
                    }]
                }]
            });

            if(!user) return res.status(400).json({ message: 'user not found'});
        
            return res.json(user);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "internal error" });
        }
    },
    
    /** @param {express.Request} req * @param {express.Response} res */
    async store(req, res){

        const { name, email, password } = req.body;
        
        try {

            const user = await UserModel.findOne({ where: { email }});

            if(user) return res.status(400).json({ message: 'email already in use' });
            
            const newUser = await UserModel.create({ name, email, password });
    
            newUser.password = undefined;

            return res.json({ user: newUser, token: newUser.generateToken() });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "internal error" });
        }
    },

    /** @param {express.Request} req * @param {express.Response} res */
    async update(req, res){

        const { id } = req.tokenPayload;
        const { name, email, currentPassword, newPassword } = req.body;

        try {

            let password;
            const user = await UserModel.findByPk(id);

            if(currentPassword && newPassword){

                if(await user.checkPassword(currentPassword)){

                    password = newPassword;

                } else {

                    return res.status(400).json({ message: 'wrong current password' })
                }
            }

            if(!password) password = undefined;
            
            const updated = await user.update({
                    name,
                    email,
                    password
                },
                { 
                    individualHooks: true 
                }
            );

            if(Object.keys(updated._changed).length == 0) return res.status(400).json({ message: 'no update has been made' });
        
            return res.sendStatus(200);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "internal error" });
        }
    },

    /** @param {express.Request} req * @param {express.Response} res */
    async destroy(req, res){

        const { id } = req.tokenPayload;

        try {

            const user = await UserModel.destroy({ where: { id } });

            if(user === 0) return res.status(400).json({ message: 'user not found'});

            return res.sendStatus(200);
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "internal error" });
        }
    }
}


