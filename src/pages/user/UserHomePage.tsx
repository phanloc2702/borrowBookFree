// src/pages/user/UserHomePage.tsx
import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, Check, Filter, Sparkles, BookOpen, X } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import bookService from "../../services/bookService";
import categoryService from "../../services/categoryService";

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  categoryName: string;
  available: boolean;
  coverUrl: string;
  availableQuantity: number;
  quantity?: number;
}

interface BookDetail extends Book {
  isbn?: string;
  publicationYear?: number;
  categoryId?: number;
  createdAt?: string;
}

const UserHomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();

  // state cho modal chi tiết
  const [selectedBook, setSelectedBook] = useState<BookDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Lấy data từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookRes, cateRes] = await Promise.all([
          bookService.getBooks(0, 100, ""),
          categoryService.getAllCategories(),
        ]);

        const bookData =
          bookRes.data.data?.content || bookRes.data.content || [];

        const mappedBooks: Book[] = bookData.map((b: any) => ({
          id: b.id,
          title: b.title,
          author: b.author,
          description: b.description || "",
          categoryName: b.category?.name || b.categoryName || "Khác",
          available: (b.availableQuantity ?? 0) > 0,
          availableQuantity: b.availableQuantity ?? 0,
          quantity: b.quantity ?? undefined,
          coverUrl: b.coverUrl
            ? `http://localhost:8080/${b.coverUrl}`
            : "https://placehold.co/400x600?text=No+Cover",
        }));
        setBooks(mappedBooks);

        const cateData = cateRes.data.data || cateRes.data || [];
        const cateNames = cateData.map((c: any) => c.name);
        setCategories(["Tất cả", ...Array.from(new Set(cateNames))]);
      } catch (err) {
        console.error("Fetch books/categories error:", err);
      }
    };

    fetchData();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Tất cả" ||
        book.categoryName === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [books, searchTerm, selectedCategory]);

  const handleBorrow = (book: Book) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    addToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
    });
  };

  // Gọi API lấy chi tiết sách theo id
  const openBookDetail = async (id: number) => {
    try {
      setDetailLoading(true);
      setSelectedBook(null);

      const res = await bookService.getBookById(id);
      const data = res.data.data || res.data; // BookResponse

      const detail: BookDetail = {
        id: data.id,
        title: data.title,
        author: data.author,
        description: data.description || "",
        categoryName: data.categoryName || "Khác",
        available: (data.availableQuantity ?? 0) > 0,
        availableQuantity: data.availableQuantity ?? 0,
        quantity: data.quantity ?? undefined,
        coverUrl: data.coverUrl
          ? `http://localhost:8080/${data.coverUrl}`
          : "https://placehold.co/400x600?text=No+Cover",
        // thêm field riêng
        isbn: data.isbn,
        publicationYear: data.publicationYear,
        categoryId: data.categoryId,
        createdAt: data.createdAt,
      };

      setSelectedBook(detail);
    } catch (error) {
      console.error("Lỗi lấy chi tiết sách:", error);
      alert("Không lấy được thông tin sách, vui lòng thử lại.");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelectedBook(null);
    setDetailLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="relative bg-white border-b border-slate-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-white/50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-xs font-bold uppercase tracking-wide mb-6">
              <Sparkles size={14} />
              Thư viện sách miễn phí
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
              Khám phá thế giới <br /> qua từng{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
                trang sách
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
              Dự án thư viện cộng đồng phi lợi nhuận. <br className="hidden md:block" />
              Chọn sách yêu thích, chúng tôi sẽ giao đến tận tay bạn.
            </p>

            {/* Search */}
            <div className="relative max-w-2xl mx-auto transform transition-all hover:scale-[1.01]">
              <div className="absolute inset-0 bg-amber-200 blur-xl opacity-30 rounded-full" />
              <div className="relative flex items-center bg-white rounded-full shadow-xl shadow-slate-200/50 p-2 border border-slate-100">
                <div className="pl-4 text-slate-400">
                  <Search className="h-6 w-6" />
                </div>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 text-base"
                  placeholder="Tìm kiếm tên sách, tác giả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="hidden sm:block bg-slate-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-amber-600 transition-colors">
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nội dung */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
            <Filter size={20} className="text-amber-600" />
            <h3>Danh mục sách</h3>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto scrollbar-hide mask-linear-fade">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-white shadow-md shadow-amber-400/40"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid sách */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 lg:gap-8">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col overflow-hidden h-full"
            >
              {/* Ảnh – click mở chi tiết */}
              <div
                className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100 cursor-pointer"
                onClick={() => openBookDetail(book.id)}
              >
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur text-slate-800 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                    {book.categoryName}
                  </span>
                </div>

                {!book.available && (
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <div className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg transform -rotate-6">
                      Tạm hết
                    </div>
                  </div>
                )}
              </div>

              {/* Nội dung card */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex-1 mb-4">
                  <h3
                    className="text-lg font-bold text-slate-900 line-clamp-2 mb-1 group-hover:text-amber-600 transition-colors cursor-pointer"
                    title={book.title}
                    onClick={() => openBookDetail(book.id)}
                  >
                    {book.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1">
                    <span className="w-4 h-[1px] bg-slate-300 inline-block"></span>
                    {book.author}
                  </p>
                  <p className="text-xs text-slate-500 mb-2">
                    Còn{" "}
                    <span className="font-semibold text-amber-700">
                      {book.availableQuantity}
                    </span>{" "}
                    cuốn
                  </p>
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // không trigger openBookDetail
                    handleBorrow(book);
                  }}
                  disabled={!book.available || isInCart(book.id)}
                  className={`w-full relative overflow-hidden flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    isInCart(book.id)
                      ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
                      : !book.available
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-slate-900 text-white hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/30"
                  }`}
                >
                  {isInCart(book.id) ? (
                    <>
                      <Check size={18} className="stroke-2" />
                      Đã trong giỏ
                    </>
                  ) : !book.available ? (
                    "Đang chờ sách về"
                  ) : (
                    <>
                      <Plus size={18} className="stroke-2" />
                      Thêm vào giỏ
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <BookOpen size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              Không tìm thấy sách
            </h3>
            <p className="text-slate-500">
              Thử thay đổi từ khóa hoặc danh mục tìm kiếm xem sao.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Tất cả");
              }}
              className="mt-6 text-amber-600 font-medium hover:underline"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Modal chi tiết sách */}
      {(detailLoading || selectedBook) && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeDetail}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-slate-900">
                Thông tin sách
              </h2>
              <button
                onClick={closeDetail}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>

            {detailLoading || !selectedBook ? (
              <div className="p-8 text-center text-slate-500">
                Đang tải thông tin sách...
              </div>
            ) : (
              <div className="p-6 flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <div className="w-full aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={selectedBook.coverUrl}
                      alt={selectedBook.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {selectedBook.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    Tác giả:{" "}
                    <span className="font-semibold">
                      {selectedBook.author}
                    </span>
                  </p>
                  {selectedBook.isbn && (
                    <p className="text-sm text-slate-600">
                      ISBN:{" "}
                      <span className="font-mono">{selectedBook.isbn}</span>
                    </p>
                  )}
                  <p className="text-sm text-slate-600">
                    Danh mục:{" "}
                    <span className="font-semibold">
                      {selectedBook.categoryName}
                    </span>
                  </p>
                  {selectedBook.publicationYear && (
                    <p className="text-sm text-slate-600">
                      Năm xuất bản: {selectedBook.publicationYear}
                    </p>
                  )}
                  <p className="text-sm text-slate-600">
                    Số lượng còn lại:{" "}
                    <span className="font-semibold">
                      {selectedBook.availableQuantity}
                    </span>{" "}
                    / {selectedBook.quantity ?? "?"} cuốn
                  </p>

                  <div className="pt-2">
                    <h4 className="text-sm font-semibold text-slate-800 mb-1">
                      Mô tả
                    </h4>
                    <p className="text-sm text-slate-600 whitespace-pre-line">
                      {selectedBook.description || "Chưa có mô tả."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHomePage;
