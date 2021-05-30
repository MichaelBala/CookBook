const path = require("path");
const LibraryDao = require("../../dao/recipe-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))

async function UpdateAbl(req, res) {
    let {id, name, authorList} = req.body;
    if (
        (id && typeof id === "string" && id.length < 25) &&
        (name && typeof name === "string" && name.length < 200) &&
        (authorList && authorList.length > 0 && authorList.length < 10)
    ) {
        const book = {id, name, authorList};
        try {
            let result = await dao.updateBook(book);
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