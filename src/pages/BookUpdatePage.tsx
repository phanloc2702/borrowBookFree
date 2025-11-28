// src/pages/BookUpdatePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiSave, FiXCircle, FiArrowLeft, FiImage, FiBookOpen } from 'react-icons/fi';
import { toast } from 'react-toastify';
import bookService from '../services/bookService'; 
import categoryService from '../services/categoryService'; 

// Định nghĩa kiểu dữ liệu cho Sách (Book) - Đồng bộ với service
interface Book {
    id: string;
    name: string;
    author: string;
    price: number;
    categoryId: string;
    stock: number;
    imageUrl: string;
}

// Định nghĩa kiểu dữ liệu cho Form
interface BookFormData {
    name: string;
    author: string;
    price: number | string; 
    categoryId: string;
    stock: number | string;
    imageUrl: string;
}

// Định nghĩa kiểu dữ liệu cho Danh mục (tối giản)
interface Category {
    id: string;
    name: string;
}

const BookUpdatePage: React.FC = () => {
    const { id: bookId } = useParams<{ id: string }>(); 
    const navigate = useNavigate();
    
    // State
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState<BookFormData>({ 
        name: '', 
        author: '', 
        price: '', 
        categoryId: '', 
        stock: '',
        imageUrl: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [initialLoadDone, setInitialLoadDone] = useState(false); 

    // --- 1. Tải danh mục (Category) ---
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.getAllCategories(); 
                const loadedCategories: Category[] = res.data.data || res.data;
                setCategories(loadedCategories || []);
            } catch (error) {
                toast.error("Lỗi khi tải danh mục.");
                console.error("Fetch Categories Error:", error);
            }
        };
        fetchCategories();
    }, []);

    // --- 2. Tải dữ liệu Sách (khi chỉnh sửa) ---
    useEffect(() => {
        // Chỉ chạy khi có bookId VÀ đã tải xong Categories
        if (bookId && categories.length > 0) {
            const fetchBook = async () => {
                try {
                    setLoading(true);
                    const res = await bookService.getBookById(bookId!);
                    const data = (res.data.data || res.data) as Book;

                    setFormData({
                        name: data.name || data.title || '', 
                        author: data.author || '',
                        price: data.price,
                        categoryId: data.categoryId,
                        stock: data.stock,
                        imageUrl: data.imageUrl || '',
                    });
                } catch (error) {
                    toast.error("Lỗi khi tải thông tin sách!");
                    console.error("Fetch Book Error:", error);
                    navigate('/books'); 
                } finally {
                    setLoading(false);
                    setInitialLoadDone(true);
                }
            };
            fetchBook();
        } else if (!bookId) {
             // Redirect nếu không có ID
             navigate('/books/create'); 
        }
    }, [bookId, navigate, categories.length]);


    // --- 3. Xử lý thay đổi Input ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // --- 4. Validation cơ bản ---
    const validate = (): boolean => {
        let newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = "Tên sách không được để trống.";
        if (!formData.author.trim()) newErrors.author = "Tên tác giả không được để trống.";
        if (!formData.categoryId) newErrors.categoryId = "Vui lòng chọn danh mục.";

        const price = Number(formData.price);
        if (isNaN(price) || price <= 0) newErrors.price = "Giá phải là số dương.";

        const stock = Number(formData.stock);
        if (isNaN(stock) || stock < 0) newErrors.stock = "Số lượng tồn phải là số không âm.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // --- 5. Xử lý Submit Form (UPDATE) ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        // Chuẩn hóa dữ liệu số trước khi gửi
        const payload = {
            name: formData.name,
            author: formData.author,
            categoryId: formData.categoryId,
            imageUrl: formData.imageUrl,
            price: Number(formData.price),
            stock: Number(formData.stock),
        };

        try {
            setLoading(true);
            await bookService.updateBook(bookId!, payload);
            toast.success("Cập nhật sách thành công!");
            navigate('/books'); 
        } catch (error) {
            toast.error(`Thao tác thất bại: ${(error as any).response?.data?.message || 'Lỗi kết nối'}`);
            console.error("Update Book Error:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const getInputClass = (fieldName: keyof BookFormData) => 
        `w-full p-3 border rounded-lg focus:ring-2 transition ${errors[fieldName] ? 'border-red-500 focus:ring-red-500' : 'focus:ring-amber-500'}`;

    if (loading && !initialLoadDone) {
        return <div className="p-6 text-center text-gray-500">Đang tải thông tin sách...</div>;
    }

    return (
        <div className="p-6 bg-white shadow-xl rounded-xl">
            <div className="mb-4">
                <Link to="/books" className="text-amber-600 hover:text-amber-700 font-medium flex items-center">
                    <FiArrowLeft className="mr-2" /> Quay lại danh sách Sách
                </Link>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <FiBookOpen className="mr-3 text-amber-500" /> Chỉnh sửa Sách (ID: {bookId})
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tên Sách */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên Sách</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
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

                    {/* Danh mục (Category) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
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

                    {/* Giá bán */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className={getInputClass('price')}
                            placeholder="Ví dụ: 150000"
                            required
                            min="0"
                        />
                        {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
                    </div>

                    {/* Số lượng tồn kho (Stock) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn kho</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className={getInputClass('stock')}
                            placeholder="Nhập số lượng sách"
                            required
                            min="0"
                        />
                        {errors.stock && <p className="text-sm text-red-500 mt-1">{errors.stock}</p>}
                    </div>

                    {/* Ảnh URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL Ảnh Đại diện</label>
                        <div className="relative">
                            <input
                                type="url" 
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className={getInputClass('imageUrl')}
                                placeholder="Dán link ảnh tại đây (Ví dụ: http://.../book.jpg)"
                            />
                            <FiImage className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        {errors.imageUrl && <p className="text-sm text-red-500 mt-1">{errors.imageUrl}</p>}
                    </div>
                </div>

                {/* --- Xem trước ảnh (tùy chọn) --- */}
                {formData.imageUrl && (
                    <div className="pt-4 border-t border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Xem trước ảnh</label>
                        <img
                            src={formData.imageUrl}
                            alt="Ảnh đại diện sách"
                            className="w-32 h-48 object-cover rounded-lg shadow-lg border border-gray-200"
                            onError={(e) => {
                                // Xử lý nếu URL ảnh bị lỗi
                                (e.target as HTMLImageElement).src = 'https://placehold.co/128x192/f0f0f0/333333?text=Image+Error';
                            }}
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
                        {loading ? 'Đang lưu...' : 'Lưu Thay đổi'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookUpdatePage;