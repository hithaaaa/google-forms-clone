// routes/itemRoutes.js
const express = require('express');
const {Form, UiComponents}= require('../models/Item');
const { form } = require('@heroui/theme');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const router = express.Router();

async function createHashIndex(collection, attribute) { // This function was called once already, the indexes are created in the database
  await collection.createIndex(
    orders.createIndex( { attribute: "hashed" } )
  )
}

async function createBTreeIndex(collection, attribute) { // This function was called once already, the indexes are created in the database
  await collection.createIndex({
    attribute: 1
  },
  {
      unique: true,
      sparse: false,
      expireAfterSeconds: 3600
  })
}

// GET: Retrieve all data from MongoDB
router.post('/get-form-items', async (req, res) => {
  const { form_id } = req.body;
  try {
    
    let resultData = {};
      console.log("form_id: ", form_id)
      const formQuery = { form_id };
      
      const formDocs = await Form.find(formQuery);
      const componentDocs = await UiComponents.find(formQuery);

      if (!formDocs.length) {
        throw new Error("Form not found");
      }

      resultData = {
        form_title: formDocs[0].form_title,
        components: componentDocs
      };

    res.status(200).json({ message: 'Items retrieved successfully', ...resultData });
   

  } catch (error) {
    res.status(500).json({ message: 'Error retrieving items', error: error.message });
  } 
});

// POST: Save data to MongoDB
router.post('/add-form', async (req, res) => {
  try {
    const { form } = req.body;
    const user_id = form.user_id;
    const form_id = form.form_id;
    const form_title = form.form_title;

    const newForm = new Form({ user_id, form_id, form_title });
    await newForm.save();
    res.status(201).json({ message: 'Item added successfully', data: newForm });
  } catch (error) {
    res.status(500).json({ message: 'Error saving item', error: error.message });
  }
});

router.post('/add-uicomponents', async (req, res) => {
    try {
      const { formData } = req.body;
      const form_id = formData.form_id;
      const type = formData.type;
      const label = formData.label;
      const options = formData.options;
      const mandatory = formData.mandatory;
      const width = formData.width;
      const component_id = formData.component_id;

      const newForm = new UiComponents({ form_id, type, label, options, mandatory, width, component_id });
      await newForm.save();
      res.status(201).json({ message: 'Item added successfully', data: newForm });
    } catch (error) {
      res.status(500).json({ message: 'Error saving item', error: error.message });
    }
  });

// GET: Retrieve data with optional conditions
router.post('/form-data', async (req, res) => {
  try {
    const { form_id, user_id } = req.body;

    const query = {};
    if (form_id) query.form_id = form_id;
    if (user_id) query.user_id = user_id;
    // if (form_id) query.price = { ...query.price, $eq: parseFloat(minPrice) };
    // if (maxPrice) query.price = { ...query.price, $eq: parseFloat(maxPrice) };

    const items = await Form.find(query);
    res.status(200).json({ message: 'Items retrieved successfully', data: items });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving items', error: error.message });
  }
});

router.post('/form-components', async (req, res) => {
  try {
    const { form_id } = req.body;
    let Items = [];
    if (form_id) {
      Items = await UiComponents.find({ form_id });
    } else {
      Items = await UiComponents.find({});
    }

    res.status(200).json({ message: 'Items retrieved successfully', data: Items });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving items', error: error.message });
  }
});

router.post('/update-form-components', async (req, res) => {
  try {
    const session = await mongoose.startSession();
    
    let updatedItem;
    await session.withTransaction(async () => {
      const { newLabel, componentId } = req.body;

      updatedItem = await UiComponents.updateOne(
        { component_id: componentId },
        { $set: { label: newLabel, updatedAt: new Date() } }
      );

      if (!updatedItem || updatedItem.matchedCount === 0) {
        return res.status(404).json({ message: 'UiComponents with the specified component_id not found' });
      }
    });

    session.endSession();
    res.status(200).json({ message: 'Items updated successfully', updatedItem });

  } catch (error) {
    res.status(500).json({ message: 'Error updating items', error: error.message });
  } 
});

router.post('/delete-form', async (req, res) => {

  try {
    const { form_id } = req.body;

    // console.log("fields: ", form_id)
    const updatedItem = await Form.deleteOne(
      { form_id }
    );
    
    // console.log("Updated Item: ", updatedItem)
    if (!updatedItem) {
      return res.status(404).json({ message: 'UiComponents with the specified form_id not found' });
    }
const updatedItem2 = await UiComponents.deleteMany(
      { form_id: form_id }
    );
    res.status(200).json({ message: 'form_id deleted successfully', data: updatedItem });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting form', error: error.message });
  }
});

module.exports = router;
