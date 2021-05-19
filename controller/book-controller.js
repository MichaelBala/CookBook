const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/book/create-abl");
const GetAbl = require("../abl/book/get-abl");
const UpdateAbl = require("../abl/book/update-abl");
const DeleteAbl = require("../abl/book/delete-abl");
const ListAbl = require("../abl/book/list-abl");

router.post("/create", async (req, res) => {
    await CreateAbl(req, res)
});

router.get("/get", async (req, res) => {
    await GetAbl(req, res)
});

router.post("/update", async (req, res) => {
    await UpdateAbl(req, res)
});

router.post("/delete", async (req, res) => {
    await DeleteAbl(req, res)
});

router.get("/list", async (req, res) => {
    await ListAbl(req, res)
});

module.exports = router