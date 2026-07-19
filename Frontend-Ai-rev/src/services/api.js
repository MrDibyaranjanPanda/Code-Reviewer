import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// =========================
// AUTH
// =========================

export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

export const getProfile = () => {
  return api.get("/auth/profile");
};


// =========================
// PROJECTS
// =========================

export const getProjects = () => {
  return api.get("/projects");
};

export const createProject = (data) => {
  return api.post("/projects", data);
};

export const deleteProject = (projectId) => {
  return api.delete(`/projects/${projectId}`);
};

export const getProjectFiles = (projectId) => {
  return api.get(`/projects/${projectId}/files`);
};


// =========================
// FILE UPLOAD
// =========================

export const uploadFile = (projectId, formData) => {
  return api.post(
    `/upload/${projectId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};


// =========================
// REVIEWS
// =========================

export const getReview = (uploadedFileId) => {
  return api.get(`/review/${uploadedFileId}`);
};

export const deleteFile = (fileId) => {
  return api.delete(`/files/${fileId}`);
};

export const getDashboardStats = () => {
  return api.get("/dashboard/stats");
};

export const getReviews = () => {
  return api.get("/reviews");
};

export const downloadReviewPdf = (fileId) => {

  return api.get(
    `/review/${fileId}/pdf`,
    {
      responseType: "blob",
    }
  );

};

export default api;