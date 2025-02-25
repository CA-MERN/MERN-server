const User = require('../models/user');
const SavedRecipe = require('../models/recipe');
const {
  userQueryBuilder,
  recipeIdGetter
} = require("../helpers/recipe_helper")
const {
  sanitizeDataForIngredientQuery,
  singleRecipeAPISearch,
  detailedRecipeAPISearch
} = require("../helpers/api_search_helpers.js")
const ObjectId = require('mongoose').Types.ObjectId;


const returnRecipesToBrowse = async (req) => {
  //console.log(req.user)
   const recipes = await User.findOne({ username: req.user.username })
    .then(recipes =>  userQueryBuilder(recipes))
    .then(queryItems =>  sanitizeDataForIngredientQuery(queryItems))
    .then(recipesObject => recipeIdGetter(recipesObject.data))
    .then(data => detailedRecipeAPISearch(data))
    .then(recipes =>  {return recipes})
    .catch(error => {return error})
  return recipes
};  


const getAllSavedRecipes = function (req) {
 //return SavedRecipe.find({ username: 'testusername'})  //for testing purposes only
  return SavedRecipe.find({ username: req.user.username })
}

const getSingleRecipe =  async function (req) {
  if (ObjectId.isValid(req.params.id)){
    return SavedRecipe.findById(req.params.id);
  } else {
    let resp = await singleRecipeAPISearch(req.params.id)
    return resp.data
  }
  
}

const addSavedRecipe = function (req) {
   let date = Date.now();
    // Set date for this new recipe
    req.body.create_date = date
    req.body.modified_date = date
  return new SavedRecipe(req.body);
}

const deleteFromSavedRecipes = function (id) {
  return SavedRecipe.findByIdAndRemove(id);
};


module.exports = {
  returnRecipesToBrowse,
  singleRecipeAPISearch,
  getAllSavedRecipes,
  getSingleRecipe,
  addSavedRecipe,
  deleteFromSavedRecipes
}