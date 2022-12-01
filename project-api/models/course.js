const Joi = require('joi');
const mongoose = require('mongoose');
const {fieldSchema} = require('./field');

const Course = mongoose.model('Course', new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, 
    minlength: 5,
    maxlength: 255
  },
  field: { 
    type: fieldSchema,  
    required: true
  },
  numberOfHours: { 
    type: Number, 
    required: true,
    min: 0,
    max: 255
  },
  dailyRentalRate: { 
    type: Number, 
    required: true,
    min: 0,
    max: 255
  }
}));

function validateCourse(course) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    fieldId: Joi.objectId().required(),
    numberOfHours: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required()
  };

  return Joi.validate(course, schema);
}

exports.Course = Course; 
exports.validate = validateCourse;