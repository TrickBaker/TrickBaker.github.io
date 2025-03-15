const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');

// Path to contacts data file
const contactsFilePath = path.join(__dirname, '../data/contacts.json');

// @route   GET api/contact
// @desc    Get contact information
// @access  Private (requires authentication)
router.get('/', auth, (req, res) => {
  try {
    // Read the contacts file
    const contactData = fs.readFileSync(contactsFilePath, 'utf8');
    const contacts = JSON.parse(contactData);
    
    res.json(contacts);
  } catch (err) {
    console.error('Error reading contact data:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/contact/public
// @desc    Get limited public contact information (no authentication required)
// @access  Public
router.get('/public', (req, res) => {
  try {
    // Read the contacts file
    const contactData = fs.readFileSync(contactsFilePath, 'utf8');
    const contacts = JSON.parse(contactData);
    
    // Only return non-sensitive information
    const publicInfo = {
      name: contacts.name,
      title: contacts.title,
      company: contacts.company,
      website: contacts.website,
      bio: contacts.bio,
      socials: contacts.socials,
      profileImage: contacts.profileImage
      // Excluded: email, phone, address, bankAccounts, taxNumber, identificationNumber
    };
    
    res.json(publicInfo);
  } catch (err) {
    console.error('Error reading contact data:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/contact
// @desc    Update contact information
// @access  Private (requires authentication)
router.put('/', auth, (req, res) => {
  try {
    // Validate required fields
    if (!req.body.name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    // Read the current contacts file
    const contactData = fs.readFileSync(contactsFilePath, 'utf8');
    const currentContacts = JSON.parse(contactData);
    
    // Create updated contact data
    const updatedContacts = {
      ...currentContacts,
      ...req.body,
      // Ensure socials object is properly updated
      socials: {
        ...currentContacts.socials,
        ...req.body.socials
      }
    };
    
    // Write the updated data back to the file
    fs.writeFileSync(
      contactsFilePath, 
      JSON.stringify(updatedContacts, null, 2),
      'utf8'
    );
    
    res.json({ message: 'Contact information updated successfully' });
  } catch (err) {
    console.error('Error updating contact data:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 