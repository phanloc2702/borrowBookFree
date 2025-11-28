
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Giới thiệu */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">TechStore</h3>
          <p className="text-sm leading-relaxed">
            Cung cấp laptop, PC, linh kiện và phụ kiện chính hãng với giá tốt
            nhất. Cam kết chất lượng và dịch vụ hậu mãi chu đáo.
          </p>
        </div>

        {/* Hỗ trợ khách hàng */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">
            Hỗ trợ khách hàng
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/huong-dan" className="hover:text-white">
                Hướng dẫn mua hàng
              </Link>
            </li>
            <li>
              <Link to="/bao-hanh" className="hover:text-white">
                Chính sách bảo hành
              </Link>
            </li>
            <li>
              <Link to="/van-chuyen" className="hover:text-white">
                Chính sách vận chuyển
              </Link>
            </li>
            <li>
              <Link to="/doi-tra" className="hover:text-white">
                Đổi trả & Hoàn tiền
              </Link>
            </li>
          </ul>
        </div>

        {/* Chính sách */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Chính sách</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/bao-mat" className="hover:text-white">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link to="/dieu-khoan" className="hover:text-white">
                Điều khoản sử dụng
              </Link>
            </li>
            <li>
              <Link to="/khuyen-mai" className="hover:text-white">
                Khuyến mãi
              </Link>
            </li>
          </ul>
        </div>

        {/* Liên hệ */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Liên hệ</h3>
          <p className="text-sm mb-4">
            Hotline: <span className="text-white font-bold">1900 1234</span>
          </p>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white text-2xl"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white text-2xl"
            >
              <FaInstagram />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white text-2xl"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} TechStore. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
