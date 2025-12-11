// src/services/categoryService.ts
import axiosClient from "../utils/axiosClient";

interface CategoryFormData {
  name: string;
  description: string;
}

const categoryService = {
  // 1. Lấy tất cả danh mục (không phân trang)
  // Endpoint giả định: GET /categories
  getAllCategories: () => {
    // API này thường dùng cho dropdown/select nên không cần phân trang.
    return axiosClient.get(`/categories`);
  },
  getCategories: (page = 0, size = 10, search = "") => {
    let url = `/categories/filter?page=${page}&size=${size}`;
    if (search) url += `&keyword=${encodeURIComponent(search)}`;
    return axiosClient.get(url);
  },
  getCategoryById: (id: string | number) => {
    return axiosClient.get(`/categories/${id}`);
  },
  // 2. Tạo danh mục mới
  // Endpoint giả định: POST /categories
  createCategory: (formData: CategoryFormData) => {
    return axiosClient.post(`/categories`, formData);
  },

  // 3. Cập nhật danh mục
  // Endpoint giả định: PUT /categories/{id}
  updateCategory: (id: string, formData: CategoryFormData) => {
    return axiosClient.put(`/categories/${id}`, formData);
  },

  // 4. Xóa danh mục
  // Endpoint giả định: DELETE /categories/{id}
  deleteCategory: (id: string) => {
    return axiosClient.delete(`/categories/${id}`);
  },
};

export default categoryService;