const path = require("path");
const LibraryDao = require("../../dao/recipe-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))
const AuthorsDao = require("../../dao/ingredients-dao");
let AuthorsDao = new AuthorsDao(path.join(__dirname, "..", "..", "storage", "ingredients.json"))

async function CreateAbl(req, res) {
    let {id, name, authorList} = req.body;
    if (
        name && typeof name === "string" && name.length < 200 &&
        authorList && authorList.length > 0 && authorList.length < 10 &&
        id && typeof id === "string" && id.length < 25
    ) {
        for (let i = 0; i< authorList.length; i++) {
            try {
                await authorsDao.getAuthor(authorList[i])
            } catch (e) {
                if (e.code === "FAILED_TO_GET_AUTHOR") {
                    res.status(400).json({error: e})
                } else {
                    res.status(500).json({error: e})
                }
            }
        }
        const book = {id, name, authorList};
        try {
            let result = await dao.addBook(book);
            res.status(200).json(result);
        } catch (e) {
            if (e.code === "DUPLICATE_CODE") {
                res.status(400).json({error: e})
            } else if (e.code === "FAILED_TO_STORE_BOOK") {
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