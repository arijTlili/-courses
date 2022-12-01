const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Field, validate } = require("../models/field");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const fields = await Field.find()
    .select("-__v")
    .sort("name");
  res.send(fields);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let field = new Field({ name: req.body.name });
  field = await field.save();

  res.send(field);
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const field = await Field.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true
    }
  );

  if (!field)
    return res.status(404).send("The field with the given ID was not found.");

  res.send(field);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const field = await Field.findByIdAndRemove(req.params.id);

  if (!field)
    return res.status(404).send("The field with the given ID was not found.");

  res.send(field);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const field = await Field.findById(req.params.id).select("-__v");

  if (!field)
    return res.status(404).send("The field with the given ID was not found.");

  res.send(field);
});

module.exports = router;
