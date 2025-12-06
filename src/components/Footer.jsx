// src/components/Footer.jsx
import React from 'react';
import { FaFacebook, FaTiktok, FaYoutube, FaUsers } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import '../css/Footer.css'; // CSS riêng cho footer

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-sections">
        <div>
          <h4>DN GIFT Đà Nẵng</h4>
          Chuyên cung cấp đặc sản Đà Nẵng và các tỉnh miền<br />
            trung từ các nhà sản xuất đảm bảo uy tín và chất lượng.
        </div>
        <div>
          <h4>THÔNG TIN</h4>
          <p>Hệ thống cửa hàng</p>
          <p>Hướng dẫn mua hàng</p>
          <p>Hướng dẫn thanh toán</p>

        </div>
         <div>
          <h4>TỔNG ĐÀI HỖ TRỢ <span>(8:00 - 21:00)</span></h4>
          <p>Mua hàng: <a href="tel:19005301">090 590 65 43</a></p>
          <p>Cơ sở 1: <a href="tel:18006173">33 Xô Viết Nghệ Tĩnh, Đà Nẵng, Việt Nam.</a></p>
          <p>Cơ sở 2: <a href="tel:19005454">64 Bến Nghé,TP Huế</a></p>
          <p>Email: <a href="mailto:cskh@gearvn.com">dngift2025@gmail.com</a></p>
        </div>
      </div>

      <hr />

        <div className="footer-bottom">
        <span>KẾT NỐI VỚI CHÚNG TÔI</span>
        <div className="social-icons">
          <a
            href="https://www.facebook.com/profile.php?id=61584298195429"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            title="Kết nối Facebook"
          >
            <FaFacebook />
          </a>
          <FaTiktok />
          <FaYoutube />
          <SiZalo />
          <FaUsers />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
