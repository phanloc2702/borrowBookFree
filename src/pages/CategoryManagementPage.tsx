import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiLoader, FiX, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import categoryService from "../services/categoryService"

// Định nghĩa kiểu dữ liệu cho Danh mục
interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

// Định nghĩa kiểu dữ liệu cho Form
interface CategoryFormData {
  name: string;
  description: string;
}

const CategoryManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null); // Dùng cho Chỉnh sửa
  const [formData, setFormData] = useState<CategoryFormData>({ name: '', description: '' });
  const [errors, setErrors] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Tải dữ liệu danh mục
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
      toast.error('❌ Không thể tải danh mục.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. Xử lý Modal (Thêm / Chỉnh sửa)
  const openCreateModal = () => {
    setCurrentCategory(null);
    setFormData({ name: '', description: '' });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setCurrentCategory(category);
    setFormData({ name: category.name, description: category.description });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 3. Xử lý thay đổi form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 4. Validation
  const validate = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh mục là bắt buộc.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 5. Submit Form (Thêm hoặc Chỉnh sửa)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.warn('⚠️ Vui lòng kiểm tra lại các trường bắt buộc.');
      return;
    }

    setLoading(true);
    try {
      if (currentCategory) {
        // Chỉnh sửa
        await categoryService.updateCategory(currentCategory.id, formData);
        toast.success(`✅ Cập nhật danh mục "${formData.name}" thành công!`);
      } else {
        // Thêm mới
        await categoryService.createCategory(formData);
        toast.success(`✅ Thêm danh mục "${formData.name}" thành công!`);
      }
      closeModal();
      fetchCategories(); // Tải lại dữ liệu
    } catch (error) {
      console.error('Lỗi thao tác danh mục:', error);
      toast.error('❌ Đã xảy ra lỗi khi lưu danh mục!');
    } finally {
      setLoading(false);
    }
  };

  // 6. Xóa Danh mục
  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không? Thao tác này không thể hoàn tác!')) {
      setIsDeleting(true);
      try {
        await categoryService.deleteCategory(categoryId);
        toast.success('✅ Xóa danh mục thành công!');
        fetchCategories(); // Tải lại dữ liệu
      } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error);
        toast.error('❌ Đã xảy ra lỗi khi xóa danh mục!');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // 7. Lọc danh mục theo từ khóa tìm kiếm
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.id.includes(searchTerm)
  );

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Quản lý Danh mục
        </h1>
        <button
          onClick={openCreateModal}
          className="flex items-center px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 transition duration-150"
        >
          <FiPlus className="mr-2" /> Thêm Danh mục
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        {/* Thanh tìm kiếm */}
        <div className="mb-4 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
          />
        </div>

        {/* Bảng Danh mục */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Danh mục</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">
                    <FiLoader className="inline-block animate-spin mr-2 text-2xl text-amber-500" /> Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">
                    Không tìm thấy danh mục nào.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-amber-50/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{category.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{category.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => openEditModal(category)}
                        className="text-amber-600 hover:text-amber-900 p-1 rounded-full hover:bg-amber-100 transition"
                        title="Chỉnh sửa"
                      >
                        <FiEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition disabled:opacity-50"
                        title="Xóa"
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm/Chỉnh sửa Danh mục */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                {currentCategory ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục Mới'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition">
                <FiX className="text-2xl" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Tên Danh mục */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên Danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
                  }`}
                  placeholder="Ví dụ: Thời trang, Điện tử, Sách..."
                  required
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  placeholder="Mô tả chi tiết về danh mục này (tùy chọn)"
                />
              </div>

              {/* Nút Submit */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center px-6 py-3 text-sm font-semibold text-white rounded-lg shadow-md transition duration-150 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-600'
                  }`}
                >
                  <FiCheckCircle className="mr-2" />
                  {loading ? 'Đang lưu...' : (currentCategory ? 'Lưu Thay đổi' : 'Thêm Mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagementPage;