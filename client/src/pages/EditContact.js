import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, FaBriefcase, FaBuilding, FaEnvelope, FaPhone, 
  FaGlobe, FaMapMarkerAlt, FaLinkedin, FaTwitter, FaGithub, 
  FaInstagram, FaSave, FaTimes, FaUniversity, FaCreditCard,
  FaIdCard, FaFileInvoiceDollar
} from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/EditContact.css';

const EditContact = () => {
  const { isAuthenticated, loading: authLoading, getContactData, demoMode } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    bio: '',
    taxNumber: '',
    identificationNumber: '',
    socials: {
      linkedin: '',
      twitter: '',
      github: '',
      instagram: ''
    },
    bankAccounts: [
      {
        bankName: '',
        accountNumber: '',
        accountType: 'Checking',
        routingNumber: '',
        swift: ''
      }
    ],
    profileImage: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  // Fetch contact data
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        let contactData;
        
        if (demoMode) {
          // Use demo data in GitHub Pages deployment
          contactData = await getContactData();
        } else {
          // Use API in production
          const res = await axios.get('/api/contact');
          contactData = res.data;
        }
        
        // Initialize bank accounts if they don't exist
        if (!contactData.bankAccounts) {
          contactData.bankAccounts = [
            {
              bankName: '',
              accountNumber: '',
              accountType: 'Checking',
              routingNumber: '',
              swift: ''
            }
          ];
        }
        
        // Initialize tax and identification numbers if they don't exist
        if (!contactData.taxNumber) {
          contactData.taxNumber = '';
        }
        
        if (!contactData.identificationNumber) {
          contactData.identificationNumber = '';
        }
        
        setFormData(contactData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contact data:', err);
        setError('Failed to load contact information');
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchContactData();
    }
  }, [isAuthenticated, getContactData, demoMode]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('socials.')) {
      const socialField = name.split('.')[1];
      setFormData({
        ...formData,
        socials: {
          ...formData.socials,
          [socialField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle bank account field changes
  const handleBankAccountChange = (index, field, value) => {
    const updatedBankAccounts = [...formData.bankAccounts];
    updatedBankAccounts[index] = {
      ...updatedBankAccounts[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      bankAccounts: updatedBankAccounts
    });
  };
  
  // Add new bank account
  const addBankAccount = () => {
    setFormData({
      ...formData,
      bankAccounts: [
        ...formData.bankAccounts,
        {
          bankName: '',
          accountNumber: '',
          accountType: 'Checking',
          routingNumber: '',
          swift: ''
        }
      ]
    });
  };
  
  // Remove bank account
  const removeBankAccount = (index) => {
    const updatedBankAccounts = [...formData.bankAccounts];
    updatedBankAccounts.splice(index, 1);
    
    setFormData({
      ...formData,
      bankAccounts: updatedBankAccounts
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      if (demoMode) {
        // In demo mode, just simulate a successful save
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        setSuccess(true);
      } else {
        // In production, save to the server
        await axios.put('/api/contact', formData);
        setSuccess(true);
      }
      setSaving(false);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error updating contact data:', err);
      setError('Failed to update contact information');
      setSaving(false);
      
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  if (loading || authLoading) {
    return (
      <Container className="text-center py-5">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading...</p>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="edit-contact-container py-4">
      <Card className="edit-card">
        <Card.Header className="text-center">
          <h2><FaUser className="me-2" /> Edit Contact Information</h2>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" className="mb-4">
              Contact information updated successfully!
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <h4 className="section-title">Basic Information</h4>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaUser className="me-2" /> Full Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaBriefcase className="me-2" /> Job Title
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaBuilding className="me-2" /> Company
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaGlobe className="me-2" /> Website
                  </Form.Label>
                  <Form.Control
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <h4 className="section-title">Contact Details</h4>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaEnvelope className="me-2" /> Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaPhone className="me-2" /> Phone Number
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-4">
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaMapMarkerAlt className="me-2" /> Address
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <h4 className="section-title">Identification & Tax Information</h4>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaIdCard className="me-2" /> Identification Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="identificationNumber"
                    value={formData.identificationNumber}
                    onChange={handleChange}
                    placeholder="SSN, National ID, Passport, etc."
                  />
                  <Form.Text className="text-muted">
                    Personal identification number (SSN, National ID, etc.)
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaFileInvoiceDollar className="me-2" /> Tax Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="taxNumber"
                    value={formData.taxNumber}
                    onChange={handleChange}
                    placeholder="Tax ID, VAT Number, etc."
                  />
                  <Form.Text className="text-muted">
                    Tax identification number for business purposes
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <h4 className="section-title">Social Media</h4>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaLinkedin className="me-2" /> LinkedIn
                  </Form.Label>
                  <Form.Control
                    type="url"
                    name="socials.linkedin"
                    value={formData.socials.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaTwitter className="me-2" /> Twitter
                  </Form.Label>
                  <Form.Control
                    type="url"
                    name="socials.twitter"
                    value={formData.socials.twitter}
                    onChange={handleChange}
                    placeholder="https://twitter.com/username"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaGithub className="me-2" /> GitHub
                  </Form.Label>
                  <Form.Control
                    type="url"
                    name="socials.github"
                    value={formData.socials.github}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaInstagram className="me-2" /> Instagram
                  </Form.Label>
                  <Form.Control
                    type="url"
                    name="socials.instagram"
                    value={formData.socials.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/username"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <h4 className="section-title">
              Bank Account Information
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="ms-2"
                onClick={addBankAccount}
              >
                Add Account
              </Button>
            </h4>
            
            {formData.bankAccounts.map((account, index) => (
              <div key={index} className="bank-account-section mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Account #{index + 1}</h5>
                  {formData.bankAccounts.length > 1 && (
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => removeBankAccount(index)}
                    >
                      <FaTimes /> Remove
                    </Button>
                  )}
                </div>
                
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        <FaUniversity className="me-2" /> Bank Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={account.bankName}
                        onChange={(e) => handleBankAccountChange(index, 'bankName', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        <FaCreditCard className="me-2" /> Account Number
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={account.accountNumber}
                        onChange={(e) => handleBankAccountChange(index, 'accountNumber', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Account Type</Form.Label>
                      <Form.Select
                        value={account.accountType}
                        onChange={(e) => handleBankAccountChange(index, 'accountType', e.target.value)}
                      >
                        <option value="Checking">Checking</option>
                        <option value="Savings">Savings</option>
                        <option value="Business">Business</option>
                        <option value="Investment">Investment</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Routing Number</Form.Label>
                      <Form.Control
                        type="text"
                        value={account.routingNumber}
                        onChange={(e) => handleBankAccountChange(index, 'routingNumber', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>SWIFT/BIC Code</Form.Label>
                      <Form.Control
                        type="text"
                        value={account.swift}
                        onChange={(e) => handleBankAccountChange(index, 'swift', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ))}
            
            <h4 className="section-title">About Me</h4>
            <Row className="mb-4">
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Bio / About Me</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell people about yourself..."
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-grid gap-2 mt-4">
              <Button 
                variant="primary" 
                type="submit" 
                size="lg"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditContact; 