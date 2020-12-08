const User = require('../models/user');

// get all Ingredients
// return a query
const getAllIngredients = function (req) {
   
    return  User.findOne({ username:  req.params.username })
};


// add Ingredient
// returns a Post object
const addIngredient = async function (req) {
    // console.log(req.originalUrl)
    // console.log(req.url)
    // console.log(req.path)
    // console.log(typeof req.url)
    // console.log(typeof req.path)
    // console.log(typeof req.originalUrl)
    let checker = req.path
    let fridge = checker.includes("fridge")
    let pantry = checker.includes("pantry")
    console.log(fridge)
    console.log(pantry)
    let user = await User.findOne({ username:  req.params.username }).exec();
 
    const newItem = req.body.item;
  
    if (fridge) {
        user.fridgeIngredients.push(newItem);
        console.log("new Fridge Item")
    } else if (pantry)  {
        user.pantryIngredients.push(newItem);
        console.log("new Pantry Item")
    } else {
        console.log("error message")
    }
  
    return User.findByIdAndUpdate(user._id, user, {
        new: true //this is needed for updating
    });
};

// delete Ingredient
// returns a query
const removeIngredient = function (req) {
    let checker = req.path
    let fridge = checker.includes("fridge")
    let pantry = checker.includes("pantry")
    console.log(fridge)
    console.log(pantry)
    if (fridge) {
        console.log("delete Fridge Item")
        return  User.findOneAndUpdate(
            { username: req.params.username },
            { $pull: { fridgeIngredients: req.body.item} },
            { new: true }
        )
    } else if (pantry) {
        console.log("delete pantry Item")
        return  User.findOneAndUpdate(
            { username: req.params.username },
            { $pull: { pantryIngredients: req.body.item} },
            { new: true }
        )
    } else {
        console.log("error message")
    }
};


module.exports = {
    getAllIngredients,
    addIngredient,
    removeIngredient
}