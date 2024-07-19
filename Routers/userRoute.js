const express = require("express");
const route = express.Router();
const userController = require("../Controllers/userController");
const upload = require("../Middleware/upload");

//===========================================AUTH=====================================================

route.post("/login", userController.login);
route.post("/register", userController.signup);
route.post("/AddRecipe", upload.single("photo"), userController.addRecipe);
route.post("/save", userController.saveRecipe);
route.get("/Recipe", userController.getRecipe);
route.get("/Recipe/:id", userController.getRecipebyID);
route.get("/saved-recipes/:id", userController.saveRecipebyID);
route.get("/search/:key", userController.searchRecipe);
route.get("/saved-recipes", userController.getsaveRecipe);
route.delete("/saved-recipes/:id", userController.deletesaveRecipe);
route.delete("/recipes/:id", userController.deleteRecipe);

module.exports = route;
