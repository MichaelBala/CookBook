const path = require("path");
const LibraryDao = require("../../dao/ingredients-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "ingredients.json"))

async function UpdateAbl(req, res) {
    let {id, name, measure} = req.body;
    if (
        (id && typeof id === "string" && id.length < 25) &&
        (name && typeof name === "string" && name.length < 30) &&
        measure && typeof measure === "string" && measure.length < 10
    ) {
        const ingredient = {id, name, measure};
        try {
            let result = await dao.updateIngredient(ingredient);
            res.status(200).json(result);
        } catch (e) {
            if (e.code === "FAILED_TO_GET_ingredient") {
                res.status(400).json({error: e})
            } else if (e.code === "FAILED_TO_UPDATE_ingredient") {
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