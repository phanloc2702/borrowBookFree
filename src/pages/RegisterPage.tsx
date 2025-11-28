import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSave, FiEye, FiEyeOff, FiUserPlus } from "react-icons/fi";
import { toast } from "react-toastify";
// Giả định AuthService có hàm registerUser
import { authService } from "../services/authService";

// 👉 Định nghĩa kiểu dữ liệu
interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string; // Thêm trường xác nhận
  fullName: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
}

// --- Component Input Mật khẩu có nút Hiện/Ẩn ---
interface PasswordFieldProps {
  name: keyof RegisterFormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  label: string;
  placeholder: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ 
  name, 
  value, 
  onChange, 
  error, 
  label,
  placeholder
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const inputClass = `w-full p-3 pr-10 border rounded-lg focus:outline-none transition duration-150 ${
    error 
      ? 'border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:ring-2 focus:ring-amber-500'
  }`;
  
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={inputClass}
          placeholder={placeholder}
          required
        />
        {/* Nút con mắt */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
          title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
// -----------------------------------------------------------------


const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // 🧩 Xử lý thay đổi input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Validation mở rộng
  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username là bắt buộc.";
    if (!formData.email.trim()) newErrors.email = "Email là bắt buộc.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email không hợp lệ.";
    
    if (formData.password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🚀 Gọi API đăng ký
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.warn("⚠️ Vui lòng điền và kiểm tra lại các trường bắt buộc.");
      return;
    }

    try {
      setLoading(true);
      
      // Dữ liệu gửi đi (Không gửi confirmPassword)
      const { confirmPassword, ...dataToRegister } = formData;
      
      const response = await authService.registerUser(dataToRegister); 
      console.log("API Response:", response.data);

      toast.success("✅ Đăng ký thành công! Vui lòng đăng nhập.");
      // Chuyển hướng đến trang Đăng nhập sau khi đăng ký thành công
      setTimeout(() => navigate("/login"), 1500); 
      
    } catch (error: any) {
      console.error("Lỗi khi đăng ký:", error);
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi đăng ký!";
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Class input có highlight lỗi
  const getInputClass = (fieldName: keyof FormErrors) =>
    `w-full p-3 border rounded-lg focus:outline-none transition duration-150 ${
      errors[fieldName]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-2 focus:ring-amber-500"
    }`;

  return (
    // Thiết kế tối giản, tập trung vào form, không có sidebar/header admin
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border-t-4 border-amber-500">
        
        <div className="flex flex-col items-center mb-6">
          <FiUserPlus className="text-5xl text-amber-500 mb-3" />
          <h2 className="text-3xl font-extrabold text-gray-800">
            Đăng ký Tài khoản Mới
          </h2>
          <p className="text-gray-500 text-sm mt-1">Gia nhập cộng đồng người dùng của chúng tôi.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Nhập tên đăng nhập"
              required
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username}</p>
            )}
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
              placeholder="example@email.com"
              required
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          {/* Full name (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên đầy đủ (Tùy chọn)
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={getInputClass("fullName")}
              placeholder="Tên đầy đủ của bạn"
            />
          </div>

          {/* Password (Sử dụng component mới) */}
          <PasswordField 
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            label="Mật khẩu"
            placeholder="Mật khẩu (ít nhất 6 ký tự)"
          />
          
          {/* Confirm Password (Sử dụng component mới) */}
          <PasswordField 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            label="Xác nhận Mật khẩu"
            placeholder="Nhập lại mật khẩu"
          />
          

          {/* Buttons */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center px-4 py-3 text-sm font-semibold text-white rounded-lg transition duration-150 shadow-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-600"
              }`}
            >
              <FiSave className="mr-2" />{" "}
              {loading ? "Đang đăng ký..." : "Đăng ký Tài khoản"}
            </button>
          </div>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium transition duration-150">
              Đăng nhập ngay
            </Link>
          </p>
          
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;