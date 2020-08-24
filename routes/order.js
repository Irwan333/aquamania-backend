const express = require("express");
const router = express.Router();

const { requireSignin } = require("../controllers/auth");
const { adminById, addOrderToUserHistory } = require("../controllers/user");
const {
  create,
  listOrders,
  getStatusValues,
  listOrdersUser,
  getStatusValuesUser,
  orderById,
  updateOrderStatus,
  invoice,
} = require("../controllers/order");
const { decreaseQuantity } = require("../controllers/product");

router.post(
  "/order/create/:userId",
  addOrderToUserHistory,
  decreaseQuantity,
  create
);

router.get("/order/list/:userId", requireSignin, listOrders);
router.get("/invoice/:orderId", requireSignin, invoice);
router.get("/order/status-values/:userId", requireSignin, getStatusValues);
// router.get("/invoice/list/:userId", requireSignin, listOrdersUser);
// router.get(
//   "/invoice/status-values/:userId",
//   requireSignin,
//   getStatusValuesUser
// );
router.put("/order/:orderId/status/:userId", requireSignin, updateOrderStatus);

router.param("userId", adminById);
router.param("orderId", orderById);

module.exports = router;
