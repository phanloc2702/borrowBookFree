import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiLoader, FiX, FiCheckCircle, FiBookOpen } from 'react-icons/fi';
import { toast } from 'react-toastify';
import productService from '../services/productService'; 
import categoryService from '../services/categoryService'; // Cần để lấy tên danh mục

// Định nghĩa kiểu dữ liệu cho Sản phẩm (Sách)
interface Product {
    id: string;
    name: string;
    author: string;
    price: number;
    categoryId: string;
    stock: number;
    imageUrl: string;
}

// Định nghĩa kiểu dữ liệu cho Form
interface ProductFormData {
    name: string;
    author: string;
    price: number;
    categoryId: string;
    stock: number;
}

// Định nghĩa kiểu dữ liệu cho Danh mục (tối giản)
interface Category {
    id: string;
    name: string;
}

const ProductManagementPage: React.FC = () => {
    // Lấy categoryId từ URL nếu có (ví dụ: /products/category/C001)
    const { categoryId: urlCategoryId } = useParams<{ categoryId: string }>(); 
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<ProductFormData>({ name: '', author: '', price: 0, categoryId: urlCategoryId || '', stock: 0 });
    const [errors, setErrors] = useState<any>({});
    const [searchTerm, setSearchTerm] = useState('');

    // --- LOGIC TẢI DỮ LIỆU ---
    const fetchDependencies = async () => {
        setLoading(true);
        try {
            // Tải danh mục để hiển thị tên
            const catResponse = await categoryService.getAllCategories();
            setCategories(catResponse.data);

            // Tải sản phẩm (lọc theo URL nếu có)
            const prodResponse = await productService.getAllProducts(urlCategoryId);
            setProducts(prodResponse.data);

        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            toast.error('❌ Không thể tải dữ liệu sản phẩm/danh mục.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDependencies();
        // Cập nhật categoryId mặc định trong form khi URL thay đổi
        if (urlCategoryId) {
            setFormData(prev => ({ ...prev, categoryId: urlCategoryId }));
        }
    }, [urlCategoryId]);

    // Lấy tên danh mục từ ID
    const getCategoryName = (id: string) => {
        return categories.find(c => c.id === id)?.name || 'Không rõ';
    };

    // --- LOGIC FORM & MODAL ---
    const openCreateModal = () => {
        setCurrentProduct(null);
        setFormData({ 
            name: '', 
            author: '', 
            price: 0, 
            categoryId: urlCategoryId || categories[0]?.id || '', // Gán category mặc định
            stock: 0 
        });
        setErrors({});
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setCurrentProduct(product);
        setFormData({ 
            name: product.name, 
            author: product.author, 
            price: product.price, 
            categoryId: product.categoryId, 
            stock: product.stock 
        });
        setErrors({});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? parseFloat(value) : value;
        setFormData({ ...formData, [name]: finalValue });
    };

    const validate = () => {
        const newErrors: any = {};
        if (!formData.name.trim()) newErrors.name = 'Tên sản phẩm là bắt buộc.';
        if (!formData.categoryId) newErrors.categoryId = 'Danh mục là bắt buộc.';
        if (formData.price <= 0) newErrors.price = 'Giá phải lớn hơn 0.';
        if (formData.stock < 0) newErrors.stock = 'Số lượng không hợp lệ.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            toast.warn('⚠️ Vui lòng kiểm tra lại các trường bắt buộc.');
            return;
        }

        setLoading(true);
        try {
            if (currentProduct) {
                // Chỉnh sửa
                await productService.updateProduct(currentProduct.id, formData);
                toast.success(`✅ Cập nhật sản phẩm "${formData.name}" thành công!`);
            } else {
                // Thêm mới
                await productService.createProduct(formData);
                toast.success(`✅ Thêm sản phẩm "${formData.name}" thành công!`);
            }
            closeModal();
            fetchDependencies(); // Tải lại dữ liệu
        } catch (error) {
            console.error('Lỗi thao tác sản phẩm:', error);
            toast.error('❌ Đã xảy ra lỗi khi lưu sản phẩm!');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            setLoading(true);
            try {
                await productService.deleteProduct(productId);
                toast.success('✅ Xóa sản phẩm thành công!');
                fetchDependencies(); 
            } catch (error) {
                console.error('Lỗi khi xóa sản phẩm:', error);
                toast.error('❌ Đã xảy ra lỗi khi xóa sản phẩm!');
            } finally {
                setLoading(false);
            }
        }
    };
    
    // --- LỌC SẢN PHẨM ---
    const filteredProducts = products.filter(prod => 
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.id.includes(searchTerm)
    );

    const pageTitle = useMemo(() => {
        if (urlCategoryId) {
            const catName = getCategoryName(urlCategoryId);
            return `Sản phẩm thuộc: ${catName}`;
        }
        return 'Quản lý Tất cả Sản phẩm';
    }, [urlCategoryId, categories]);

    return (
        <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-800 flex items-center">
                    <FiBookOpen className='mr-3 text-amber-500'/> {pageTitle}
                </h1>
                <div className='flex space-x-3'>
                    {urlCategoryId && (
                        <button
                            onClick={() => navigate('/categories')}
                            className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition duration-150"
                        >
                            <FiX className="mr-2" /> Thoát lọc
                        </button>
                    )}
                    <button
                        onClick={openCreateModal}
                        className="flex items-center px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 transition duration-150"
                    >
                        <FiPlus className="mr-2" /> Thêm Sản phẩm
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="mb-4 relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên sản phẩm, tác giả..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                    />
                </div>

                {/* Bảng Sản phẩm */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Sản phẩm</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={6} className="py-10 text-center text-gray-500"><FiLoader className="inline-block animate-spin mr-2 text-2xl text-amber-500" /> Đang tải dữ liệu...</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan={6} className="py-10 text-center text-gray-500">Không tìm thấy sản phẩm nào.</td></tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-amber-50/50">
                                        <td className="px-6 py-4 whitespace-nowrap"><img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded" /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getCategoryName(product.categoryId)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right text-green-600">{product.price.toLocaleString('vi-VN')} VNĐ</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{product.stock}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="text-amber-600 hover:text-amber-900 p-1 rounded-full hover:bg-amber-100 transition"
                                                title="Chỉnh sửa sản phẩm"
                                            >
                                                <FiEdit className="text-lg" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition"
                                                title="Xóa sản phẩm"
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
            
            {/* Modal Thêm/Chỉnh sửa Sản phẩm */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800">
                                {currentProduct ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm Mới'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><FiX className="text-2xl" /></button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Tên Sản phẩm */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên Sản phẩm <span className="text-red-500">*</span></label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-amber-500'}`} required />
                                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                            </div>
                            
                            {/* Danh mục */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Danh mục <span className="text-red-500">*</span></label>
                                <select name="categoryId" value={formData.categoryId} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:ring-2 ${errors.categoryId ? 'border-red-500 focus:ring-red-500' : 'focus:ring-amber-500'}`} required>
                                    <option value="">-- Chọn Danh mục --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.categoryId && <p className="text-sm text-red-500 mt-1">{errors.categoryId}</p>}
                            </div>

                            {/* Tác giả */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tác giả / Nhà cung cấp</label>
                                <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500" />
                            </div>

                            {/* Giá & Tồn kho (Dùng Flex cho 2 cột) */}
                            <div className='flex space-x-4'>
                                <div className='w-1/2'>
                                    <label className="block text-sm font-medium text-gray-700">Giá (VNĐ) <span className="text-red-500">*</span></label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:ring-2 ${errors.price ? 'border-red-500 focus:ring-red-500' : 'focus:ring-amber-500'}`} required min="0" />
                                    {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
                                </div>
                                <div className='w-1/2'>
                                    <label className="block text-sm font-medium text-gray-700">Tồn kho <span className="text-red-500">*</span></label>
                                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:ring-2 ${errors.stock ? 'border-red-500 focus:ring-red-500' : 'focus:ring-amber-500'}`} required min="0" />
                                    {errors.stock && <p className="text-sm text-red-500 mt-1">{errors.stock}</p>}
                                </div>
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
                                    {loading ? 'Đang lưu...' : (currentProduct ? 'Lưu Thay đổi' : 'Thêm Mới')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagementPage;