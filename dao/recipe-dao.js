"use strict";
const fs = require("fs");
const path = require("path");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

// 1
const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "recipes.json");

class RecipeDao {
    constructor(storagePath) {
        this.recipeStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
    }

    // create
    async addRecipe(recipe) {
        const recipes = await this._loadAllRecipes();
        if (this._isDuplicate(recipes, recipe.id)) {
            const e = new Error(`Recipe with id '${recipe.id}' already exists.`);
            e.code = "DUPLICATE_CODE";
            throw e;
        }
        recipes[recipe.id] = recipe;
        try {
            await wf(this._getStorageLocation(), JSON.stringify(recipes, null, 2));
            return recipe;
        } catch (error) {
            const e = new Error(`Failed to store recipe with id '${recipe.id}' to local storage.`);
            e.code = "FAILED_TO_STORE_RECIPE";
            throw e;
        }
    }

    // get
    async getRecipe(id) {
        const recipes = await this._loadAllRecipes();
        if (recipes[id]) {
            return recipes[id];
        } else {
            const e = new Error(`Recipe with id '${id}' does not exist.`);
            e.code = "FAILED_TO_GET_RECIPE";
            throw e;
        }
    }

    // update
    async updateRecipe(recipe) {
        const recipes = await this._loadAllRecipes();
        if (recipes[recipe.id]) {
            recipes[recipe.id] = recipe;
            try {
                await wf(this._getStorageLocation(), JSON.stringify(recipes, null, 2));
                return recipe;
            } catch (error) {
                const e = new Error(`Failed to update recipe with id '${recipe.id}' in local storage.`);
                e.code = "FAILED_TO_UPDATE_RECIPE";
                throw e;
            }
        } else {
            const e = new Error(`Recipe with id '${recipe.id}' does not exist.`);
            e.code = "FAILED_TO_GET_RECIPE";
            throw e;
        }
    }

    // delete
    async deleteRecipe(id) {
        const recipes = await this._loadAllRecipes();
        delete recipes[id];
        try {
            await wf(this._getStorageLocation(), JSON.stringify(recipes, null, 2));
            return undefined;
        } catch (error) {
            const e = new Error(`Failed to delete recipe with id '${id}' in local storage.`);
            e.code = "FAILED_TO_DELETE_RECIPE";
            throw e;
        }
    }

    // list
    async listRecipes(name) {
        const recipes = await this._loadAllRecipes();
        let recipeList = [];
        for (let id in recipes) {
            if (!name || recipes[id].name.toLowerCase().includes(name.toLowerCase())) {
                recipeList.push(recipes[id]);
            }
        }
        return recipeList;
    }

    // private
    async _loadAllRecipes() {
        let recipes;
        try {
            recipes = JSON.parse(await rf(this._getStorageLocation()));
        } catch (e) {
            if (e.code === 'ENOENT') {
                console.info("No storage found, initializing new one...");
                recipes = {};
            } else {
                throw new Error("Unable to read from storage. Wrong data format. " + this._getStorageLocation());
            }
        }
        return recipes;
    }

    _isDuplicate(recipes, id) {
        return !!recipes[id];
    }

    _getStorageLocation() {
        return this.recipeStoragePath;
    }

}

module.exports = RecipeDao;