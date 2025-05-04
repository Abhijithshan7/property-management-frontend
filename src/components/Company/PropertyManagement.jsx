import React, { useState } from 'react';
import ViewCompanyPage from './ViewCompanyPage';
import CreateCompany from './CreateCompany';



const PropertyManagementApp = () => {
  const [activeTab, setActiveTab] = useState('view'); // 'view' or 'create'
  
  return (
    <div className="property-app">
      <div className="container py-4">
        <h1 className="text-center mb-4">Property Management System</h1>
        
        <div className="text-center mb-4">
          <div className="btn-group" role="group">
            <button
              type="button"
              onClick={() => setActiveTab('view')}
              className={`btn ${activeTab === 'view' ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              View Companies
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className={`btn ${activeTab === 'create' ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              Create Company
            </button>
          </div>
        </div>
        
        {activeTab === 'view' ? <ViewCompanyPage /> : <CreateCompany />}
      </div>
    </div>
  );
};

export default PropertyManagementApp;