import React, { useState } from 'react';

import Data from './Menu.json';

export default function Menu() {
    const [hover, setHover] = useState(false);

    const categories = [
        { name: 'Trang Điểm', subcategories: [] },
        { name: 'Nước Hoa', subcategories: ['Nước Hoa Cao Cấp'] },
        { name: 'Mỹ Phẩm High-End', subcategories: ['Mỹ Phẩm Cao Cấp', 'Nước Hoa Cao Cấp'] },
        { name: 'Chăm Sóc Da Mặt', subcategories: [] },
        { name: 'Chăm Sóc Tóc', subcategories: [] },
    ];

    const handleMouseEnter = () => {
        setHover(true);
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    return (
        <div className="mainmenu block justify-center items-center w-fit"
            onMouseEnter={() => handleMouseEnter()}
            onMouseLeave={handleMouseLeave}
        >
            {/* <pre>{JSON.stringify(Data, null, 0).replace(/,\n/g, ',').replace(/],/g, '],\n')}</pre> */}
            {/* <pre>{JSON.stringify(Data, null, 0).substring(0, 100)}</pre> */}
            {/* <h1>{Data.menu_block.items[0].text}</h1> */}
            <div className="flex justify-center items-center gap-2">
                <i className='fa-solid fa-bars'></i>
                <span>Danh mục</span>
            </div>
            {hover &&
                <nav className="block absolute left-1/2 top-[100px] -translate-x-1/2 w-[800px] bg-white shadow-xl mt-2 py-6 px-8 rounded-xl z-10 transition-all duration-300 transform origin-top">
                    <ul className="flex flex-col justify-center gap-2 mt-2 items-start text-gray-500 text-sm font-semibold">
                        {Data.menu_block.items.map((items, index) => (
                            <li key={index} className="relative group">
                                <div className="hover:text-blue-500 cursor-pointer transition-colors duration-300 flex items-center">
                                    <span>{items.text}</span>
                                    <svg
                                        className="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 w-[800px] opacity-0 invisible group-hover:opacity-100 group-hover:visible bg-white shadow-xl mt-2 py-6 px-8 rounded-xl z-10 transition-all duration-300 transform origin-top scale-y-0 group-hover:scale-y-100">
                                    <div className="grid grid-cols-4 gap-8">
                                        {/* Đặt đầu vòng lặp 1 ở đây */}
                                        <div>
                                            <h3 className="font-bold text-gray-800 mb-4 text-base">
                                                Điện lạnh
                                            </h3>
                                            <ul className="space-y-2">
                                                {/* Đặt đầu vòng lặp 2 ở đây */}
                                                <li className="hover:text-blue-500 cursor-pointer transition-colors duration-300 text-gray-600 hover:translate-x-1">
                                                    Tủ lạnh
                                                </li>
                                                <li className="hover:text-blue-500 cursor-pointer transition-colors duration-300 text-gray-600 hover:translate-x-1">
                                                    Máy giặt
                                                </li>
                                                <li className="hover:text-blue-500 cursor-pointer transition-colors duration-300 text-gray-600 hover:translate-x-1">
                                                    Điều hòa
                                                </li>
                                                <li className="hover:text-blue-500 cursor-pointer transition-colors duration-300 text-gray-600 hover:translate-x-1">
                                                    Tủ đông
                                                </li>
                                                {/* Kết thúc vòng lặp 2 */}
                                            </ul>
                                        </div>
                                        {/* Kết thúc vòng lặp 1 */}

                                        {/* Đoạn này bỏ */}
                                        <div>
                                            <h3 className="font-bold text-gray-800 mb-4 text-base">
                                                Điện tử
                                            </h3>
                                            <ul className="space-y-2">
                                                <li className="hover:text-blue-500 cursor-pointer transition-colors duration-300 text-gray-600 hover:translate-x-1">
                                                    Tivi
                                                </li>
                                                <li className="hover:text-blue-500 cursor-pointer transition-colors duration-300 text-gray-600 hover:translate-x-1">
                                                    Loa
                                                </li>
                                                <li className="hover:text-blue-500 cursor-pointer transition-colors duration-300 text-gray-600 hover:translate-x-1">
                                                    Amply
                                                </li>
                                                <li className="hover:text-blue-500 cursor-pointer transition-colors duration-300 text-gray-600 hover:translate-x-1">
                                                    Đầu kỹ thuật số
                                                </li>
                                            </ul>
                                        </div>
                                        {/* Đoạn này bỏ */}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </nav>
            }
        </div>
    );
};
