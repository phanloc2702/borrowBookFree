// src/pages/user/ChangePasswordPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { authService } from "../../services/authService";
import type { AuthUser } from "../../services/authService";
import { toast } from "react-toastify";

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();

  // Lấy user từ localStorage (giống các trang khác)
  let currentUser: AuthUser | null = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      currentUser = JSON.parse(raw);
    }
  } catch {
    currentUser = null;
  }

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Vui lòng đăng nhập lại trước khi đổi mật khẩu.");
      return;
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      setSubmitting(true);

      await authService.changePassword({
        email: currentUser.email,
        oldPassword,
        newPassword,
      });

      toast.success("Đổi mật khẩu thành công.");
      navigate("/profile");
    } catch (error: any) {
      console.error("Change password error:", error);
      toast.error(error?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-md mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-600 mb-4 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Quay lại
        </button>

        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-full bg-amber-100 text-amber-600">
              <Lock size={20} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                Đổi mật khẩu
              </h1>
              <p className="text-sm text-slate-500">
                Vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-sm p-2.5 border"
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-sm p-2.5 border"
                placeholder="Nhập mật khẩu mới"
              />
              <p className="mt-1 text-xs text-slate-400">
                Gợi ý: ít nhất 6 ký tự, nên có cả chữ và số.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-sm p-2.5 border"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 bg-amber-500 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Đang xử lý..." : "Xác nhận đổi mật khẩu"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
