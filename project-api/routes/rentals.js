const { Rental, validate } = require("../models/rental");
const { Course } = require("../models/course");
const { Customer } = require("../models/customer");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

Fawn.init(mongoose);

router.get("/", auth, async (req, res) => {
  const rentals = await Rental.find()
    .select("-__v")
    .sort("-dateOut");
  res.send(rentals);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const course = await Course.findById(req.body.courseId);
  if (!course) return res.status(400).send("Invalid course.");

  if (course.numberOfHours === 0)
    return res.status(400).send("Course not in stock.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    course: {
      _id: course._id,
      title: course.title,
      dailyRentalRate: course.dailyRentalRate
    }
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "courses",
        { _id: course._id },
        {
          $inc: { numberOfHours: -1 }
        }
      )
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something failed.");
  }
});

router.get("/:id", [auth], async (req, res) => {
  const rental = await Rental.findById(req.params.id).select("-__v");

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

module.exports = router;
