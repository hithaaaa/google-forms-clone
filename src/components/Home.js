
import React, { useState, useEffect } from 'react';
import DynamicFormBuilder from './Dynamicform.js';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Search, Trash2, Eye, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const time = `${formattedHours}:${formattedMinutes} ${ampm}`
    return time;
  };

  const [orgSaturdayData, setOrgSaturdayData] = useState([]);
  const [orgSundayData, setOrgSundayData] = useState([]);

  const loadData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/form-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setFilteredForms(data.data)
      setOriginalForms(data.data);

    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const [filterValue, setFilterValue] = useState('');
  const [saturdayData, setSaturdayData] = useState(orgSaturdayData);
  const [sundayData, setSundayData] = useState(orgSundayData);
  const [currentTime, setCurrentTime] = useState('');
  const [isSaturday, setIsSaturday] = useState(false);
  const [isSunday, setIsSunday] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [isEditFormModal, setIsEditFormModal] = useState(false);
  const [formId, setFormId] = useState(-1);
  const [componentId, setComponentId] = useState(-1);
  const [userId, setUserId] = useState(-1);
  const [filteredForms, setFilteredForms] = useState([]);
  const [originalForms, setOriginalForms] = useState([]);

  function getRandom16DigitNumber() {
    return Math.floor(Math.random() * 9e15) + 1e15;
  }

  const getOrCreateDeviceId = () => {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem('device_id', deviceId);
    }
    console.log('Device ID:', deviceId);
    return deviceId;
  };

  const handleModalClick = () => {
    const id = getRandom16DigitNumber();
    setFormId(id);
    setIsModalOpen(true);
  }

  const closeModal = () => setIsModalOpen(false);
  const closeModalEdit = () => setIsEditFormModal(false);
  const closeModalPreview = () => setPreviewModal(false);

  const updateDay = () => {
    setIsSaturday(new Date().getDay() === 6);
    setIsSunday(new Date().getDay() === 0);
  }

  useEffect(() => {
    setUserId(getOrCreateDeviceId());
    loadData();
    updateDay();
    setCurrentTime(getCurrentTime());
    const timeInterval = setInterval(() => setCurrentTime(getCurrentTime()), 60000);
    const dayInterval = setInterval(updateDay, 3600000);
    return () => {
      clearInterval(timeInterval);
      clearInterval(dayInterval);
    };
  }, []);

  const handleSearchChange = (e) => {
    const input = e.target.value;
    setFilterValue(input);
    if (input !== '') {
      const filtered = filteredForms.filter(form => form.form_title && form.form_title.toLowerCase().includes(input.toLowerCase()));
      setFilteredForms(filtered);
    } else {
      console.log("empty");
      setFilteredForms(originalForms);
    }
  };

  const handleEditClick = (formid) => {
    setFormId(formid);
    setIsEditFormModal(true);
  }

  const handlePreviewClick = (index) => {
    setFormId(index);
    setPreviewModal(true);
  }

  const handleDeleteClick = async (form_id) => {
    try {
      const response = await fetch('http://localhost:5000/api/delete-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_id }),
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      setFilteredForms(data.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    setFilteredForms(filteredForms.filter(form => form.form_id !== form_id));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <h1 className="text-5xl text-center mb-4">Google Forms Clone</h1>
      <p className="text-center text-gray-500 mb-6">Current Time: {currentTime}</p>

      <div className="flex justify-center mb-6">
        <TextField
          icon={<Search className="text-gray-400" />}
          placeholder="Search by form name..."
          value={filterValue}
          onChange={handleSearchChange}
          className="w-full max-w-xl"
        />
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={handleModalClick} variant="outline" className="flex gap-2 items-center">
          <Plus className="w-5 h-5" /> Create Entry
        </Button>
      </div>

      <div className="space-y-3">
        {filteredForms.length > 0 ? filteredForms.map((form, index) => (
          <motion.div
            key={index}
            className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
            whileHover={{ scale: 1.01 }}
          >
            <div onClick={() => handleModalClick(form.form_id)} className="cursor-pointer font-semibold text-lg">
              {form.form_title || "Untitled Form"}
            </div>
            <div className="flex gap-3">
              <Button size="icon" variant="ghost" onClick={() => handleEditClick(form.form_id)}>
                <Edit2 className="w-5 h-5 text-blue-500" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handlePreviewClick(form.form_id)}>
                <Eye className="w-5 h-5 text-green-500" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleDeleteClick(form.form_id)}>
                <Trash2 className="w-5 h-5 text-red-500" />
              </Button>
            </div>
          </motion.div>
        )) : (
          <p className="text-center text-gray-400">No forms found.</p>
        )}
      </div>

      {isModalOpen && (
        <DynamicFormBuilder closeModal={closeModal} formId={formId} userId={userId} mode={"Create"} />
      )}

      {isEditFormModal && (
        <DynamicFormBuilder closeModal={closeModalEdit} formId={formId} userId={userId} mode={"Edit"} />
      )}

      {previewModal && (
        <DynamicFormBuilder closeModal={closeModalPreview} formId={formId} userId={userId} mode={"Preview"} />
      )}
    </motion.div>
  );
}
