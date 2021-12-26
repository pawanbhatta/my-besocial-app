const router = require("express").Router();
const authController = require("../controllers/authController");
const isAuthenticated = require("../middlewares/auth");

// REGISTER A USER
router.post("/register", authController.register);

// LOGIN A USER
router.post("/login", authController.login);

// GET A REFRESH TOKEN
router.post("/refresh", authController.refreshToken);

// LOGOUT USER
router.post("/logout", isAuthenticated, authController.logout);
module.exports = router;
