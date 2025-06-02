import React, { useRef, useState } from 'react';
import { FaFacebook, FaInstagram, FaEnvelope, FaWhatsapp, FaYoutube, FaPhone } from "react-icons/fa";
import emailjs from 'emailjs-com';
import { Toast } from "primereact/toast";
export default function Footer() {
  const [email, setEmail] = useState('');
  const toast = useRef(null);
  // Hàm gửi email
  const sendEmail = (e) => {
    e.preventDefault(); // Ngừng hành động mặc định của form (submit)

    const templateParams = {
      email_to: email, // Đây là email người dùng nhập
      store_name: "TukuTiki", // Tên cửa hàng hoặc thông tin khác cần truyền vào
      from_name: "TukuTiki Team", // Tên người gửi
      reply_to: email, // Địa chỉ email để trả lời
    };

    console.log(templateParams.email_to)

    emailjs.send(
      'service_8dd36os', // Service ID của bạn
      'template_8lnoa8h', // Template ID của bạn
      templateParams,
      'PL8gMYLSA7J6k-atS' // User ID của bạn
    ).then((response) => {
      console.log('Email sent successfully', response);
      toast.current.show({
        severity: "success",
        detail: "Đăng ký thành công! Chúng tôi sẽ gửi email cho bạn.",
        life: 3000,
      });
      setEmail(''); // Reset email input
    }, (err) => {
      console.error('Error sending email', err);
      alert('');
      toast.current.show({
        severity: "danger",
        summary: "Error",
        detail: "Có lỗi xảy ra. Vui lòng thử lại sau.",
        life: 3000,
      });
    });
  };

  return (
    <footer className="text-gray-800 relative mt-48">
      <Toast ref={toast} />
      {/* Subscription Section */}
      <div className="bg-slate-500 text-white max-w-5xl mx-auto py-10 px-6 md:px-20 rounded-3xl absolute top-[-140px] left-0 right-0 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left - Image */}
          <div className="mb-6 md:mb-0">
            <img src="https://salt.tikicdn.com/cache/w500/ts/upload/c0/8b/46/c3f0dc850dd93bfa7af7ada0cbd75dc0.png" alt="Store Logo" className="w-36" />
          </div>

          {/* Right - Subscription */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">
              Đăng ký nhận bản tin và nhận ưu đãi độc quyền từ cửa hàng!
            </h2>
            <p className="mt-2 text-sm">
              Nhận ngay 20% giảm giá cho lần mua hàng đầu tiên chỉ với một lần đăng ký!
            </p>
            <div className="mt-2 flex justify-center md:justify-start">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Cập nhật email nhập vào
                placeholder="Nhập Email của bạn"
                className="p-2 w-60 rounded-l-lg text-gray-700 focus:outline-none"
              />
              <button
                onClick={sendEmail} // Gọi hàm gửi email khi nhấn nút
                className="bg-white text-blue-600 px-4 py-2 rounded-r-lg font-semibold">
                Đăng ký
              </button>
            </div>
            <p className="mt-2 text-xs">
              Bạn có thể hủy đăng ký bất cứ lúc nào. Đọc chính sách bảo mật & quyền riêng tư{" "}
              <a href="#" className="underline">
                tại đây
              </a>.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="w-full bg-gray-100 mx-auto px-6 md:px-20 py-10 grid grid-cols-1 md:grid-cols-4 gap-6 pt-32"> {/* Add padding-top to make space for subscription */}
        {/* Company Info */}
        <div>
          <h3 className="text-lg font-bold flex items-center">
            <span className="mr-2 text-2xl">🛒</span> TukuTiki
          </h3>

          <div className="flex space-x-4 mt-4 text-gray-600">
            <FaFacebook className="text-2xl cursor-pointer hover:text-blue-600" />
            <FaInstagram className="text-2xl cursor-pointer hover:text-pink-500" />
            <FaEnvelope className="text-2xl cursor-pointer hover:text-red-500" />
            <FaWhatsapp className="text-2xl cursor-pointer hover:text-green-500" />
            <FaYoutube className="text-2xl cursor-pointer hover:text-red-600" />
          </div>
        </div>

        {/* Các phần khác */}
        {/* Links Sections */}
        <div>
          <h3 className="font-bold">Company</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Community</a></li>
            <li><a href="#" className="hover:underline">Services</a></li>
            <li><a href="#" className="hover:underline">Testimonials</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold">Support</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="#" className="hover:underline">Websites</a></li>
            <li><a href="#" className="hover:underline">Feedback</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold">Links</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Plans</a></li>
            <li><a href="#" className="hover:underline">Membership</a></li>
            <li><a href="#" className="hover:underline">Become a Trainer</a></li>
            <li><a href="#" className="hover:underline">Diet Plan</a></li>
          </ul>
        </div>

        {/* Contact Info */}

      </div>

      {/* Bottom Section */}
      <div className="border-t py-4 text-center bg-gray-100  text-sm text-gray-500">
        <p>©Copyright 2025 by Leo-UI. All rights reserved</p>
        <div className="mt-2 flex justify-center space-x-6">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Use</a>
          <a href="#" className="hover:underline">Sitemap</a>
        </div>

      </div>

      {/* Footer */}
    </footer>
  );
}
