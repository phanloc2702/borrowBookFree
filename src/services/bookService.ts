// src/services/bookService.ts
import axiosClient from "../utils/axiosClient";

// Lưu ý: Đã loại bỏ các interface JSON cũ (BookFormData)
// vì việc tạo và cập nhật sách hiện tại sử dụng FormData
// để hỗ trợ upload file.

const bookService = {
  // 1. Lấy danh sách sách có phân trang và tìm kiếm
  // Endpoint: GET /books/filter?page={page}&size={size}&keyword={search}
  getBooks: (page = 0, size = 10, search = "") => {
    let url = `/books/filter?page=${page}&size=${size}`;
    if (search) url += `&keyword=${encodeURIComponent(search)}`;
    return axiosClient.get(url);
  },

  // 2. Lấy thông tin sách theo ID
  // Endpoint: GET /books/{id}
  getBookById: (id: string | number) => {
    return axiosClient.get(`/books/${id}`);
  },

  // 3. Tạo sách mới (Tạo sách kèm ảnh bìa tuỳ chọn)
  // Endpoint: POST /books (multipart/form-data)
  // Backend mong đợi: BookCreationRequest (@ModelAttribute) + cover (MultipartFile)
  // Frontend đã gửi FormData chứa các trường text và coverFile.
  createBook: (data: FormData) => {
    // Khi gửi đối tượng FormData, Axios/browser tự động đặt
    // Content-Type: multipart/form-data, khớp với yêu cầu của API.
    return axiosClient.post("/books", data);
  },

  // 4. Cập nhật thông tin sách
  // Endpoint: PUT /books/{id} (multipart/form-data)
  updateBook: (id: string | number, data: FormData) => {
    // Cũng sử dụng FormData để cho phép cập nhật ảnh bìa
    return axiosClient.put(`/books/${id}`, data); 
  },

  // 5. Xóa sách
  // Endpoint: DELETE /books/{id}
  deleteBook: (id: string | number) => {
    return axiosClient.delete(`/books/${id}`);
  },
};

export default bookService;