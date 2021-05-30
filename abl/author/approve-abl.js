const path = require("path");
const LibraryDao = require("../../dao/Ingredients-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "Ingredients.json"))

async function UpdateAbl(req, res) {
    let {id} = req.body;
    if (
        (id && typeof id === "string" && id.length < 25)
    ) {
        const ingredient = {id, approved: true};
        try {
            let result = await dao.approveIngredient(ingredient);
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