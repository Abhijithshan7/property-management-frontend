
// // ViewCompanyPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanies, deleteCompany } from '../../utils/companyService';

const ViewCompanyPage = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompany, setSelectedCompany] = useState(null);

    useEffect(() => {
        const loadCompanies = async () => {
            try {
                setLoading(true);
                const data = await getCompanies();
                setCompanies(data);
                setLoading(false);
            } catch (error) {
                console.error('Error loading companies:', error);
                setCompanies([]);
                setLoading(false);
                alert('Failed to load companies. Please try again.');
            }
        };
        loadCompanies();
    }, []);

    const handleEdit = (company) => {
        navigate(`/edit-company/${company.company_id}`, { state: { company } });
    };

    
    const handleView = (company) => {
        setSelectedCompany(company);
    };

    const handleDelete = async (id) => {
        if (!id) {
            console.error('No company ID provided for deletion');
            alert('Cannot delete company: ID not found');
            return;
        }

        if (window.confirm('Are you sure you want to delete this company?')) {
            try {
                await deleteCompany(id);
                const updatedCompanies = await getCompanies();
                setCompanies(updatedCompanies);
            } catch (error) {
                console.error('Error deleting company:', error);
                alert(`Failed to delete company: ${error.message}`);
            }
        }
    };

    const handleCreate = () => {
        navigate('/create-company');
    };

    const filteredCompanies = companies.filter(company =>
        company.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.pan_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.gst_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
    <div className="container mt-4">
      {selectedCompany ? (
        <CompanyDetail company={selectedCompany} onClose={() => setSelectedCompany(null)} />
      ) : (
        <div className="card shadow">
          <div className="card-header bg-white py-3">
            <div className="row align-items-center">
              <div className="col-md-6 mb-3 mb-md-0">
                <h2 className="h4 mb-0 text-primary">Companies</h2>
              </div>
              <div className="col-md-6">
                <div className="row g-2">
                  <div className="col">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button"
                          onClick={() => setSearchTerm('')}
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="col-auto">
                    <button 
                      onClick={handleCreate}
                      className="btn btn-primary"
                    >
                      <i className="bi bi-plus-circle me-1"></i>
                      Create Company
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                {filteredCompanies.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      No companies found matching "{searchTerm}". Try creating a new company or clearing the search.
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>PAN</th>
                          <th>GST</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCompanies.map(company => (
                          <tr key={company.id || company.company_id}>
                            <td className="fw-medium">{company.company_name}</td>
                            <td>{company.pan_number}</td>
                            <td>{company.gst_number || '-'}</td>
                            <td>
                              <span className="badge bg-secondary">
                                Active
                              </span>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button
                                  onClick={() => handleView(company)}
                                  className="btn btn-outline-primary"
                                  title="View details"
                                >
                                  <i className="bi bi-eye"></i>
                                </button>
                                <button 
                                  onClick={() => handleEdit(company)}
                                  className="btn btn-outline-secondary"
                                  title="Edit company"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                              </div>
                            </td>
                            <td>
                              <button 
                                onClick={() => handleDelete(company.id || company.company_id)}
                                className="btn btn-outline-danger btn-sm"
                                title="Delete company"
                                disabled={!company.id && !company.company_id}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// CompanyDetail Component
const CompanyDetail = ({ company, onClose }) => {
  return (
    <div className="card shadow">
      <div className="card-header bg-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="h4 mb-0 text-primary">Company Details</h2>
          <button 
            onClick={onClose}
            className="btn btn-icon btn-sm btn-light"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
      
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label text-muted">Company Name</label>
              <div className="fw-medium fs-5">{company?.company_name || 'Not provided'}</div>
            </div>
            
            <div className="mb-3">
              <label className="form-label text-muted">PAN Number</label>
              <div>{company?.pan_number || 'Not provided'}</div>
            </div>
            
            <div className="mb-3">
              <label className="form-label text-muted">GST Number</label>
              <div>{company?.gst_number || 'Not provided'}</div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label text-muted">MCA Registration</label>
              <div>{company?.mca_reg_details || 'Not provided'}</div>
            </div>
            
            <div className="mb-3">
              <label className="form-label text-muted">Status</label>
              <div>
                <span className={`badge ${
                  company.status === 'active' 
                    ? 'bg-success' 
                    : 'bg-secondary'
                }`}>
                  {company?.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <div className="mb-3">
              <label className="form-label text-muted">Address</label>
              <div>{company?.address || 'Not provided'}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-top">
          <h5>Documents</h5>
          <div className="text-center py-4 bg-light rounded mt-3">
            <i className="bi bi-file-earmark-text fs-4 text-muted mb-2 d-block opacity-50"></i>
            <p className="text-muted">No documents available</p>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-top d-flex justify-content-end">
          <button
            onClick={() => console.log('Edit company', company.id)}
            className="btn btn-outline-secondary me-2"
          >
            Edit Details
          </button>
          <button
            onClick={onClose}
            className="btn btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCompanyPage;
