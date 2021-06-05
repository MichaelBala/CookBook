const path = require("path");
const LibraryDao = require("../../dao/recipe-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))

async function ListUsedIngredientsAbl(req, res) {
    let {name} = req.body;
    if (
        !name || (name && typeof name === "string" && name.length < 30)
    ) {
        try {
            let usedIngredientsList = await dao.listRecipeIngredients();
            res.status(200).json({itemList: Array.from(usedIngredientsList), total: usedIngredientsList.length});
          //console.log(usedIngredientsList);
          //console.log({itemList: usedIngredientsList, total: usedIngredientsList.size});
        } catch (e) {
            res.status(500).json({error: e})
        }
    } else {
        res.status(400).json({
            "error": "Invalid dtoIn"
        })
    }
}

//console.log(ListUsedIngredientsAbl( 1,2))
module.exports = ListUsedIngredientsAbl;
