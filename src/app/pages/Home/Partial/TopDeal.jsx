import React, { useEffect, useState } from 'react';
import { Carousel } from 'primereact/carousel';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Rating } from 'primereact/rating';
import { getData } from '../../../context/api';
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader.jsx';
import FormattedSold from '../FormattedSold.jsx';
import { Link } from 'react-router-dom';
import '../SwiperStyle.css';
import API_BASE_URL from '../../../apiConfig.js';

const itemTemplate = (item) => {
    return (
        <Link to={`/detail/${item.id}`}>
            <div className="flex flex-col justify-center bg-white border border-gray-200 items-center rounded-lg p-3 m-1">
                <div className="justify-center items-center">
                    <div className="relative">
                        <img src={item.icon} alt="icon" className="absolute bottom-0 left-0" />
                        <img src={item.image} alt={item.name} className="h-full object-cover rounded-lg mb-4" />
                    </div>
                    <div className="text-left">
                        <div className="max-w-60 min-h-10 line-clamp-2 text-sm text-ellipsis hover:text-blue-600 transition-colors mb-2">
                            {item.brand_name}
                        </div>
                        <div className="min-h-[25px]">
                            <span className="text-sm text-gray-500 line-through italic mb-2">{item.oldPrice}</span>
                            <span className={`ml-3 mb-2 rounded-sm ${item.discount ? 'bg-[#ff424e] px-1 py-1 text-xs text-white' : 'bg-transparent'}`}>
                                {item.discount}
                            </span>
                        </div>
                        <div className="text-xl font-bold text-[#ff424e] mb-2">{item.price}</div>
                        <div className="card flex justify-between">
                            <Rating value={item.rate} disabled cancel={false} />
                            <div className="text-sm text-gray-600">Đã bán <FormattedSold sold={item.sold} /></div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default function TopDeal() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await getData(`${API_BASE_URL}/product/kham-pha-mua-sam`);
                console.log("Kết quả API:", res);

                // Xác định mảng dữ liệu đúng
                const rawItems = Array.isArray(res.data)
                    ? res.data
                    : Array.isArray(res.data.data)
                    ? res.data.data
                    : [];

                if (rawItems.length === 0) {
                    console.warn("Không tìm thấy danh sách sản phẩm.");
                    setProducts([]);
                    return;
                }

                const items = rawItems.map((item) => ({
                    id: item.productid,
                    icon: "https://via.placeholder.com/40",
                    image: item.image || "https://via.placeholder.com/150",
                    oldPrice:
                        item.price && item.discount_price && item.price !== item.discount_price
                            ? `${item.price.toLocaleString()}đ`
                            : "",
                    price: item.discount_price
                        ? `${item.discount_price.toLocaleString()}đ`
                        : `${item.price.toLocaleString()}đ`,
                    discount: item.discount_percent ? `-${item.discount_percent}%` : "",
                    rate: item.rating_avg || 0,
                    rating_count: item.rating_count || 0,
                    brand_name: item.productname || "Không rõ",
                    sold: item.sold_quantity || 0
                }));

                setProducts(items);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu sản phẩm:", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="top-deal">
            <div className="flex justify-between">
                <div className="flex">
                    <div className="p-2 bg-red-300 rounded-bl-full"></div>
                    <h2 className="text-2xl bg-red-300 p-3 font-bold border-b-4 border-red-400 text-gray-800 text-center mb-4 rounded-tr-full rounded-br-full">
                        Khám Phá Mua Sắm
                    </h2>
                </div>
            </div>
            {loading ? (
                <div className="grid grid-cols-5 gap-4">
                    <SkeletonLoader type="card" count={5} width="100%" height="300px" />
                </div>
            ) : (
                <Carousel
                    value={products}
                    itemTemplate={itemTemplate}
                    numVisible={5}
                    numScroll={5}
                    circular={true}
                />
            )}
        </div>
    );
}
