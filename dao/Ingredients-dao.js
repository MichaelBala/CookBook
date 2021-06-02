"use strict";
const fs = require("fs");
const path = require("path");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

// 1
const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "ingredients.json");

class LibraryDao {
    constructor(storagePath) {
        this.IngredientsStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
    }

    // create
    async addIngredient(ingredient) {
        const ingredients = await this._loadAllIngredients();
        if (this._isDuplicate(ingredients, ingredient.id)) {
            const e = new Error(`Ingredient with id '${ingredient.id}' already exists.`);
            e.code = "DUPLICATE_CODE";
            throw e;
        }
        ingredients[ingredient.id] = ingredient;
        try {
            await wf(this._getStorageLocation(), JSON.stringify(ingredients, null, 2));
            return ingredient;
        } catch (error) {
            const e = new Error(`Failed to store ingredient with id '${ingredient.id}' to local storage.`);
            e.code = "FAILED_TO_STORE_INGREDIENT";
            throw e;
        }
    }

    // get
    async getIngredient(id) {
        const ingredients = await this._loadAllIngredients();
        if (ingredients[id]) {
            return ingredients[id];
        } else {
            const e = new Error(`Ingredient with id '${id}' does not exist.`);
            e.code = "FAILED_TO_GET_INGREDIENT";
            throw e;
        }
    }

    // update
    async updateIngredient(ingredient) {
        const ingredients = await this._loadAllIngredients();
        if (ingredients[ingredient.id]) {
            ingredients[ingredient.id] = ingredient;
            try {
                await wf(this._getStorageLocation(), JSON.stringify(ingredients, null, 2));
                return ingredient;
            } catch (error) {
                const e = new Error(`Failed to update ingredient with id '${ingredient.id}' in local storage.`);
                e.code = "FAILED_TO_UPDATE_INGREDIENT";
                throw e;
            }
        } else {
            const e = new Error(`Ingredient with id '${ingredient.id}' does not exist.`);
            e.code = "FAILED_TO_GET_INGREDIENT";
            throw e;
        }
    }

    // approve
    async approveIngredient(ingredient) {
        const ingredients = await this._loadAllIngredients();
        if (ingredients[ingredient.id]) {
            ingredients[ingredient.id].approved = true;
            try {
                await wf(this._getStorageLocation(), JSON.stringify(ingredients, null, 2));
                return ingredients[ingredient.id];
            } catch (error) {
                const e = new Error(`Failed to approve ingredient with id '${ingredient.id}' in local storage.`);
                e.code = "FAILED_TO_APPROVE_ingredient";
                throw e;
            }
        } else {
            const e = new Error(`ingredient with id '${ingredient.id}' does not exist.`);
            e.code = "FAILED_TO_GET_ingredient";
            throw e;
        }
    }

    // delete
    async deleteIngredient(id) {
        const ingredients = await this._loadAllIngredients();
        delete ingredients[id];
        try {
            await wf(this._getStorageLocation(), JSON.stringify(ingredients, null, 2));
            return undefined;
        } catch (error) {
            const e = new Error(`Failed to delete ingredient with id '${id}' in local storage.`);
            e.code = "FAILED_TO_DELETE_ingredient";
            throw e;
        }
    }

    // list
    async listIngredients(name) {
        const ingredients = await this._loadAllIngredients();
        let ingredientList = [];
        for (let id in ingredients) {
            if (!name || ingredients[id].name.toLowerCase().includes(name.toLowerCase())) {
                ingredientList.push(ingredients[id]);
            }
        }
        return ingredientList;
    }

    // private
    async _loadAllIngredients() {
        let ingredients;
        try {
            ingredients = JSON.parse(await rf(this._getStorageLocation()));
        } catch (e) {
            if (e.code === 'ENOENT') {
                console.info("No storage found, initializing new one...");
                ingredients = {};
            } else {
                throw new Error("Unable to read from storage. Wrong data format. " + this._getStorageLocation());
            }
        }
        return ingredients;
    }

    _isDuplicate(ingredients, id) {
        return !!ingredients[id];
    }

    _getStorageLocation() {
        return this.IngredientsStoragePath;
    }

}

module.exports = LibraryDao;