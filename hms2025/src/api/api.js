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

export const deleteAppointment = (id) =>
    apiClient.delete(`receptionist/appointments/${id}/`);
