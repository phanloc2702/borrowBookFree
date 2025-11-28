// Định nghĩa kiểu dữ liệu cho Sản phẩm (Sách)
interface Product {
    id: string;
    name: string;
    author: string;
    price: number;
    categoryId: string; // Khóa ngoại liên kết với Danh mục
    stock: number;
    imageUrl: string;
}

// Dữ liệu sản phẩm (sách) giả lập
let mockProducts: Product[] = [
    { id: 'P001', name: 'Áo sơ mi Caro', author: 'Thời trang', price: 250000, categoryId: 'C001', stock: 50, imageUrl: 'https://placehold.co/100x100/94a3b8/white?text=Sơ+mi' },
    { id: 'P002', name: 'Điện thoại X30 Pro', author: 'Điện tử', price: 12000000, categoryId: 'C002', stock: 15, imageUrl: 'https://placehold.co/100x100/22c55e/white?text=X30+Pro' },
    { id: 'P003', name: 'Máy pha cà phê T8', author: 'Gia dụng', price: 1800000, categoryId: 'C003', stock: 30, imageUrl: 'https://placehold.co/100x100/f97316/white?text=Cà+phê' },
    { id: 'P004', name: 'Quần Jeans Slim Fit', author: 'Thời trang', price: 450000, categoryId: 'C001', stock: 80, imageUrl: 'https://placehold.co/100x100/fb923c/white?text=Jeans' },
    { id: 'P005', name: 'Loa Bluetooth X9', author: 'Điện tử', price: 890000, categoryId: 'C002', stock: 45, imageUrl: 'https://placehold.co/100x100/1e40af/white?text=Loa+X9' },
];

// Hàm giả lập tạo ID
const generateId = () => 'P' + Math.floor(Math.random() * 9000 + 1000).toString();

// Giả lập Axios response
const mockResponse = (data: any) => ({
    data: data,
    status: 200,
});

const productService = {
    // 1. Lấy tất cả sản phẩm (có thể lọc theo categoryId)
    getAllProducts: (categoryId?: string) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let products = mockProducts;
                if (categoryId) {
                    // Lọc theo Category ID
                    products = mockProducts.filter(p => p.categoryId === categoryId);
                }
                resolve(mockResponse(products));
            }, 500);
        });
    },

    // 2. Tạo sản phẩm mới
    createProduct: (formData: Omit<Product, 'id' | 'imageUrl'> & { imageUrl?: string }) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newProduct: Product = {
                    ...formData,
                    id: generateId(),
                    imageUrl: formData.imageUrl || 'https://placehold.co/100x100/cccccc/333333?text=New+Product',
                };
                mockProducts.push(newProduct);
                resolve(mockResponse(newProduct));
            }, 800);
        });
    },

    // 3. Cập nhật sản phẩm
    updateProduct: (id: string, formData: Partial<Product>) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockProducts.findIndex(p => p.id === id);
                if (index !== -1) {
                    mockProducts[index] = {
                        ...mockProducts[index],
                        ...formData,
                    };
                    resolve(mockResponse(mockProducts[index]));
                } else {
                    reject(new Error("Sản phẩm không tồn tại"));
                }
            }, 800);
        });
    },

    // 4. Xóa sản phẩm
    deleteProduct: (id: string) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const initialLength = mockProducts.length;
                mockProducts = mockProducts.filter(p => p.id !== id);
                if (mockProducts.length < initialLength) {
                    resolve(mockResponse({ message: "Xóa thành công" }));
                } else {
                    reject(new Error("Không tìm thấy sản phẩm để xóa"));
                }
            }, 500);
        });
    }
};

export default productService;