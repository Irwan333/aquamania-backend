const express = require("express");
const router = express.Router();

const {
  create,
  categoryById,
  read,
  update,
  remove,
  list,
} = require("../controllers/category");
const { requireSignin } = require("../controllers/auth");
const { adminById } = require("../controllers/user");

router.get("/category/:categoryId", read);
router.post("/category/create/:userId", requireSignin, create);
// router.put('/category/:categoryUpdateId/:userId', requireSignin, isAuth, isAdmin, update);
router.put("/category/:categoryId/:userId", requireSignin, update);

router.delete("/category/:categoryId/:userId", requireSignin, remove);
router.get("/categories", list);

router.param("categoryId", categoryById);
router.param("userId", adminById);

module.exports = router;
