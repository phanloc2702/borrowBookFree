import React from "react";
import { useCart } from "../../contexts/CartContext";
import { Trash2, ArrowRight, ShoppingBag, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
  const { cart, removeFromCart, toggleSelection, getSelectedItems } = useCart();
  const navigate = useNavigate();

  const selectedItems = getSelectedItems();
  const shippingFee = selectedItems.length > 0 ? 15000 : 0;

  const handleProceed = () => {
    if (selectedItems.length === 0) return;
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-8 relative">
          <ShoppingBag size={56} className="text-slate-300" />
          <div className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
            <span className="text-xl">0</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          Giỏ sách của bạn đang trống
        </h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
          Có vẻ như bạn chưa chọn cuốn sách nào. Hãy dạo một vòng thư viện và
          tìm những cuốn sách thú vị nhé.
        </p>
        <Link
          to="/"
          className="group inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white rounded-full font-bold text-lg hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/30 hover:-translate-y-1"
        >
          <BookOpen size={20} />
          Quay lại thư viện
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-50 min-h-screen">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Giỏ sách</h1>
          <p className="text-slate-500 mt-1">
            Bạn đang có {cart.length} cuốn sách trong giỏ
          </p>
        </div>
        <Link
          to="/"
          className="hidden sm:inline-flex text-amber-600 font-medium hover:underline"
        >
          Tiếp tục xem sách
        </Link>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white shadow-sm rounded-3xl border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center gap-3">
              <div className="w-5 h-5 rounded border border-slate-300 bg-white flex items-center justify-center">
                {/* mock checkbox select all */}
                <div className="w-2.5 h-2.5 bg-slate-300 rounded-sm"></div>
              </div>
              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Danh sách sách ({cart.length})
              </span>
            </div>

            <ul className="divide-y divide-slate-100">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className={`p-6 flex items-start sm:items-center gap-4 hover:bg-slate-50/50 transition-colors ${
                    item.selected ? "bg-amber-50/40" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <div className="flex items-center h-full pt-1 sm:pt-0">
                    <input
                      id={`book-${item.id}`}
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleSelection(item.id)}
                      className="w-5 h-5 text-amber-600 border-slate-300 rounded focus:ring-amber-500 cursor-pointer transition-all"
                    />
                  </div>

                  {/* Image */}
                  <div className="flex-shrink-0 w-20 h-28 rounded-lg overflow-hidden border border-slate-200 shadow-sm group">
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <div>
                        <label
                          htmlFor={`book-${item.id}`}
                          className="block text-lg font-bold text-slate-900 hover:text-amber-600 cursor-pointer transition-colors line-clamp-1"
                        >
                          {item.title}
                        </label>
                        <p className="text-sm font-medium text-slate-500">
                          {item.author}
                        </p>
                        {item.category && (
                          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            {item.category}
                          </div>
                        )}
                      </div>
                      <div className="mt-2 sm:mt-0 text-right">
                        <span className="block text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          Miễn phí
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="group p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Xóa khỏi giỏ"
                    >
                      <Trash2 size={20} className="group-hover:stroke-2" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sticky top-28">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Tóm tắt đơn mượn
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-slate-600">
                <span>Sách đã chọn</span>
                <span className="font-semibold text-slate-900">
                  {selectedItems.length} cuốn
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Phí mượn sách</span>
                <span className="font-semibold text-green-600">Miễn phí</span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-slate-900">
                  {shippingFee.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-base font-bold text-slate-900">
                  Tổng thanh toán
                </span>
                <span className="text-xl font-extrabold text-amber-600">
                  {shippingFee.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <p className="text-xs text-slate-400 text-right">
                (Đã bao gồm VAT nếu có)
              </p>
            </div>

            <button
              onClick={handleProceed}
              disabled={selectedItems.length === 0}
              className="w-full group relative flex justify-center items-center gap-3 bg-slate-900 border border-transparent rounded-2xl py-4 px-4 text-base font-bold text-white hover:bg-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-slate-900/20 hover:shadow-amber-500/30 hover:-translate-y-0.5"
            >
              Tiến hành mượn
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            {selectedItems.length === 0 && (
              <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-3 rounded-xl text-xs font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></div>
                Vui lòng chọn ít nhất 1 cuốn sách để tiếp tục.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
