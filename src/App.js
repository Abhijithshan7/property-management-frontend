
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CreateCompany from './components/Company/CreateCompany';
import ViewCompanyPage from './components/Company/ViewCompanyPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/view-companies" replace />} />
        <Route path="/view-companies" element={<ViewCompanyPage />} />
        <Route path="/create-company" element={<CreateCompany />} />
        <Route path="/edit-company/:id" element={<CreateCompany />} />
      </Routes>
    </Router>
  );
}

export default App;
