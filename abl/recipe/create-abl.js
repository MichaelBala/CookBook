const path = require("path");
const LibraryDao = require("../../dao/recipe-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))
const IngredientsDao = require("../../dao/ingredients-dao");
let ingredientsDao = new IngredientsDao(path.join(__dirname, "..", "..", "storage", "ingredients.json"))

async function CreateAbl(req, res) {
    let {id, name, difficulty, preparationTime, instructions, ingredientList, author} = req.body;


    if (
        name && typeof name === "string" && name.length < 200 &&
        ingredientList && Object.keys(ingredientList).length > 0 &&
        difficulty && typeof difficulty === "string" && difficulty.length < 50 &&
        preparationTime && preparationTime < 1000 &&
        instructions && instructions.length < 10000 &&
        id && typeof id === "string" && id.length < 25
    ) {
        for (let i = 0; i< ingredientList.length; i++) {
            try {
                await ingredientsDao.getIngredient(ingredientList[i])
            } catch (e) {
                if (e.code === "FAILED_TO_GET_INGREDIENT") {
                    res.status(400).json({error: e})
                } else {
                    res.status(500).json({error: e})
                }
            }
        }
        const recipe = {id, name, difficulty, preparationTime, instructions, ingredientList, author};
        try {
            let result = await dao.addRecipe(recipe);
            res.status(200).json(result);
        } catch (e) {
            if (e.code === "DUPLICATE_CODE") {
                res.status(400).json({error: e})
            } else if (e.code === "FAILED_TO_STORE_RECIPE") {
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

module.exports = CreateAbl;