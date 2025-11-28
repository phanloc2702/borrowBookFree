import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiFilter,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiBookOpen
} from "react-icons/fi";
import bookService from "../services/bookService";
import { toast } from 'react-toastify';

// Định nghĩa kiểu dữ liệu Sách ĐẦY ĐỦ
interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  categoryName: string;
  quantity: number;
  available_quantity: number;
  publication_year: number;
  coverUrl: string; // Thêm trường Ảnh
}

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // --- Hàm gọi API Tải Sách ---
  const fetchBooks = async (pageNumber = 0, search = "") => {
    try {
      setLoading(true);
      const res = await bookService.getBooks(pageNumber, size, search);
      // Giả định cấu trúc response là { data: { content: Book[], totalPages: number } }
      const data = (res.data as { data: { content: Book[]; totalPages: number } }).data; 
      
      setBooks(data.content || []);
      setTotalPages(data.totalPages || 1);
      setPage(pageNumber);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách sách!");
      console.error("Fetch Books Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Hàm xử lý Phân trang ---
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchBooks(newPage, searchTerm);
    }
  };

  // --- Hàm xử lý Tìm kiếm ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks(0, searchTerm);
  };
  
  // --- Hàm xử lý Xóa Sách ---
  const handleDelete = async (id: number) => {
      if (!window.confirm("Bạn có chắc chắn muốn xóa sách này không?")) {
          return;
      }
      try {
          await bookService.deleteBook(id);
          toast.success("Xóa sách thành công!");
          // Tải lại trang hiện tại sau khi xóa
          fetchBooks(page, searchTerm); 
      } catch (error) {
          toast.error("Lỗi khi xóa sách!");
          console.error("Delete Book Error:", error);
      }
  };


  // --- useEffect Tải dữ liệu lần đầu ---
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <FiBookOpen className="mr-3 text-amber-500" /> Quản lý Sách
      </h2>

      {/* --- Thanh tìm kiếm & Thêm mới --- */}
      <div className="flex justify-between items-center mb-6">
        <form onSubmit={handleSearch} className="flex items-center space-x-3">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Tìm kiếm theo Tiêu đề, Tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition pl-10"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            type="submit"
            className="px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition duration-150 font-medium"
          >
            Tìm
          </button>
        </form>

        <div className="flex items-center space-x-3">
          {/* Nút lọc (tùy chọn) */}
          <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 font-medium flex items-center">
            <FiFilter className="mr-2" /> Lọc
            <FiChevronDown className="ml-2" />
          </button>

          {/* Nút Thêm mới (dùng link đến trang quản lý sách đã đổi tên) */}
          <Link
            to="/books/create" 
            className="flex items-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150 font-medium"
          >
            <FiPlus className="mr-2" /> Thêm Mới
          </Link>
        </div>
      </div>

      {/* --- Bảng Danh sách Sách --- */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              {/* Thêm cột ảnh */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ảnh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiêu đề
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tác giả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                SL Tồn (SL Khả dụng)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : books.length > 0 ? (
              books.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {book.id}
                  </td>
                  {/* Hiển thị ảnh */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <img
                      src={ `http://localhost:8080/${book.coverUrl}`}
                      alt={book.title}
                      className="w-10 h-15 object-cover rounded shadow"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {book.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {book.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600 font-medium">
                    {book.categoryName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                    {book.quantity} ({book.available_quantity})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/books/edit/${book.id}`}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50 transition"
                      >
                        <FiEdit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500 italic">
                  Không tìm thấy sách nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Footer / Phân trang --- */}
      <div className="p-4 flex justify-between items-center bg-slate-50 border-t border-gray-200 text-sm text-gray-600">
        <span>
          Trang {page + 1} / {totalPages}
        </span>
        <div className="flex space-x-1">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="flex items-center px-3 py-1 border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            <FiChevronLeft className="mr-1" /> Trước
          </button>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="flex items-center px-3 py-1 border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Sau <FiChevronRight className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BooksPage;