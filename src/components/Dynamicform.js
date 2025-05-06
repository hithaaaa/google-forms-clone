
import React, { useState, useRef, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/outline';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const formFieldOptions = [
  { type: 'text', label: 'Text' },
  { type: 'textarea', label: 'Text Area' },
  { type: 'dropdown', label: 'Dropdown' },
  { type: 'multipleChoice', label: 'Multiple Choice' },
  { type: 'date', label: 'Date' },
  { type: 'time', label: 'Time' },
];

const DynamicFormBuilder = ({ closeModal, formId, userId, mode }) => {
  const [fields, setFields] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    async function fetchFormData() {
      try {
        const response = await fetch('http://localhost:5000/api/get-form-items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({  form_id: formId }),
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log(data.data)
        
        if (data.form_title) {
          setFormTitle(data.form_title);
        }
    
        if (Array.isArray(data.components)) {
          setFields(data.components);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    }
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    // Add event listener when dropdown is open
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    fetchFormData();
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  

  const addField = (type) => {
    const newField = { type, label: '', options: [], width: 'full', mandatory: false };
    setFields([...fields, newField]);
    setShowDropdown(false);
  };

  const updateField = (index, newField) => {
    const updatedFields = [...fields];
    updatedFields[index] = newField;
    setFields(updatedFields);
  };
  const handleUpdateTitle = (title) => {
    setFormTitle(title);
  };
  const deleteField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };
  
  

  const handleCreate = async () => {
    const form = {
      user_id: userId,
      form_id: formId,
      form_title: formTitle,
    }

    
    try {
      
      const response = await fetch('http://localhost:5000/api/add-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ form }),
      });


      for (const field of fields) {
        const component_id = Math.floor(Math.random() * 1000000); // Generate a random component ID
        const formData = {
          form_id: formId,
          type: field.type,
          label: field.label,
          options: field.options,
          width: field.width,
          mandatory: field.mandatory,
          component_id: component_id, // Add the component ID to the form data
        };
        console.log("saving ", formData)

        const response = await fetch('http://localhost:5000/api/add-uicomponents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ formData }),
        });

        console.log("Response: ", response);
        if (!response.ok) {
          throw new Error('Failed to create form field');
        }

        const result = await response.json();
        console.log('Form field created successfully:', result);
      }

      closeModal(); // Close the modal after successful creation
    } catch (error) {
      console.error('Error creating form fields:', error);
    }
  };
  const handleSave = async () => {
    for (const field of fields) {
      try {
        const response = await fetch('http://localhost:5000/api/update-form-components', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ form_id:field.form_id, componentId:field.component_id, newLabel: field.label }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        closeModal();
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    }
  };
    
  const renderField = (field, index) => {
    switch (field.type) {
      case 'text':
        return <input type="text" placeholder="Enter text here" className="w-full p-2 border rounded" />;
      case 'textarea':
        return <textarea placeholder="Enter text here" className="w-full p-2 border rounded" />;
      case 'dropdown':
        return (
          <select className="w-full p-2 border rounded">
            {field.options.map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'multipleChoice':
        return (
          <div className="space-y-2">
            {field.options.map((option, i) => (
              <label key={i} className="flex items-center gap-3">
                <input type="radio" name={`field-${index}`} value={option} className="w-4 h-4 rounded-full border-gray-300" />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      case 'date':
        return <input type="date" className="w-full p-2 border rounded" />;
      case 'time':
        return <input type="time" className="w-full p-2 border rounded" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="flex gap-4 w-full h-[80vh] p-4 overflow-y-auto">
        
        {/* Left Modal: Form Builder */}
        {mode !== "Preview" && (
        <div className="relative bg-white p-6 rounded-md shadow-lg w-1/2 h-full overflow-y-auto">
          <h2 className="text-2xl mb-4 text-center">Form Builder</h2>
          <input
            type="text"
            placeholder="Form title.."
            value={formTitle}
            onChange={(e) => handleUpdateTitle( e.target.value )}
            className="w-full p-2 mb-2 border rounded"
          />
          <div className="mb-4">
            <div className="relative inline-block">
              <Button
                className="p-2 bg-blue-500 text-white rounded"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                + Add Field
              </Button>
              
              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute left-0 mt-2 bg-white border rounded shadow-md w-48 z-10"
                >
                  {formFieldOptions.map((option) => (
                    <Button
                      key={option.type}
                      className="block p-2 hover:bg-gray-100 w-full text-left"
                      onClick={() => {
                        setShowDropdown(false);
                        addField(option.type);
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>

          


          {fields.map((field, index) => (
            <div key={index} className="mb-4 bg-gray-100 p-4 rounded-md shadow">
              <h3 className="text-lg font-semibold pb-3">{field.type.replace(/([A-Z])/g, ' $1')}</h3>
              <TextField
                type="text"
                placeholder="Enter heading"
                value={field.label}
                onChange={(e) => updateField(index, { ...field, label: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
              />
              {(field.type === 'dropdown' || field.type === 'multipleChoice') && (
                <textarea
                  placeholder="Options (comma separated)"
                  value={field.options.join(', ')}
                  onChange={(e) => updateField(index, { ...field, options: e.target.value.split(',') })}
                  className="w-full p-2 border rounded mb-2"
                />
              )}
              <div className="flex gap-2 items-center">
                <label>Width:</label>
                <select
                  value={field.width}
                  onChange={(e) => updateField(index, { ...field, width: e.target.value })}
                  className="p-1 border w-32"
                >
                  <option value="full">Full</option>
                  <option value="half">Half</option>
                </select>
                <label className="ml-4 flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={field.mandatory}
                    onChange={(e) => updateField(index, { ...field, mandatory: e.target.checked })}
                    className="mr-1"
                  />
                  Mandatory
                </label>
                <div className="mt-2 flex justify-end">
                    <TrashIcon
                    className="w-6 h-6 text-red-500 cursor-pointer"
                    onClick={() => deleteField(index)}
                    />
                </div>
                
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-6">
            <Button 
              className="mt-4 p-2 w-28 border-2 border-red 
        text-colabify-dark-green text-md bg-white hover:bg-colabify-light-green hover:bg-opacity-60 rounded-md"
        onClick={closeModal}
            >
                Cancel
            </Button>
            {mode === "Create" && (<Button 
              className="mt-4 p-2 w-28 border-2 border-black
        text-colabify-dark-green text-md bg-colabify-light-green hover:bg-colabify-med-green hover:bg-opacity-60 rounded-md"
              onClick={handleCreate}
            >
              Create Form
            </Button>)}
            {mode === "Edit" && (<Button 
              className="mt-4 p-2 w-28 border-2 border-black
        text-colabify-dark-green text-md bg-colabify-light-green hover:bg-colabify-med-green hover:bg-opacity-60 rounded-md"
              onClick={handleSave}
            >
              Save Form
            </Button>)}
            </div>
        </div>
        )}

        {/* Right Modal: Live Preview */}
        <div className="relative bg-white p-6 rounded-md shadow-lg w-1/2 h-full overflow-y-auto">
          <h2 className="text-2xl mb-4 text-center">Form Preview</h2>
          <h3 className="text-2xl mb-4 text-center">{formTitle}</h3>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={index} className={`mb-4 ${field.width === 'half' ? 'w-1/2' : 'w-full'}`}>
                <label className="block mb-1 font-semibold">
                  {field.label} {field.mandatory && <span className="text-red-500">*</span>}
                </label>
                {renderField(field, index)}
              </div>
            ))}
          </div>
          <Button 
              className="mt-4 p-2 w-28 border-2 border-red 
        text-colabify-dark-green text-md bg-white hover:bg-colabify-light-green hover:bg-opacity-60 rounded-md"
        onClick={closeModal}
            >
                Cancel
            </Button>
        </div>

      </div>
    </div>
  );
};

export default DynamicFormBuilder;
