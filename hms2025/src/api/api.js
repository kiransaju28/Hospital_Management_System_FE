//Imports the axios library for making HTTP requests
import axios from 'axios';

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
});

// Request Interceptor
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");

    const publicRoutes = ["login/", "token/"];
    const isPublicRoute = publicRoutes.some((route) => config.url.includes(route));

    if (!isPublicRoute && token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Response Interceptor
apiClient.interceptors.response.use(
    (res) => res,
    async (err) => {
        if (err.response?.status === 401) {
            localStorage.clear();
            window.location.href = "/";
        }
        return Promise.reject(err);
    }
);

/* =====================================================
                AUTHENTICATION
======================================================== */

export const loginUser = (data) => apiClient.post("token/", data);

/* =====================================================
                ADMINS / DOCTORS / STAFF
======================================================== */

export const registerUser = (data) => apiClient.post("admins/register-user/", data);
export const getSpecializations = () => apiClient.get("admins/specializations/");

export const getDoctors = (params) => apiClient.get("admins/doctors/", { params });
export const getDoctorById = (id) => apiClient.get(`admins/doctors/${id}/`);
export const updateDoctor = (id, data) => apiClient.put(`admins/doctors/${id}/`, data);
export const deleteDoctor = (id) => apiClient.delete(`admins/doctors/${id}/`);

export const getStaff = (params) => apiClient.get("admins/staff/", { params });
export const getStaffById = (id) => apiClient.get(`admins/staff/${id}/`);
export const updateStaff = (id, data) => apiClient.put(`admins/staff/${id}/`, data);
export const deleteStaff = (id) => apiClient.delete(`admins/staff/${id}/`);

/* =====================================================
                RECEPTIONIST – PATIENTS
======================================================== */

export const getPatients = (params) =>
    apiClient.get("receptionist/patients/", { params });

export const createPatient = (data) =>
    apiClient.post("receptionist/patients/", data);

export const getPatientById = (id) =>
    apiClient.get(`receptionist/patients/${id}/`);

export const updatePatient = (id, data) =>
    apiClient.put(`receptionist/patients/${id}/`, data);

export const deletePatient = (id) =>
    apiClient.delete(`receptionist/patients/${id}/`);

/* =====================================================
                RECEPTIONIST – APPOINTMENTS
======================================================== */

export const getAppointments = (params) =>
    apiClient.get("receptionist/appointments/", { params });

export const createAppointment = (data) =>
    apiClient.post("receptionist/appointments/", data);

export const getAppointmentById = (id) =>
    apiClient.get(`receptionist/appointments/${id}/`);

export const updateAppointment = (id, data) => {
    return apiClient.put(`receptionist/appointments/${id}/`, data);
};

export const patchAppointment = (id, data) => {
    return apiClient.patch(`receptionist/appointments/${id}/`, data);
};

export const deleteAppointment = (id) =>
    apiClient.delete(`receptionist/appointments/${id}/`);

/* =====================================================
                DOCTOR - APPOINTMENTS
======================================================== */

export const getTodayAppointments = () =>
    apiClient.get("doctor/today-appointments/");

/* =====================================================
                DOCTOR - BASIC VITALS
======================================================== */

export const getBasicVitals = (params) =>
    apiClient.get("doctor/basic-vitals/", { params });

export const createBasicVitals = (data) =>
    apiClient.post("doctor/basic-vitals/", data);

export const getBasicVitalsById = (id) =>
    apiClient.get(`doctor/basic-vitals/${id}/`);

export const updateBasicVitals = (id, data) =>
    apiClient.put(`doctor/basic-vitals/${id}/`, data);

export const deleteBasicVitals = (id) =>
    apiClient.delete(`doctor/basic-vitals/${id}/`);

/* =====================================================
                DOCTOR - CONSULTATION
======================================================== */

export const getConsultations = (params) =>
    apiClient.get("doctor/consultations/", { params });

export const createConsultation = (data) =>
    apiClient.post("doctor/consultations/", data);

export const getConsultationById = (id) =>
    apiClient.get(`doctor/consultations/${id}/`);

export const updateConsultation = (id, data) =>
    apiClient.put(`doctor/consultations/${id}/`, data);

export const deleteConsultation = (id) =>
    apiClient.delete(`doctor/consultations/${id}/`);

/* =====================================================
                DOCTOR - PRESCRIPTION ITEMS
======================================================== */

export const getPrescriptionItems = (params) =>
    apiClient.get("doctor/prescription-items/", { params });

export const createPrescriptionItem = (data) =>
    apiClient.post("doctor/prescription-items/", data);

export const getPrescriptionItemById = (id) =>
    apiClient.get(`doctor/prescription-items/${id}/`);

export const updatePrescriptionItem = (id, data) =>
    apiClient.put(`doctor/prescription-items/${id}/`, data);

export const deletePrescriptionItem = (id) =>
    apiClient.delete(`doctor/prescription-items/${id}/`);

/* =====================================================
                DOCTOR - LAB TEST ORDERS
======================================================== */

export const getLabTestOrders = (params) =>
    apiClient.get("doctor/lab-test-orders/", { params });

export const createLabTestOrder = (data) =>
    apiClient.post("doctor/lab-test-orders/", data);

export const getLabTestOrderById = (id) =>
    apiClient.get(`doctor/lab-test-orders/${id}/`);

export const updateLabTestOrder = (id, data) =>
    apiClient.put(`doctor/lab-test-orders/${id}/`, data);

export const deleteLabTestOrder = (id) =>
    apiClient.delete(`doctor/lab-test-orders/${id}/`);

/* =====================================================
                COMMON / UTILITIES
======================================================== */

// Placeholder endpoints - backend needs to support these
export const getMedicines = () => apiClient.get("pharmacist/medicines/");
export const getAvailableLabTests = () => apiClient.get("labtech/tests/");

/* =====================================================
                LAB TECHNICIAN - TEST CATEGORIES
======================================================== */

export const getTestCategories = (params) => apiClient.get("labtech/test-categories/", { params });
export const createTestCategory = (data) => apiClient.post("labtech/test-categories/", data);
export const getTestCategoryById = (id) => apiClient.get(`labtech/test-categories/${id}/`);
export const updateTestCategory = (id, data) => apiClient.put(`labtech/test-categories/${id}/`, data);
export const deleteTestCategory = (id) => apiClient.delete(`labtech/test-categories/${id}/`);

/* =====================================================
                LAB TECHNICIAN - TEST PARAMETERS
======================================================== */

export const getTestParameters = (params) => apiClient.get("labtech/test-parameters/", { params });
export const createTestParameter = (data) => apiClient.post("labtech/test-parameters/", data);
export const getTestParameterById = (id) => apiClient.get(`labtech/test-parameters/${id}/`);
export const updateTestParameter = (id, data) => apiClient.put(`labtech/test-parameters/${id}/`, data);
export const deleteTestParameter = (id) => apiClient.delete(`labtech/test-parameters/${id}/`);

/* =====================================================
                LAB TECHNICIAN - LAB TEST ORDERS
======================================================== */

export const getLabTechTestOrders = (params) => apiClient.get("doctor/lab-test-orders/", { params });
export const getLabTechTestOrderById = (id) => apiClient.get(`doctor/lab-test-orders/${id}/`);
export const updateLabTechTestOrderStatus = (id, data) => apiClient.patch(`doctor/lab-test-orders/${id}/`, data);

/* =====================================================
                LAB TECHNICIAN - LAB REPORTS
======================================================== */

export const getLabReports = (params) => apiClient.get("labtech/lab-reports/", { params });
export const createLabReport = (data) => apiClient.post("labtech/lab-reports/", data);
export const getLabReportById = (id) => apiClient.get(`labtech/lab-reports/${id}/`);
export const updateLabReport = (id, data) => apiClient.patch(`labtech/lab-reports/${id}/`, data);

export const createLabReportResult = (data) => apiClient.post("labtech/lab-report-results/", data);
export const getLabReportResults = (params) => apiClient.get("labtech/lab-report-results/", { params });
