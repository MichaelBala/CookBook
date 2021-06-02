"use strict";

const getRecipeImageSchema = {
    "type": "object",
    "properties": {
        "code": { "type": "string"},
    },
    "required": ["code"]
};

const createRecipeImageSchema = {
    "type": "object",
    "properties": {
        "code": { "type": "string"},
    },
    "required": ["code"]
};

module.exports = {
    createRecipeImageSchema,
    getRecipeImageSchema,
};