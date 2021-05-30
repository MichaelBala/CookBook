"use strict";
const fs = require("fs");
const path = require("path");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

// 1
const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "recipes.json");

class BookDao {
    constructor(storagePath) {
        this.recipeStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
    }

    // create
    async addBook(book) {
        const books = await this._loadAllBooks();
        if (this._isDuplicate(books, book.id)) {
            const e = new Error(`Book with id '${book.id}' already exists.`);
            e.code = "DUPLICATE_CODE";
            throw e;
        }
        books[book.id] = book;
        try {
            await wf(this._getStorageLocation(), JSON.stringify(books, null, 2));
            return book;
        } catch (error) {
            const e = new Error(`Failed to store book with id '${book.id}' to local storage.`);
            e.code = "FAILED_TO_STORE_BOOK";
            throw e;
        }
    }

    // get
    async getBook(id) {
        const books = await this._loadAllBooks();
        if (books[id]) {
            return books[id];
        } else {
            const e = new Error(`Book with id '${id}' does not exist.`);
            e.code = "FAILED_TO_GET_BOOK";
            throw e;
        }
    }

    // update
    async updateBook(book) {
        const books = await this._loadAllBooks();
        if (books[book.id]) {
            books[book.id] = book;
            try {
                await wf(this._getStorageLocation(), JSON.stringify(books, null, 2));
                return book;
            } catch (error) {
                const e = new Error(`Failed to update book with id '${book.id}' in local storage.`);
                e.code = "FAILED_TO_UPDATE_BOOK";
                throw e;
            }
        } else {
            const e = new Error(`Book with id '${book.id}' does not exist.`);
            e.code = "FAILED_TO_GET_BOOK";
            throw e;
        }
    }

    // delete
    async deleteBook(id) {
        const books = await this._loadAllBooks();
        delete books[id];
        try {
            await wf(this._getStorageLocation(), JSON.stringify(books, null, 2));
            return undefined;
        } catch (error) {
            const e = new Error(`Failed to delete book with id '${id}' in local storage.`);
            e.code = "FAILED_TO_DELETE_BOOK";
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

module.exports = BookDao;