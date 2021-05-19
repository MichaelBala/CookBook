const path = require("path");
const LibraryDao = require("../../dao/book-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "books.json"))

async function ListAbl(req, res) {
    let {name} = req.body;
    if (
        !name || (name && typeof name === "string" && name.length < 30)
    ) {
        try {
            let bookList = await dao.listBooks(name);
            res.status(200).json({itemList: bookList, total: bookList.length});
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