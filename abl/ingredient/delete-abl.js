const path = require("path");
const LibraryDao = require("../../dao/ingredients-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "ingredients.json"))
const LibraryRecipeDao = require("../../dao/recipe-dao");
let recipeDao = new LibraryRecipeDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))


async function DeleteAbl(req, res) {
    let {id} = req.body;
    if (
        id && typeof id === "string" && id.length < 25
    ) {
        try {           
            let usedIngredients = await recipeDao.listRecipeIngredients();
            if (usedIngredients.has(id)){ // check whether ingredient exists in some recipe
                res.status(400).json({"error": "ingredient is used in some recipe. Ingredient is not deleted"});
            } else {
                await dao.deleteIngredient(id);
                res.status(200).json({});
            }
        } catch (e) {
            if (e.code === "FAILED_TO_DELETE_ingredient") {
                res.status(500).json({error: e})
            } else {
                res.status(500).json({error: e})
            }
        }
    } else {
        res.status(400).json({
            "error": "Invalid dtoIn"
        })
    }
}












module.exports = DeleteAbl;