
// CreateCompany.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { createCompany, updateCompany } from '../../utils/companyService';

const CreateCompany = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {id} = useParams()

    const isEditMode = id ? true : false;
    const initialCompany = location.state?.company || {
        company_name: '',
        pan_number: '',
        gst_number: '',
        mca_reg_details: '',
        address: '',
        notes: ''
    };
  const [company, setCompany] = useState(initialCompany);
  const [documents, setDocuments] = useState([{ name: '', file: null }]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const fieldName = {
      companyName: 'company_name',
      panNumber: 'pan_number',
      mcaNumber: 'mca_reg_details',
      gstNumber: 'gst_number',
      description: 'notes',
      address: 'address'
    }[name] || name;

    setCompany(prev => ({
      ...prev,
      [fieldName]: value
    }));
    // Clear error when field is edited
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleDocChange = (index, field, value) => {
    const updated = [...documents];
    updated[index] = { ...updated[index], [field]: value };
    setDocuments(updated);
  };

  const addDocument = () => {
    if (documents.length < 10) {
      setDocuments([...documents, { name: '', file: null }]);
    }
  };

  const removeDocument = (index) => {
    if (documents.length > 1) {
      const updated = [...documents];
      updated.splice(index, 1);
      setDocuments(updated);
    }
  };

  const validateForm = () => {
    const newErrors = {
      company_name: company.company_name.trim() ? null : "Company name is required",
      pan_number: company.pan_number ? null : "PAN number is required",
      mca_reg_details: company.mca_reg_details ? null : "MCA number is required",
      address: company.address.trim() ? null : "Address is required",
      documents: null
    };

    // Document validation
    const filledDocs = documents.filter(doc => doc.name.trim() || doc.file);
    if (filledDocs.some(doc => !doc.name.trim() || !doc.file)) {
      newErrors.documents = "All added documents must have both name and file";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      console.log('Form data being submitted:', {
        company_name: company.company_name,
        pan_number: company.pan_number,
        gst_number: company.gst_number,
        mca_reg_details: company.mca_reg_details,
        address: company.address,
        notes: company.notes
      });

      if (isEditMode) {
        const updatedCompany = await updateCompany(id, company);
        setCompany({
          company_id: updatedCompany.company_id,
          company_name: updatedCompany.company_name,
          pan_number: updatedCompany.pan_number,
          gst_number: updatedCompany.gst_number,
          mca_reg_details: updatedCompany.mca_reg_details,
          address: updatedCompany.address,
          notes: updatedCompany.notes,
          created_at: updatedCompany.created_at,
          updated_at: updatedCompany.updated_at
        });
      } else {
        const newCompany = await createCompany(company);
        setCompany({
          company_id: newCompany.company_id,
          company_name: newCompany.company_name,
          pan_number: newCompany.pan_number,
          gst_number: newCompany.gst_number,
          mca_reg_details: newCompany.mca_reg_details,
          address: newCompany.address,
          notes: newCompany.notes,
          created_at: newCompany.created_at,
          updated_at: newCompany.updated_at
        });
      }

      setSubmitSuccess(true);
      // Show success message
      alert('Company saved successfully!');
      // Navigate back to view page after successful submission
      navigate('/view-companies');
    } catch (error) {
      console.error('Error saving company:', error);
      alert(`Failed to save company. ${error.message}`);
      setIsSubmitting(false);
      setSubmitSuccess(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-white py-3">
          <div className="d-flex align-items-center">
            <h2 className="h4 mb-0 text-primary">{isEditMode ? 'Edit Company' : 'Create Company'}</h2>
            {submitSuccess && (
              <div className="ms-3 alert alert-success py-1 px-3 mb-0 d-inline-flex align-items-center">
                <i className="bi bi-check-circle me-2"></i>
                Company created successfully!
              </div>
            )}
          </div>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button 
              onClick={() => navigate('/view-companies')}
              className="btn btn-outline-secondary"
            >
              <i className="bi bi-arrow-left me-1"></i>
              Back
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="row mb-4">
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="form-group">
                  <label className="form-label">Company Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="company_name"
                    value={company.company_name || ''}
                    onChange={handleChange}
                    className={`form-control ${errors.company_name ? 'is-invalid' : ''}`}
                    placeholder="Enter company name"
                  />
                  {errors.company_name && <div className="invalid-feedback">{errors.company_name}</div>}
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">PAN Number <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="pan_number"
                    value={company.pan_number || ''}
                    onChange={handleChange}
                    className={`form-control ${errors.pan_number ? 'is-invalid' : ''}`}
                    placeholder="ABCDE1234F"
                  />
                  {errors.pan_number && <div className="invalid-feedback">{errors.pan_number}</div>}
                </div>
              </div>
            </div>
            
            <div className="row mb-4">
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="form-group">
                  <label className="form-label">GST Number</label>
                  <input
                    type="text"
                    name="gst_number"
                    value={company.gst_number || ''}
                    onChange={handleChange}
                    className={`form-control ${errors.gst_number ? 'is-invalid' : ''}`}
                    placeholder="22AAAAA0000A1Z5"
                  />
                  {errors.gst_number && <div className="invalid-feedback">{errors.gst_number}</div>}
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">MCA Registration <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="mca_reg_details"
                    value={company.mca_reg_details || ''}
                    onChange={handleChange}
                    className={`form-control ${errors.mca_reg_details ? 'is-invalid' : ''}`}
                    placeholder="MCA123456789"
                  />
                  {errors.mca_reg_details && <div className="invalid-feedback">{errors.mca_reg_details}</div>}
                </div>
              </div>
            </div>
            
            <div className="row mb-4">
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="form-group">
                  <label className="form-label">Address <span className="text-danger">*</span></label>
                  <textarea
                    name="address"
                    value={company.address}
                    onChange={handleChange}
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    rows="3"
                    placeholder="Enter company address"
                  />
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={company.notes || ''}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                    placeholder="Additional notes about the company"
                  />
                </div>
              </div>
            </div>
            
            <div className="document-section mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  Document Upload 
                  <small className="text-muted ms-2">(Max 10)</small>
                </h5>
                <button 
                  type="button" 
                  onClick={addDocument}
                  disabled={documents.length >= 10}
                  className="btn btn-sm btn-outline-primary"
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  Add Document
                </button>
              </div>
              
              {errors.documents && (
                <div className="alert alert-danger py-2">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {errors.documents}
                </div>
              )}
              
              {documents.map((doc, i) => (
                <div key={i} className="card bg-light mb-3">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <div className="form-group">
                          <label className="form-label">Document Name</label>
                          <input
                            type="text"
                            value={doc.name}
                            onChange={(e) => handleDocChange(i, 'name', e.target.value)}
                            className="form-control"
                            placeholder="Invoice, Agreement, etc."
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Upload File</label>
                          <div className="input-group">
                            <input
                              type="file"
                              className="form-control"
                              onChange={(e) => handleDocChange(i, 'file', e.target.files[0])}
                            />
                            {documents.length > 1 && (
                              <button 
                                type="button" 
                                onClick={() => removeDocument(i)}
                                className="btn btn-outline-danger"
                                title="Remove document"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
                          </div>
                          {doc.file && (
                            <div className="mt-1 text-muted small">
                              <i className="bi bi-file-earmark me-1"></i>
                              {doc.file.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1"></span>
                    Saving...
                  </>
                ) : (
                  'Save Company'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCompany;