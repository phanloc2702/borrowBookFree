import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiList, 
  FiSearch, 
  FiChevronLeft, 
  FiChevronRight 
} from "react-icons/fi";
import { toast } from "react-toastify";
import categoryService from "../services/categoryService"; 

// Định nghĩa kiểu dữ liệu cho Danh mục
interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string; 
}

// Định nghĩa kiểu dữ liệu cho Response có phân trang
interface CategoryPaginationResponse {
    data: {
        content: Category[];
        totalPages: number;
    }
}

const CategoriesPage: React.FC = () => {
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // --- Hàm gọi API tải danh sách danh mục CÓ PHÂN TRANG ---
  const fetchCategories = async (pageNumber = 0, search = searchTerm) => {
    try {
      setLoading(true);
      // Gọi API getCategories mới
      const res = await categoryService.getCategories(pageNumber, size, search);
      
      // Giả định cấu trúc response tương tự như User/Book
      const data = (res.data as CategoryPaginationResponse).data;

      setCategories(data.content || []);
      setTotalPages(data.totalPages || 1);
      setPage(pageNumber); // Cập nhật lại page state

    } catch (error) {
      toast.error("Lỗi khi tải danh sách danh mục.");
      console.error("Fetch Categories Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Xử lý thay đổi trang ---
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchCategories(newPage, searchTerm);
    }
  };

  // --- Xử lý tìm kiếm ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0); // Reset về trang 0 khi tìm kiếm
    fetchCategories(0, searchTerm);
  };
  
  // --- Tải dữ liệu lần đầu và khi page thay đổi ---
  useEffect(() => {
    fetchCategories(page, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ gọi 1 lần khi mount

  // --- Xử lý Xóa Danh mục ---
  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}" không?`)) {
      try {
        await categoryService.deleteCategory(id); 
        toast.success(`Xóa danh mục "${name}" thành công!`);
        // Tải lại dữ liệu của trang hiện tại sau khi xóa
        fetchCategories(page, searchTerm); 
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        toast.error("Không thể xóa danh mục này!");
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <FiList className="mr-3 text-amber-500" /> Quản lý Danh mục
      </h2>

      {/* --- Thanh công cụ / Tìm kiếm & Thêm mới --- */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        
        {/* Tìm kiếm */}
        <form onSubmit={handleSearch} className="flex flex-1 max-w-sm">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tìm kiếm theo Tên danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-amber-500 transition"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            type="submit"
            className="ml-2 px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition duration-150 font-medium shadow-md"
          >
            Tìm
          </button>
        </form>
        
        {/* Thêm mới */}
        <Link
          to="/categories/create" 
          className="flex items-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150 font-medium shadow-md"
        >
          <FiPlus className="mr-2" /> Thêm Danh mục mới
        </Link>
      </div>

      {/* --- Bảng Danh sách Danh mục --- */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["ID", "Tên Danh mục", "Mô tả", "Ngày tạo", "Thao tác"].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-600">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {category.description.substring(0, 50)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/categories/edit/${category.id}`} 
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50 transition"
                        title="Sửa danh mục"
                      >
                        <FiEdit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition"
                        title="Xóa danh mục"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                  Không tìm thấy danh mục nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* --- Footer / Phân trang --- */}
      <div className="p-4 flex justify-between items-center bg-slate-50 border-t border-gray-200 text-sm text-gray-600 rounded-b-xl">
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

export default CategoriesPage;