const User = require("../Models/User");
const Save = require("../Models/save");
const Recipe = require("../Models/Recipe");


const login = async (req, res) => {
  console.log(req.body);
  const pass = req.body.password;
  console.log("🚀 ~ app.post ~ pass:", pass);
  const email = req.body.email;
  console.log("🚀 ~ app.post ~ email:", email);
  try {
    if (pass && email) {
      let user = await User.findOne({ email: req.body.email });
      console.log("🚀 ~ app.post ~ user:", user);
      if (user) {
        res.send(user);
      } else {
        res.send({ result: "No User Found" });
      }
    } else {
      res.send({ result: "Wrong Entry" });
    }
  } catch (error) {
    return res.status(HTTP.SUCCESS).send({
      status: false,
      code: HTTP.INTERNAL_SERVER_ERROR,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

const signup = async (req, res) => {
  try {
    // Check if all required fields are present in the request body
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        type: "validation",
        message: "All fields are required",
      });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        type: "duplicate",
        message: "Email is already registered",
      });
    }

    // Create a new user instance and save it to the database
    const newUser = new User({
      name,
      email,
      password,
    });
    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ status: "success", type: "registration", data: savedUser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", type: "server", message: "Server error" });
  }
};

/* const addRecipe = async (req, res) => {
  console.log("=====================>");
  try {
    console.log("file", req.file);

    const { error } = Recipe.validate(req.body);
    console.log("🚀 ~ addRecipe ~ error:", error);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const recipe = new Recipe({
      ...req.body,
      photo: req.file ? req.file.path : null,
    });

    console.log("🚀 ~ addRecipe ~ recipe:", recipe);
    const result = await recipe.save();
    console.log("result", result);

    res.send(result);
  } catch (error) {
    console.error("Error saving recipe:", error);
    res
      .status(500)
      .send(
        "An error occurred while adding the recipe. Please try again later."
      );
  }
}; */

const addRecipe = async (req, res) => {
  console.log("=====================>");
  try {

    console.log("file", req.file);

    const { error } = Recipe.validate(req.body);
    console.log("🚀 ~ addRecipe ~ error:", error);
    if (error) {
      console.log("Validation error:", error.details[0].message);
      return res.status(400).send(error.details[0].message);
    }
    

    const recipe = new Recipe({
      ...req.body,
      photo: req.file ? req.file.path : null,
    });

    console.log("🚀 ~ addRecipe ~ recipe:", recipe);
    const result = await recipe.save();
    console.log("result", result);

    res.send(result);
  } catch (error) {
    console.log("🚀 ~ error:", error)
    console.error("Error saving recipe:", error.message);
}}; 


const getRecipe = async (req, res) => {
  let recipe = await Recipe.find();
  if (recipe.length > 0) {
    res.send(recipe);
  } else {
    res.send({ result: "No Recipe" });
  }
};

const getRecipebyID = async (req, res) => {
  console.log("=============>");
  const id = req.params.id;
  try {
    let recipe = await Recipe.findById(id);
    if (recipe) {
      res.send(recipe);
      console.log("----->");
    } else {
      res.status(404).send({ error: "Recipe not found" });
    }
  } catch (error) {
    console.error("Error retrieving recipe:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

const saveRecipebyID = async (req, res) => {
  const id = req.params.id;
  try {
    let recipe = await Save.findById(id);
    if (recipe) {
      res.status(200).json(recipe);
    } else {
      res.status(404).json({ error: "Recipe not found" });
    }
  } catch (error) {
    console.error("Error retrieving recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const searchRecipe = async (req, res) => {
  let result = await Recipe.find({
    $or: [
      { name: { $regex: req.params.key } },
      { title: { $regex: req.params.key } },
      { recipeTitle: { $regex: req.params.key } },
    ],
  });
  res.send(result);
};

const saveRecipe = async (req, res) => {
  try {
    const { photo, recipeTitle, about, keywords, steps, ingredients } =
      req.body;

    if (
      !photo ||
      !recipeTitle ||
      !about ||
      !keywords ||
      !steps ||
      !ingredients
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newSave = new Save({
      photo,
      recipeTitle,
      about,
      keywords,
      steps,
      ingredients,
    });

    const savedRecipe = await newSave.save();

    const savedRecipeId = savedRecipe._id;

    res
      .status(201)
      .json({ message: "Recipe saved successfully", id: savedRecipeId });
    console.log("Recipe saved successfully with ID:", savedRecipeId);
  } catch (err) {
    console.error("Error saving recipe", err);
    res.status(500).json({ message: "Error saving recipe" });
  }
};

const deletesaveRecipe = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRecipe = await Save.findByIdAndDelete(id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("Error deleting recipe", err);
    res.status(500).json({ message: "Error deleting recipe" });
  }
};

const deleteRecipe = async (req, res) => {
  const recipeId = req.params.id;

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);

    if (deletedRecipe) {
      res.status(200).json({ message: "Recipe deleted successfully" });
    } else {
      res.status(404).json({ error: "Recipe not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getsaveRecipe = async (req, res) => {
  try {
    const savedRecipes = await Save.find();

    const formattedRecipes = savedRecipes.map((recipe) => ({
      _id: recipe._id,
      photo: recipe.photo,
      recipeTitle: recipe.recipeTitle,
      about: recipe.about,
      keywords: recipe.keywords,
      steps: recipe.steps,
      ingredients: recipe.ingredients,
    }));

    res.status(200).json(formattedRecipes);
  } catch (err) {
    console.error("Error fetching saved recipes", err);
    res.status(500).json({ message: "Error fetching saved recipes" });
  }
};

module.exports = {
  login,
  signup,
  addRecipe,
  getRecipe,
  getRecipebyID,
  saveRecipebyID,
  searchRecipe,
  saveRecipe,
  deletesaveRecipe,
  deleteRecipe,
  getsaveRecipe,
};
