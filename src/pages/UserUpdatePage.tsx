import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiSave, FiXCircle, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import userService from "../services/userService";

const UserUpdatePage = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    role: "USER",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await userService.getUserById(id!);
        const responseData = res.data as { message?: string; data: any };
        const data = responseData.data; // vì backend trả { message, data }
        setFormData({
          username: data.username || "",
          email: data.email || "",
          password: "", // Không hiển thị password cũ
          fullName: data.fullName || "",
          role: data.role || "USER",
        });
      } catch (err) {
        console.error("Lỗi khi tải thông tin user:", err);
        toast.error("❌ Không thể tải thông tin người dùng!");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) newErrors.username = "Username là bắt buộc.";
    if (!formData.email.trim()) newErrors.email = "Email là bắt buộc.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.warn("⚠️ Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        role: formData.role,
        ...(formData.password ? { password: formData.password } : {}), // chỉ gửi password nếu nhập mới
      };

      const res = await userService.updateUser(id!, payload);
      console.log("API Response:", res.data);

      toast.success("✅ Cập nhật người dùng thành công!");
      setTimeout(() => navigate("/users"), 1200);
    } catch (error: any) {
      console.error("Lỗi khi cập nhật:", error);
      if (error.response?.data?.message) {
        toast.error(`❌ ${error.response.data.message}`);
      } else {
        toast.error("❌ Đã xảy ra lỗi khi cập nhật người dùng!");
      }
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (fieldName: string) =>
    `w-full p-3 border rounded-lg focus:outline-none transition duration-150 ${
      errors[fieldName]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-2 focus:ring-amber-500"
    }`;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex items-center mb-8">
        <Link to="/users" className="text-gray-600 hover:text-amber-500 transition duration-150 mr-4">
          <FiArrowLeft className="text-2xl" />
        </Link>
        <h2 className="text-3xl font-extrabold text-gray-800">Cập nhật người dùng</h2>
      </div>

      <div className="max-w-3xl bg-white p-8 rounded-xl shadow-2xl border-t-4 border-amber-500">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={getInputClass("username")}
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={getInputClass("email")}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Password (chỉ nhập nếu muốn đổi) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu (chỉ nhập nếu muốn đổi)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={getInputClass("password")}
            />
          </div>

          {/* Full name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên đầy đủ</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={getInputClass("fullName")}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Vai trò</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={getInputClass("role")}
            >
              <option value="USER">USER (Người dùng)</option>
              <option value="ADMIN">ADMIN (Quản trị viên)</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200">
            <Link
              to="/users"
              className="flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150 shadow-sm"
            >
              <FiXCircle className="mr-2" /> Hủy
            </Link>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center px-4 py-2 text-sm font-semibold text-white rounded-lg transition duration-150 shadow-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-600"
              }`}
            >
              <FiSave className="mr-2" /> {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserUpdatePage;
