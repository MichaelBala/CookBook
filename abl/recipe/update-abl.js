const path = require("path");
const LibraryDao = require("../../dao/recipe-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))

async function UpdateAbl(req, res) {
    let {id, name, difficulty, preparationTime, instructions, ingredientList, author} = req.body;
     // převedení pole na objekt
     let IngredientListObj = {}
     for (const key of ingredientList){
         IngredientListObj[key] = 50
     }   
    if ( name && typeof name === "string" && name.length < 200 &&
        ingredientList && ingredientList.length > 0 && ingredientList.length < 10 &&
        difficulty && typeof difficulty === "string" && difficulty.length < 50 &&
        preparationTime && preparationTime < 1000 &&
        instructions && instructions.length < 10000 &&
        id && typeof id === "string" && id.length < 25
    ) {
        const recipe = {id, name, difficulty, preparationTime, instructions, author};
        recipe.ingredientList = IngredientListObj // vložení objektu do výsledného objektu
        try {
            let result = await dao.updateRecipe(recipe);
            res.status(200).json(result);
        } catch (e) {
            if (e.code === "FAILED_TO_GET_BOOK") {
                res.status(400).json({error: e})
            } else if (e.code === "FAILED_TO_UPDATE_BOOK") {
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

module.exports = UpdateAbl;