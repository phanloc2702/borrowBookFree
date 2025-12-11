// src/pages/user/ReturnGuidePage.tsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Truck, Info } from "lucide-react";

interface RouteParams {
  borrowingId: string;
}

const ReturnGuidePage: React.FC = () => {
  const navigate = useNavigate();
  const { borrowingId } = useParams<RouteParams>();

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-600 mb-4 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Quay lại
        </button>

        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Info className="text-amber-500" size={24} />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                Hướng dẫn trả sách
              </h1>
              {borrowingId && (
                <p className="text-sm text-slate-500">
                  Mã phiếu mượn: #{borrowingId}
                </p>
              )}
            </div>
          </div>

          <p className="text-slate-600 mb-6">
            Bạn có thể chọn một trong hai hình thức sau để trả sách lại cho thư viện:
          </p>

          {/* Cách 1: Mang đến trung tâm */}
          <div className="mb-6 border border-slate-100 rounded-xl p-5 bg-slate-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                <MapPin size={18} />
              </div>
              <h2 className="font-semibold text-slate-900">
                Cách 1: Mang sách đến trực tiếp trung tâm
              </h2>
            </div>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              <li>
                Địa chỉ: <span className="font-medium">[LB-LIBRARY Toà nhà SKY, 70 Định Công, Hoàng Mai, Hà Nội]</span>
              </li>
              <li>Thời gian nhận sách: 8h00 - 17h00 (Thứ 2 - Thứ 7).</li>
              <li>
                Khi đến, vui lòng báo mã phiếu mượn{" "}
                <span className="font-mono">
                  #{borrowingId || "…"}
                </span>{" "}
                để thủ thư kiểm tra và xác nhận trả.
              </li>
            </ul>
          </div>

          {/* Cách 2: Gửi ship */}
          <div className="mb-6 border border-slate-100 rounded-xl p-5 bg-slate-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <Truck size={18} />
              </div>
              <h2 className="font-semibold text-slate-900">
                Cách 2: Gửi ship về thư viện
              </h2>
            </div>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              <li>
                Ghi rõ trên gói hàng:{" "}
                <span className="font-medium">
                  &quot;Trả sách thư viện - Mã phiếu #{borrowingId || "…"}&quot;
                </span>
              </li>
              <li>
                Địa chỉ nhận: <span className="font-medium">[LB-LIBRARY Toà nhà SKY, 70 Định Công, Hoàng Mai, Hà Nội]</span>
              </li>
              <li>
                Sau khi đơn vị vận chuyển giao thành công, thư viện sẽ kiểm tra
                và cập nhật trạng thái &quot;Đã trả&quot; trong hệ thống.
              </li>
            </ul>
          </div>

          <p className="text-xs text-slate-500 mb-6">
            Lưu ý: Bạn vui lòng gói sách cẩn thận, tránh ướt/móp méo.  
            Nếu sách bị hư hại nặng, thư viện có thể liên hệ để trao đổi thêm.
          </p>

          <div className="flex justify-end">
            <button
              onClick={() => navigate("/profile")}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-amber-500 text-white hover:bg-amber-600"
            >
              Tôi đã hiểu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnGuidePage;
