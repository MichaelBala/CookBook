const path = require("path");
const LibraryDao = require("../../dao/ingredients-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "ingredients.json"))

async function GetAbl(req, res) {
    let {id} = req.body;
    if (
        id && typeof id === "string" && id.length < 25
    ) {
        try {
            let result = await dao.getIngredient(id);
            res.status(200).json(result);
        } catch (e) {
            if (e.code === "FAILED_TO_GET_INGREDIENT") {
                res.status(400).json({error: e})
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

module.exports = GetAbl;