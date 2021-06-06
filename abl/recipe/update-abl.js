const path = require("path");
const LibraryDao = require("../../dao/recipe-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))

async function UpdateAbl(req, res) {
    let {id, name, difficulty, preparationTime, instructions, ingredientList, author} = req.body;
    if ( name && typeof name === "string" && name.length < 200 &&
        author && typeof author === "string" && author.length < 200 &&
        ingredientList && Object.keys(ingredientList).length > 0 && typeof ingredientList === "object" &&
        difficulty && typeof difficulty === "string" && difficulty.length < 50 &&
        preparationTime && preparationTime < 1000 && typeof preparationTime === "number" &&
        instructions && instructions.length < 10000 && typeof instructions === "string" &&
        id && typeof id === "string" && id.length < 25
    ) {
        const recipe = {id, name, difficulty, preparationTime, instructions, ingredientList, author};
        try {
            let result = await dao.updateRecipe(recipe);
            res.status(200).json(result);
        } catch (e) {
            if (e.code === "FAILED_TO_GET_RECIPE") {
                res.status(400).json({error: e})
            } else if (e.code === "FAILED_TO_UPDATE_RECIPE") {
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