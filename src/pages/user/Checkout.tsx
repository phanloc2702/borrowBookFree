// src/pages/user/Checkout.tsx
import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { useNavigate, Navigate } from "react-router-dom";
import borrowRequestService from "../../services/borrowRequestService";

interface AuthUser {
  id: number;
  fullName?: string | null;
  email: string;
  role: "USER" | "ADMIN";
}

const Checkout: React.FC = () => {
  const { getSelectedItems, clearCart } = useCart();
  const navigate = useNavigate();
  const selectedItems = getSelectedItems();

  // Nếu không có sách nào => quay lại giỏ
  if (selectedItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  // Lấy user từ localStorage
  let user: AuthUser | null = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      user = JSON.parse(raw);
    }
  } catch {
    user = null;
  }

  const [formData, setFormData] = useState({
    name:
      user?.fullName && user.fullName.trim().length > 0
        ? user.fullName
        : user?.email || "",
    phone: "",
    address: "",
    note: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "QR">("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = 15000; // phí ship cố định

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Vui lòng đăng nhập lại trước khi mượn sách.");
      return;
    }

    if (selectedItems.length === 0) {
      alert("Giỏ mượn của bạn đang trống.");
      return;
    }

    setIsSubmitting(true);

    try {
      // ❗ Chỉ gửi REQUEST cho admin, chưa tạo Borrowing
      await borrowRequestService.createBorrowRequest({
        userId: user.id,
        bookIds: selectedItems.map((b) => b.id),
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        note: formData.note,
        paymentMethod, // "COD" | "QR"
        shippingFee: totalAmount,
      });

      clearCart();
      navigate("/order-success");
    } catch (error) {
      console.error("Send borrow request failed", error);
      alert("Có lỗi xảy ra khi gửi yêu cầu mượn sách, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8 text-center">
        Xác nhận thông tin mượn sách
      </h1>

      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-slate-100">
        <div className="md:grid md:grid-cols-2">
          {/* Form Info */}
          <div className="p-6 md:p-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">
                1
              </span>
              Thông tin người nhận
            </h2>
            <form
              id="checkout-form"
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2.5 border"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2.5 border"
                  placeholder="09xx xxx xxx"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Địa chỉ nhận sách
                </label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2.5 border"
                  placeholder="Số nhà, đường, phường/xã..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ghi chú (tuỳ chọn)
                </label>
                <textarea
                  name="note"
                  rows={2}
                  value={formData.note}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2.5 border"
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
                />
              </div>
            </form>
          </div>

          {/* Payment & Summary */}
          <div className="bg-slate-50 p-6 md:p-8 border-l border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">
                2
              </span>
              Hình thức thanh toán phí ship
            </h2>

            <div className="space-y-3 mb-8">
              <label
                className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === "COD"
                    ? "border-amber-500 bg-amber-50 ring-1 ring-amber-500"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="h-4 w-4 text-amber-600 border-slate-300 focus:ring-amber-500"
                />
                <span className="ml-3 block text-sm font-medium text-slate-900">
                  Thanh toán khi nhận hàng (COD)
                </span>
              </label>

              <label
                className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === "QR"
                    ? "border-amber-500 bg-amber-50 ring-1 ring-amber-500"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    value="QR"
                    checked={paymentMethod === "QR"}
                    onChange={() => setPaymentMethod("QR")}
                    className="h-4 w-4 text-amber-600 border-slate-300 focus:ring-amber-500"
                  />
                  <span className="ml-3 block text-sm font-medium text-slate-900">
                    Thanh toán ngay (QR Code)
                  </span>
                </div>

                {paymentMethod === "QR" && (
                  <div className="mt-4 ml-7 p-3 bg-white rounded-lg border border-slate-200">
                    <div className="aspect-square w-32 mx-auto bg-slate-200 flex items-center justify-center text-xs text-slate-500 mb-2">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ExamplePayment"
                        alt="QR Code"
                      />
                    </div>
                    <p className="text-xs text-center text-slate-500">
                      Quét mã để thanh toán 15.000đ
                    </p>
                  </div>
                )}
              </label>
            </div>

            <div className="border-t border-slate-200 pt-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">
                  Sách mượn ({selectedItems.length})
                </span>
                <span className="font-medium">0 đ</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Phí vận chuyển</span>
                <span className="font-medium">
                  {totalAmount.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 mt-4">
                <span>Tổng thanh toán</span>
                <span>{totalAmount.toLocaleString("vi-VN")} đ</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full bg-amber-500 text-white py-3 px-4 rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50 flex justify-center items-center"
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Gửi yêu cầu mượn sách"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
