import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';

const OrderSuccess: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-slate-50">
      {/* Icon success */}
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-md">
        <CheckCircle size={40} className="text-emerald-600" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-slate-900 mb-3">
        Đăng ký mượn sách thành công!
      </h1>

      {/* Description */}
      <p className="text-slate-600 max-w-md mb-8 leading-relaxed">
        Cảm ơn bạn đã sử dụng hệ thống thư viện. 
        Yêu cầu mượn sách của bạn đã được ghi nhận. 
        Chúng tôi sẽ sớm liên hệ để xác nhận và gửi sách đến địa chỉ bạn đã cung cấp.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl 
                     font-semibold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/30"
        >
          <Home size={18} />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
