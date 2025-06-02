import React, { useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { sCoin, sProductsToBuy } from '../../context/store';
import emailjs from 'emailjs-com';

const CheckoutSuccess = () => {

  const navigate = useNavigate(); // ✅ khởi tạo navigate

  const handleGoToHome = () => {
    navigate('/'); // ✅ dùng như thế này
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-10">

      <Card className="w-full max-w-2xl shadow-lg rounded-xl bg-white p-8">
        <h2 className="text-4xl font-bold text-green-600 text-center mb-4">
          Thanh toán thành công!
        </h2>
        <p className="text-xl text-center text-gray-700 mb-8">
          Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Đơn hàng của bạn đã được xử lý thành công.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Button
            label="Quay lại trang chủ"
            icon="pi pi-home"
            onClick={handleGoToHome}
            className="p-button-success w-full py-3 text-xl rounded-md custom-button"
          />
          <Button
            label="Tiếp tục mua sắm"
            icon="pi pi-shopping-cart"
            onClick={handleContinueShopping}
            className="p-button-info w-full py-3 text-xl rounded-md custom-button"
          />
        </div>
      </Card>

      {/* Thêm CSS tùy chỉnh */}
      <style jsx>{`
        .custom-button .p-button-icon {
          margin-right: 0.1rem !important;
        }
      `}</style>
    </div>
  );
};

export default CheckoutSuccess;
