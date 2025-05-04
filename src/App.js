
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CreateCompany from './components/Company Name/CreateCompany';
import PropertyManagementApp from './components/Company Name/PropertyManagement';
import ViewCompanyPage from './components/Company Name/ViewCompanyPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/view-companies" replace />} />
        <Route path="/view-companies" element={<ViewCompanyPage />} />
        <Route path="/create-company" element={<CreateCompany />} />
        <Route path="/edit-company" element={<CreateCompany />} />
      </Routes>
    </Router>
  );
}

export default App;
