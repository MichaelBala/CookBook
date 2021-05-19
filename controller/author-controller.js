const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/author/create-abl");
const GetAbl = require("../abl/author/get-abl");
const UpdateAbl = require("../abl/author/update-abl");
const ApproveAbl = require("../abl/author/approve-abl");
const DeleteAbl = require("../abl/author/delete-abl");
const ListAbl = require("../abl/author/list-abl");

router.post("/create", async (req, res) => {
    await CreateAbl(req, res)
});

router.get("/get", async (req, res) => {
    await GetAbl(req, res)
});

router.post("/update", async (req, res) => {
    await UpdateAbl(req, res)
});

router.post("/approve", async (req, res) => {
    await ApproveAbl(req, res)
});

router.post("/delete", async (req, res) => {
    await DeleteAbl(req, res)
});

router.get("/list", async (req, res) => {
    await ListAbl(req, res)
});

module.exports = router