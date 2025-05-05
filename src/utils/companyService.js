import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://property-management-backend-6gqx.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
    
});

console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);

// Add request interceptor for better error handling
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            console.error('API Error:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
            throw error.response.data;
        } else if (error.request) {
            console.error('No response received:', error.request);
            throw new Error('No response received from server');
        } else {
            console.error('Error setting up request:', error.message);
            throw new Error('Error setting up request');
        }
    }
);

export const getCompanies = async () => {
    try {
        const response = await axiosInstance.get('/api/companies');
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
};

export const getCompany = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/companies/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching company:', error);
        throw error;
    }
};

export const createCompany = async (companyData) => {
    try {
        console.log('Sending company data:', {
            company_name: companyData.company_name,
            pan_number: companyData.pan_number,
            gst_number: companyData.gst_number,
            mca_reg_details: companyData.mca_reg_details,
            address: companyData.address,
            notes: companyData.notes
        });
        
        const response = await axiosInstance.post('/api/companies', {
            company_name: companyData.company_name,
            pan_number: companyData.pan_number,
            gst_number: companyData.gst_number,
            mca_reg_details: companyData.mca_reg_details,
            address: companyData.address,
            notes: companyData.notes
        });
        
        console.log('Response status:', response.status);
        console.log('Created company:', response.data);
        return {
            company_id: response.data.company_id,
            company_name: response.data.company_name,
            pan_number: response.data.pan_number,
            gst_number: response.data.gst_number,
            mca_reg_details: response.data.mca_reg_details,
            address: response.data.address,
            notes: response.data.notes,
            created_at: response.data.created_at,
            updated_at: response.data.updated_at
        };
    } catch (error) {
        console.error('Error creating company:', error);
        throw error;
    }
};

export const updateCompany = async (id, companyData) => {
    try {
        console.log('Updating company with ID:', id);
        const response = await axiosInstance.put(`/api/companies/${id}`, {
            company_name: companyData.company_name,
            pan_number: companyData.pan_number,
            gst_number: companyData.gst_number,
            mca_reg_details: companyData.mca_reg_details,
            address: companyData.address,
            notes: companyData.notes
        });
        console.log('Update response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating company:', error);
        throw error;
    }
};

export const deleteCompany = async (id) => {
    try {
        console.log('Deleting company with ID:', id);
        const response = await axiosInstance.delete(`/api/companies/${id}`);
        console.log('Delete response:', response.data);
        return true;
    } catch (error) {
        console.error('Error deleting company:', error);
        throw error;
    }
};
