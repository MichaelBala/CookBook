const path = require("path");
const LibraryDao = require("../../dao/Ingredients-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "Ingredients.json"))

async function CreateAbl(req, res) {
    let {id, name} = req.body;
    if (
        name && typeof name === "string" && name.length < 30 &&
        id && typeof id === "string" && id.length < 25
    ) {
        const author = {id, name, approved: false};
        try {
            let result = await dao.addAuthor(author);
            res.status(200).json(result);
        } catch (e) {
            if (e.code === "DUPLICATE_CODE") {
                res.status(400).json({error: e})
            } else if (e.code === "FAILED_TO_STORE_AUTHOR") {
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