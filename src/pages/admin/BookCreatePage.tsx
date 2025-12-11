// src/pages/BookCreatePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSave, FiXCircle, FiArrowLeft, FiImage, FiBookOpen } from 'react-icons/fi';
import { toast } from 'react-toastify';
import bookService from '../../services/bookService'; 
import categoryService from '../../services/categoryService'; 

// Định nghĩa kiểu dữ liệu cho Form
interface BookFormData {
    name: string; // Tương ứng với title trong Entity
    author: string;
    isbn: string; // Thêm ISBN
    description: string; // Thêm Description
    categoryId: string;
    quantity: number | string; // Thay thế 'stock'
    publicationYear: number | string; // Thay thế 'price'
    // Không cần imageUrl ở đây vì dùng file
}

// Định nghĩa kiểu dữ liệu cho Danh mục (tối giản)
interface Category {
    id: string;
    name: string;
}

const BookCreatePage: React.FC = () => {
    const navigate = useNavigate();
    
    // State
    const [categories, setCategories] = useState<Category[]>([]);
    const [coverFile, setCoverFile] = useState<File | null>(null); // State cho File
    const [previewUrl, setPreviewUrl] = useState<string>(''); // State để xem trước ảnh
    
    const [formData, setFormData] = useState<BookFormData>({ 
        name: '', 
        author: '', 
        isbn: '', // Khởi tạo ISBN
        description: '', // Khởi tạo Description
        quantity: '', 
        publicationYear: '', 
        categoryId: '', 
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // --- 1. Tải danh mục (Category) ---
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.getAllCategories(); 
                const loadedCategories: Category[] = res.data.data || res.data;
                setCategories(loadedCategories || []);
                
                if (loadedCategories.length > 0 && !formData.categoryId) {
                     setFormData(prev => ({ 
                        ...prev, 
                        categoryId: loadedCategories[0].id 
                    }));
                }
            } catch (error) {
                toast.error("Lỗi khi tải danh mục.");
                console.error("Fetch Categories Error:", error);
            }
        };
        fetchCategories();
    }, []);

    // --- 2. Xử lý thay đổi Input ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
    // Xử lý thay đổi File
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setCoverFile(file);
        
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl('');
        }
    };


    // --- 3. Validation cơ bản ---
    const validate = (): boolean => {
        let newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = "Tên sách (Title) không được để trống.";
        if (!formData.author.trim()) newErrors.author = "Tên tác giả không được để trống.";
        if (!formData.isbn.trim()) newErrors.isbn = "ISBN không được để trống.";
        if (!formData.categoryId) newErrors.categoryId = "Vui lòng chọn danh mục.";

        const quantity = Number(formData.quantity);
        if (isNaN(quantity) || quantity <= 0) newErrors.quantity = "Số lượng phải là số nguyên dương.";

        const publicationYear = Number(formData.publicationYear);
        if (isNaN(publicationYear) || publicationYear < 1000 || publicationYear > new Date().getFullYear()) {
            newErrors.publicationYear = "Năm xuất bản không hợp lệ.";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // --- 4. Xử lý Submit Form (CREATE) ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);
            
            // 🚨 SỬ DỤNG FormData để gửi cả file và dữ liệu
            const formDataPayload = new FormData();
            formDataPayload.append('title', formData.name); // Tên sách -> title
            formDataPayload.append('author', formData.author);
            formDataPayload.append('isbn', formData.isbn);
            formDataPayload.append('description', formData.description);
            formDataPayload.append('categoryId', formData.categoryId);
            formDataPayload.append('quantity', String(formData.quantity));
            formDataPayload.append('publicationYear', String(formData.publicationYear));
            
            // Thêm file (nếu có)
            if (coverFile) {
                formDataPayload.append('cover', coverFile);
            }


            // Giả định bookService.createBook đã được cập nhật để chấp nhận FormData
            await bookService.createBook(formDataPayload); 
            
            toast.success("Thêm sách mới thành công!");
            navigate('/admin/books'); 
        } catch (error) {
            toast.error(`Thao tác thất bại: ${(error as any).response?.data?.message || 'Lỗi kết nối'}`);
            console.error("Create Book Error:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const getInputClass = (fieldName: keyof BookFormData) => 
        `w-full p-3 border rounded-lg focus:ring-2 transition ${errors[fieldName] ? 'border-red-500 focus:ring-red-500' : 'focus:ring-amber-500'}`;

    return (
        <div className="p-6 bg-white shadow-xl rounded-xl">
            <div className="mb-4">
                <Link to="/admin/books" className="text-amber-600 hover:text-amber-700 font-medium flex items-center">
                    <FiArrowLeft className="mr-2" /> Quay lại danh sách Sách
                </Link>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <FiBookOpen className="mr-3 text-amber-500" /> Thêm Sách Mới
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Tên Sách (Title) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên Sách (Title) *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={getInputClass('name')}
                            placeholder="Nhập tên sách"
                            required
                        />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Tác giả */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả *</label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className={getInputClass('author')}
                            placeholder="Nhập tên tác giả"
                            required
                        />
                        {errors.author && <p className="text-sm text-red-500 mt-1">{errors.author}</p>}
                    </div>
                    
                    {/* ISBN */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ISBN *</label>
                        <input
                            type="text"
                            name="isbn"
                            value={formData.isbn}
                            onChange={handleChange}
                            className={getInputClass('isbn')}
                            placeholder="Nhập ISBN"
                            required
                        />
                        {errors.isbn && <p className="text-sm text-red-500 mt-1">{errors.isbn}</p>}
                    </div>


                    {/* Danh mục (Category) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục *</label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className={getInputClass('categoryId')}
                            required
                            disabled={categories.length === 0}
                        >
                            <option value="" disabled>-- Chọn Danh mục --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {categories.length === 0 && <p className="text-sm text-gray-500 mt-1">Đang tải danh mục...</p>}
                        {errors.categoryId && <p className="text-sm text-red-500 mt-1">{errors.categoryId}</p>}
                    </div>

                    {/* Số lượng tồn kho (Quantity) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tổng Số lượng *</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className={getInputClass('quantity')}
                            placeholder="Nhập số lượng sách"
                            required
                            min="1"
                        />
                        {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
                    </div>

                    {/* Năm xuất bản (Publication Year) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Năm xuất bản *</label>
                        <input
                            type="number"
                            name="publicationYear"
                            value={formData.publicationYear}
                            onChange={handleChange}
                            className={getInputClass('publicationYear')}
                            placeholder="Ví dụ: 2023"
                            required
                            min="1000"
                            max={new Date().getFullYear()}
                        />
                        {errors.publicationYear && <p className="text-sm text-red-500 mt-1">{errors.publicationYear}</p>}
                    </div>
                    
                    {/* File Upload cho Ảnh Bìa */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Chọn Ảnh Bìa <span className="text-sm text-gray-500">(Tùy chọn)</span>
                        </label>
                        <input
                            type="file"
                            name="cover"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition duration-150"
                        />
                    </div>
                </div>

                {/* Description (Toàn bộ chiều rộng) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả sách</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className={`w-full p-3 border rounded-lg focus:ring-2 transition ${errors.description ? 'border-red-500 focus:ring-red-500' : 'focus:ring-amber-500'}`}
                        placeholder="Nhập mô tả chi tiết về sách..."
                    />
                    {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                </div>


                {/* --- Xem trước ảnh --- */}
                {previewUrl && (
                    <div className="pt-4 border-t border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Xem trước ảnh</label>
                        <img
                            src={previewUrl}
                            alt="Ảnh đại diện sách"
                            className="w-32 h-48 object-cover rounded-lg shadow-lg border border-gray-200"
                        />
                    </div>
                )}


                {/* Nút Submit */}
                <div className="pt-6 flex justify-end space-x-3 border-t border-gray-200">
                    <Link
                        to="/books"
                        className="flex items-center px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150 shadow-sm"
                    >
                        <FiXCircle className="mr-2" /> Hủy
                    </Link>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center px-6 py-3 text-sm font-semibold text-white rounded-lg shadow-md transition duration-150 ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-amber-500 hover:bg-amber-600'
                        }`}
                    >
                        <FiSave className="mr-2" />
                        {loading ? 'Đang thêm...' : 'Thêm Sách'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookCreatePage;