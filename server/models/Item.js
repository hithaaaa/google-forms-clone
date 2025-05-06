// models/Item.js
const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    form_id: { type: String },
    form_title: { type: String },
  }, { timestamps: true });

const uiComponentsSchema = new mongoose.Schema({
form_id: { type: String, required: true },
component_id: { type: String },
type: { type: String },
label: { type: String },
options: { type: Object },
mandatory: { type: Boolean },
width: { type: String },
}, { timestamps: true });

const Form = mongoose.model('Form', formSchema);
const UiComponents = mongoose.model('UIComponents', uiComponentsSchema);
module.exports = { Form, UiComponents };
