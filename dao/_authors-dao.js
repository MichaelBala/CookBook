"use strict";
const fs = require("fs");
const path = require("path");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

// 1
const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "authors.json");

class LibraryDao {
    constructor(storagePath) {
        this.authorStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
    }

    // create
    async addAuthor(author) {
        const authors = await this._loadAllAuthors();
        if (this._isDuplicate(authors, author.id)) {
            const e = new Error(`Author with id '${author.id}' already exists.`);
            e.code = "DUPLICATE_CODE";
            throw e;
        }
        authors[author.id] = author;
        try {
            await wf(this._getStorageLocation(), JSON.stringify(authors, null, 2));
            return author;
        } catch (error) {
            const e = new Error(`Failed to store author with id '${author.id}' to local storage.`);
            e.code = "FAILED_TO_STORE_AUTHOR";
            throw e;
        }
    }

    // get
    async getAuthor(id) {
        const authors = await this._loadAllAuthors();
        if (authors[id]) {
            return authors[id];
        } else {
            const e = new Error(`Author with id '${id}' does not exist.`);
            e.code = "FAILED_TO_GET_AUTHOR";
            throw e;
        }
    }

    // update
    async updateAuthor(author) {
        const authors = await this._loadAllAuthors();
        if (authors[author.id]) {
            authors[author.id] = author;
            try {
                await wf(this._getStorageLocation(), JSON.stringify(authors, null, 2));
                return author;
            } catch (error) {
                const e = new Error(`Failed to update author with id '${author.id}' in local storage.`);
                e.code = "FAILED_TO_UPDATE_AUTHOR";
                throw e;
            }
        } else {
            const e = new Error(`Author with id '${author.id}' does not exist.`);
            e.code = "FAILED_TO_GET_AUTHOR";
            throw e;
        }
    }

    // approve
    async approveAuthor(author) {
        const authors = await this._loadAllAuthors();
        if (authors[author.id]) {
            authors[author.id].approved = true;
            try {
                await wf(this._getStorageLocation(), JSON.stringify(authors, null, 2));
                return authors[author.id];
            } catch (error) {
                const e = new Error(`Failed to approve author with id '${author.id}' in local storage.`);
                e.code = "FAILED_TO_APPROVE_AUTHOR";
                throw e;
            }
        } else {
            const e = new Error(`Author with id '${author.id}' does not exist.`);
            e.code = "FAILED_TO_GET_AUTHOR";
            throw e;
        }
    }

    // delete
    async deleteAuthor(id) {
        const authors = await this._loadAllAuthors();
        delete authors[id];
        try {
            await wf(this._getStorageLocation(), JSON.stringify(authors, null, 2));
            return undefined;
        } catch (error) {
            const e = new Error(`Failed to delete author with id '${id}' in local storage.`);
            e.code = "FAILED_TO_DELETE_AUTHOR";
            throw e;
        }
    }

    // list
    async listAuthors(name) {
        const authors = await this._loadAllAuthors();
        let authorList = [];
        for (let id in authors) {
            if (!name || authors[id].name.toLowerCase().includes(name.toLowerCase())) {
                authorList.push(authors[id]);
            }
        }
        return authorList;
    }

    // private
    async _loadAllAuthors() {
        let authors;
        try {
            authors = JSON.parse(await rf(this._getStorageLocation()));
        } catch (e) {
            if (e.code === 'ENOENT') {
                console.info("No storage found, initializing new one...");
                authors = {};
            } else {
                throw new Error("Unable to read from storage. Wrong data format. " + this._getStorageLocation());
            }
        }
        return authors;
    }

    _isDuplicate(authors, id) {
        return !!authors[id];
    }

    _getStorageLocation() {
        return this.authorStoragePath;
    }

}

module.exports = LibraryDao;