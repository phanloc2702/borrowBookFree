// src/services/bookService.ts
import axiosClient from "../utils/axiosClient";

// Định nghĩa các kiểu dữ liệu cơ bản
interface BookFormData {
  name: string;
  author: string;
  price: number;
  categoryId: string;
  stock: number;
  // Giả định backend sẽ xử lý upload ảnh, ở đây chỉ gửi URL
  imageUrl: string; 
}

const bookService = {
  // 1. Lấy danh sách sách có phân trang và tìm kiếm
  // Endpoint giả định: GET /books/filter?page={page}&size={size}&keyword={search}
  getBooks: (page = 0, size = 10, search = "") => {
    let url = `/books/filter?page=${page}&size=${size}`;
    if (search) url += `&keyword=${encodeURIComponent(search)}`;
    return axiosClient.get(url);
  },

  // 2. Lấy thông tin sách theo ID
  // Endpoint giả định: GET /books/{id}
  getBookById: (id: string | number) => {
    return axiosClient.get(`/books/${id}`);
  },

  // 3. Tạo sách mới
  // Endpoint giả định: POST /books
  createBook: (data: BookFormData) => {
    return axiosClient.post("/books", data);
  },

  // 4. Cập nhật thông tin sách
  // Endpoint giả định: PUT /books/{id}
  updateBook: (id: string | number, data: Partial<BookFormData>) => {
    // Sử dụng PUT hoặc PATCH tùy thuộc vào Backend. Ở đây dùng PUT.
    return axiosClient.put(`/books/${id}`, data); 
  },

  // 5. Xóa sách
  // Endpoint giả định: DELETE /books/{id}
  deleteBook: (id: string | number) => {
    return axiosClient.delete(`/books/${id}`);
  },
};

export default bookService;