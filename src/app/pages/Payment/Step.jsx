import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./Step.css";

export default function Step() {
    const location = useLocation(); // Get current route location

    // Function to check if the current path is the active step
    const isActiveStep = (path) => location.pathname.includes(path);

    return (
        <div className="w-full flex flex-col items-center space-x-10 ">
            <div className="w-full flex mt-10 items-center justify-center space-x-10">
                {/* Cart Step */}
                <div className={`font-semibold text-xl ${isActiveStep('cart') ? 'text-blue-500' : 'text-gray-500'}`}>
                    <i className="pi pi-shopping-bag mr-2 text-xl"></i>Giỏ Hàng
                </div>
                <div className={`w-28 h-[1px] ${isActiveStep('cart') ? 'bg-blue-500' : 'bg-gray-500'}`}></div>

                {/* Payment Step */}
                <div className={`font-semibold text-xl ${isActiveStep('checkout') ? 'text-blue-500' : 'text-gray-500'}`}>
                    <i className="pi pi-credit-card mr-2 text-xl"></i>Thanh Toán
                </div>
                <div className={`w-28 h-[1px] ${isActiveStep('checkout') ? 'bg-blue-500' : 'bg-gray-500'}`}></div>

                {/* Success Step */}
                <div className={`font-semibold text-xl ${isActiveStep('success') ? 'text-blue-500' : 'text-gray-500'}`}>
                    <i className="pi pi-check-circle mr-2 text-xl"></i>Thành Công
                </div>

                {/* <div className="items-center">
                    <div className="flex items-center space-x-2">
                        <Link to='/'>
                            <button className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform -rotate-90" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M10 3a1 1 0 01.707.293l3 3a1 1 0 11-1.414 1.414L11 5.414V14a1 1 0 11-2 0V5.414L7.707 7.707A1 1 0 116.293 6.293l3-3A1 1 0 0110 3z" />
                                </svg>
                                Tiếp tục mua sắm
                            </button>
                        </Link>
                    </div>
                </div> */}
            </div>

            {/* Nội dung thay đổi theo route */}
            <div className="w-full p-10">
                <Outlet />
            </div>
        </div>
    );
}
