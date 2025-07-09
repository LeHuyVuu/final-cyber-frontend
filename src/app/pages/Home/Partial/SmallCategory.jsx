import React, { useEffect, useState } from 'react';
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader.jsx';

export default function SmallCategory() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Giả lập tải dữ liệu từ API bằng mock data
        setLoading(true);
        setTimeout(() => {
            const mockData = {
                items: [
                    {
                        name: "Thăng hạng TikiVIP",
                        thumbnail_url: "https://salt.tikicdn.com/ts/upload/2b/e0/e7/05cf3f6008c57d97c9f5d8759c68633e.png",
                        url: "https://tiki.vn/tikivip"
                    },
                    {
                        name: "Tiki sáng nay rẻ",
                        thumbnail_url: "https://salt.tikicdn.com/ts/upload/1c/1d/ab/a8853ac90be1473f095ee2437bab90ab.png",
                        url: "https://ti.ki/7GFb4UYO/TIKISANGNAYRE2025"
                    },
                    {
                        name: "Tiki Trading",
                        thumbnail_url: "https://salt.tikicdn.com/ts/upload/72/8d/23/a810d76829d245ddd87459150cb6bc77.png",
                        url: "https://ti.ki/IySZvJ56/TIKITRADING"
                    },
                    {
                        name: "Coupon siêu hot",
                        thumbnail_url: "https://salt.tikicdn.com/ts/upload/8b/a4/9f/84d844f70e365515b6e4e3e745dac1d5.png",
                        url: "https://ti.ki/oz36lwyk/MAGIAMGIA"
                    },
                    {
                        name: "Xả kho giảm nửa giá",
                        thumbnail_url: "https://salt.tikicdn.com/ts/upload/a5/d8/06/cb6ff520f12973013c81a8b14ad5e5b3.png",
                        url: "https://ti.ki/FjtU7Qzp/XAKHOGIAMSOC"
                    },
                    {
                        name: "Combo siêu tiết kiệm",
                        thumbnail_url: "https://salt.tikicdn.com/ts/upload/8a/39/6b/4e1827112e313e1c0540acb924f9e95b.png",
                        url: "https://ti.ki/TeCMdbLX/COMBOTIETKIEM"
                    },
                    {
                        name: "Đối phó thời tiết",
                        thumbnail_url: "https://salt.tikicdn.com/ts/upload/c6/9c/4b/b62e8fe17cd7e18e2f2dcda2e1854387.png",
                        url: "https://ti.ki/qfNYamzY/CHONGNANGMUAHE"
                    },
                    {
                        name: "Top Sách bán chạy",
                        thumbnail_url: "https://salt.tikicdn.com/ts/upload/4a/47/32/96cd0a5ab8f34621667f47a05e08d8b0.png",
                        url: "https://ti.ki/Lg4D3ilX/TOPSACHBANCHAY"
                    },
                    {
                        name: "Tân trang tổ ấm",
                        thumbnail_url: "https://salt.tikicdn.com/ts/upload/37/0c/a9/a5c66f230d75631d048ec1e0fc5d5e12.png",
                        url: "https://tiki.vn/bo-suu-tap/f5-to-am-b13758"
                    },
                    {
                        name: "Du lịch sành điệu",
                        thumbnail_url: "https://salt.tikicdn.com/ts/upload/2c/22/e0/4c3abf0157114af9010091d9ab9abdd5.png",
                        url: "https://tiki.vn/khuyen-mai/du-lich-chanh-sa"
                    }
                ]
            };

            setCategories(mockData.items);
            setLoading(false);
        }, 1000); // Mô phỏng việc tải dữ liệu trong 1 giây
    }, []);

    return (
        <div className="flex overflow-x-auto space-x-4 p-2 justify-between shadow-xl rounded-lg bg-white">
            {categories.map((category, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center  min-w-[100px] hover:scale-105 transition-transform duration-200"
                >
                    {/* Skeleton cho hình ảnh khi loading */}
                    {loading ? (
                        <div className=" grid grid-cols-9 gap-4 w-12 h-12">
                            <SkeletonLoader type="image" count={9} width="100%" height="100%" />
                        </div>
                    ) : (
                        <img
                            src={category.thumbnail_url}
                            alt={category.name}
                            className="w-12 h-12 rounded-lg object-contain"
                        />
                    )}

                    {/* Skeleton cho tên danh mục khi loading */}
                    {loading ? (
                        <div className="grid grid-cols-9 gap-4 w-full mt-2">
                            <SkeletonLoader type="text" count={9} width="100%" height="20px" />
                        </div>
                    ) : (
                        <span className="text-sm mt-2 text-center">{category.name}</span>
                    )}
                </div>
            ))}
        </div>
    );
}
