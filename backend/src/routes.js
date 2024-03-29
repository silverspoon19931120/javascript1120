const express = require("express");
const multer = require("multer");
const apicache = require("apicache");

// Multer
const multerConfig = require("./config/multerConfig");
const multerErrorHandler = require("./middlewares/multerErrorHandler");

// Authentication
const jwtAuthentication = require("./middlewares/jwtAuthentication");
const adminJwtAuthentication = require("./middlewares/adminJwtAuthentication");

// Validators
const addressValidator = require("./controllers/addressController/validators");
const categoryValidator = require("./controllers/categoryController/validators");
const freightValidator = require("./controllers/freightController/validators");
const imageValidator = require("./controllers/imageController/validators");
const orderAdminValidator = require("./controllers/orderAdminController/validators");
const orderValidator = require("./controllers/orderController/validators");
const orderPaymentValidator = require("./controllers/orderPaymentController/validators");
const productValidator = require("./controllers/productController/validators");
const sessionValidator = require("./controllers/sessionController/validators");
const userValidator = require("./controllers/userController/validators");
const userResetPasswordValidator = require("./controllers/userResetPasswordController/validators");
const installmentsValidator = require("./controllers/installmentsController/validators");

// Controllers
const addressController = require("./controllers/addressController");
const categoryController = require("./controllers/categoryController");
const freightController = require("./controllers/freightController");
const imageController = require("./controllers/imageController");
const orderAdminController = require("./controllers/orderAdminController");
const orderController = require("./controllers/orderController");
const orderPaymentController = require("./controllers/orderPaymentController");
const productController = require("./controllers/productController");
const sessionController = require("./controllers/sessionController");
const userController = require("./controllers/userController");
const userResetPasswordController = require("./controllers/userResetPasswordController");
const installmentsController = require("./controllers/installmentsController");

const router = express.Router();

const cache = apicache.middleware("1 minute", null, {
  enabled: process.env.NODE_ENV != "test",
  statusCodes: {
    include: [200],
  },
});

// BUSCA, ADICIONA, ALTERA OU REMOVE USUÁRIOS
router.get(
  "/users",
  userValidator.list,
  adminJwtAuthentication,
  userController.list
);
router.get(
  "/users/:id",
  userValidator.show,
  jwtAuthentication,
  userController.show
);
router.post("/users", userValidator.store, userController.store);
router.put(
  "/users",
  userValidator.update,
  jwtAuthentication,
  userController.update
);
router.delete(
  "/users",
  userValidator.destroy,
  jwtAuthentication,
  userController.destroy
);

// BUSCA, ADICIONA, ALTERA OU REMOVE ENDEREÇOS DE UM USUÁRIO
router.get(
  "/addresses",
  addressValidator.list,
  jwtAuthentication,
  addressController.list
);
router.post(
  "/addresses",
  addressValidator.store,
  jwtAuthentication,
  addressController.store
);
router.put(
  "/addresses/:id",
  addressValidator.update,
  jwtAuthentication,
  addressController.update
);
router.delete(
  "/addresses/:id",
  addressValidator.destroy,
  jwtAuthentication,
  addressController.destroy
);

// BUSCA PARCELAS DO CARTÃO DE CREDITO
router.post(
  "/installments",
  installmentsValidator.show,
  installmentsController.show
);

// BUSCA E ADICIONA ORDERS DE COMPRA DE UM USUÁRIO
router.get(
  "/orders",
  orderValidator.list,
  jwtAuthentication,
  orderController.list
);
router.get(
  "/orders/:id",
  orderValidator.show,
  jwtAuthentication,
  orderController.show
);
router.post(
  "/orders",
  orderValidator.store,
  jwtAuthentication,
  orderController.store
);

// PAGA UMA ORDER DE COMPRA
router.post(
  "/orders/:id/payment",
  orderPaymentValidator.store,
  jwtAuthentication,
  orderPaymentController.store
);

// BUSCA, ALTERA OU REMOVE PEDIDOS DE UM USUÁRIO POR UM ADMIN
router.get(
  "/admin/orders",
  orderAdminValidator.list,
  adminJwtAuthentication,
  orderAdminController.list
);
router.put(
  "/admin/orders/:id",
  orderAdminValidator.update,
  adminJwtAuthentication,
  orderAdminController.update
);
router.delete(
  "/admin/orders/:id",
  orderAdminValidator.destroy,
  adminJwtAuthentication,
  orderAdminController.destroy
);

// UPDATE DE SENHA POR EMAIL ("PERDEU A SENHA?")
router.post(
  "/reset-password",
  userResetPasswordValidator.store,
  userResetPasswordController.store
);
router.put(
  "/reset-password",
  userResetPasswordValidator.update,
  userResetPasswordController.update
);

// RETORNA UMA CHAVE JWT
router.post("/sessions", sessionValidator.store, sessionController.store);

// BUSCA, ADICIONA, ALTERA OU REMOVE UM PRODUTO
router.get("/products", productValidator.list, cache, productController.list);
router.get(
  "/products/:id",
  productValidator.show,
  cache,
  productController.show
);
router.post(
  "/products",
  productValidator.store,
  adminJwtAuthentication,
  productController.store
);
router.put(
  "/products/:id",
  productValidator.update,
  adminJwtAuthentication,
  productController.update
);
router.delete(
  "/products/:id",
  productValidator.destroy,
  adminJwtAuthentication,
  productController.destroy
);

// ADICIONA OU REMOVE UMA IMAGEM DO PRODUTO
router.post(
  "/products/:id/images",
  imageValidator.store,
  adminJwtAuthentication,
  multer(multerConfig).any(),
  multerErrorHandler,
  imageController.store
);
router.delete(
  "/products/images/:id",
  imageValidator.destroy,
  adminJwtAuthentication,
  imageController.destroy
);

// BUSCA, ADICIONA, ALTERA OU REMOVE UMA CATEGORIA
router.get("/categories", categoryController.list);
router.post(
  "/categories",
  categoryValidator.store,
  adminJwtAuthentication,
  categoryController.store
);
router.put(
  "/categories/:id",
  categoryValidator.update,
  adminJwtAuthentication,
  categoryController.update
);
router.delete(
  "/categories/:id",
  categoryValidator.destroy,
  adminJwtAuthentication,
  categoryController.destroy
);

// CALCULO DE FRETE
router.post("/freight", freightValidator.store, freightController.store);

module.exports = router;
