const path = require("path");
const LibraryDao = require("../../dao/Ingredients-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "Ingredients.json"))

async function ListAbl(req, res) {
    let {name} = req.body;
    if (
        !name || (name && typeof name === "string" && name.length < 30)
    ) {
        try {
            let authorList = await dao.listAuthors(name);
            res.status(200).json({itemList: authorList, total: authorList.length});
        } catch (e) {
            res.status(500).json({error: e})
        }
    } else {
        res.status(400).json({
            "error": "Invalid dtoIn"
        })
    }
}

module.exports = ListAbl;