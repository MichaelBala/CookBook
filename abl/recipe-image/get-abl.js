const fs = require("fs");
const path = require("path");
const Ajv = require("ajv").default;
const { getRecipeImageSchema } = require("../../schemas/recipe-image-schemas");

async function GetAbl(query, res) {
    // input validation
    const ajv = new Ajv();
    const valid = ajv.validate(getRecipeImageSchema, query);

    // invalid input
    if (!valid) {
        return res.status(400).json({error: ajv.errors});
    }

    // composition of the file path
    let pathToImage = path.join(__dirname, "..", "..", "storage", query.code + ".png");

    // verifying the existence of the file
    try {
        await fs.promises.access(pathToImage, fs.F_OK);
    } catch (e) {
        res.status(400).json(
            {error: `Recipe with code '${query.code}' doesn't not have image yet.`})
    }

    //return file (in the background, the file stream from the file system is redirected to the response)
    res.sendFile(pathToImage);
}

module.exports = GetAbl;