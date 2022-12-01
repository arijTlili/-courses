const Joi = require('joi');
const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Field = mongoose.model('Field', fieldSchema);

function validateField(field) {
  const schema = {
    name: Joi.string().min(5).max(50).required()
  };

  return Joi.validate(field, schema);
}

exports.fieldSchema = fieldSchema;
exports.Field = Field; 
exports.validate = validateField;