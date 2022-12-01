const { Course, validate } = require("../models/course");
const { Field } = require("../models/field");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const courses = await Course.find()
    .select("-__v")
    .sort("name");
  res.send(courses);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const field = await Field .findById(req.body.fieldId);
  if (!field) return res.status(400).send("Invalid field.");

  const course = new Course({
    title: req.body.title,
    field: {
      _id: field._id,
      name: field.name
    },
    numberOfHours: req.body.numberOfHours,
    dailyRentalRate: req.body.dailyRentalRate,
    publishDate: moment().toJSON()
  });
  await course.save();

  res.send(course);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const field = await Field .findById(req.body.fieldId);
  if (!field) return res.status(400).send("Invalid field.");

  const course = await Course.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      field: {
        _id: field._id,
        name: field.name
      },
      numberOfHours: req.body.numberOfHours,
      dailyRentalRate: req.body.dailyRentalRate
    },
    { new: true }
  );

  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  res.send(course);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const course = await Course.findByIdAndRemove(req.params.id);

  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  res.send(course);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const course = await Course.findById(req.params.id).select("-__v");

  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  res.send(course);
});

module.exports = router;
