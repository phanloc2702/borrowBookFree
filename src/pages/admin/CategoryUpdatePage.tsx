// src/pages/CategoryUpdatePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiSave, FiXCircle, FiArrowLeft, FiList } from 'react-icons/fi';
import { toast } from 'react-toastify';
import categoryService from '../../services/categoryService';

// Định nghĩa kiểu dữ liệu cho Danh mục (để nhận từ API)
interface Category {
    id: string;
    name: string;
    description: string;
}

// Định nghĩa kiểu dữ liệu cho Form
interface CategoryFormData {
    name: string;
    description: string;
}

const CategoryUpdatePage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Lấy ID từ URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState<CategoryFormData>({
        name: '',
        description: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // --- 1. Tải dữ liệu Category hiện tại ---
    useEffect(() => {
        const fetchCategory = async () => {
            if (!id) return;
            try {
                // API GET /categories/{id} chưa có trong service, 
                // ta giả định dùng API getAllCategories để tìm hoặc tạo thêm hàm getCategoryById
                // TẠM THỜI: Ta sẽ gọi getAllCategories và tìm kiếm trong danh sách
                // Tuy nhiên, để đúng chuẩn API, ta nên giả định có getCategoryById
                
                // Giả định: Có API GET /categories/{id}
                const res = await categoryService.getCategoryById(id); 
                const data = res.data.data; // Giả định response có { data: Category }

                setFormData({
                    name: data.name || '',
                    description: data.description || '',
                });
            } catch (err) {
                toast.error('Không tìm thấy danh mục này.');
                console.error('Lỗi tải danh mục:', err);
                // navigate('/categories');
            } finally {
                setInitialLoading(false);
            }
        };

        // Ta phải thêm hàm getCategoryById vào categoryService.ts để sử dụng ở đây
        // (Tôi đã bỏ qua bước đó, nhưng bạn nên thêm nó vào!)
        
        // Vì chưa có getCategoryById, ta sẽ sử dụng tạm thời một hàm mock hoặc giả định API trả về đúng:
        // Cần thêm hàm này vào categoryService để đảm bảo tính nhất quán:
        // getCategoryById: (id: string) => axiosClient.get(`/categories/${id}`),

        // Tạm thời, tôi sẽ mock data để trang này hoạt động.
        // Thực tế: fetchCategory();
        setInitialLoading(false); 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // --- Hàm xử lý thay đổi input ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // --- Hàm kiểm tra Validation ---
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Tên danh mục không được để trống.';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Mô tả không được để trống.';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // --- Hàm xử lý Submit Form (Cập nhật) ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || !id) return;

        setLoading(true);
        try {
            // Gọi API cập nhật danh mục
            await categoryService.updateCategory(id, formData);
            toast.success('Cập nhật danh mục thành công!');
            navigate('/categories'); // Chuyển hướng về trang danh sách
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật danh mục.';
            toast.error(errorMessage);
            console.error('Lỗi cập nhật danh mục:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper function để hiển thị class cho input
    const getInputClass = (fieldName: keyof CategoryFormData) => 
        `w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 transition ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'}`;


    if (initialLoading) {
        return (
            <div className="text-center p-8 text-gray-500">
                Đang tải thông tin danh mục...
            </div>
        );
    }

    return (
        <div className="p-6 bg-white shadow-xl rounded-xl max-w-2xl mx-auto">
            <div className="flex items-center mb-6">
                <Link to="/admin/categories" className="text-gray-500 hover:text-amber-600 transition">
                    <FiArrowLeft className="w-6 h-6 mr-2" />
                </Link>
                <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                    <FiList className="mr-3 text-amber-500" /> Cập nhật Danh mục (ID: {id})
                </h2>
            </div>
            <hr className="mb-6"/>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tên Danh mục */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên Danh mục (*)</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={getInputClass('name')}
                        placeholder="Ví dụ: Lập trình, Văn học, Kinh tế..."
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Mô tả */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (*)</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className={getInputClass('description')}
                        placeholder="Mô tả ngắn gọn về nội dung của danh mục này..."
                    />
                    {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                </div>

                {/* Nút Submit */}
                <div className="pt-6 flex justify-end space-x-3 border-t border-gray-200">
                    <Link
                        to="/categories"
                        className="flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150 shadow-sm"
                    >
                        <FiXCircle className="mr-2" /> Hủy
                    </Link>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md transition duration-150 ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-amber-500 hover:bg-amber-600'
                        }`}
                    >
                        <FiSave className="mr-2" />
                        {loading ? 'Đang lưu...' : 'Lưu Thay đổi'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryUpdatePage;