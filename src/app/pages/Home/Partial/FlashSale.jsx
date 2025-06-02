import React, { useEffect, useState } from 'react';
import { Carousel } from 'primereact/carousel';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { getData } from '../../../context/api';
import { Link } from 'react-router-dom';
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader.jsx';
import CountTime from '../FlashSaleComponent/CountTime.jsx';
import ProgressBar from '../FlashSaleComponent/ProgressBar.jsx';
import API_BASE_URL from '../../../apiConfig.js';

const itemTemplate = (item) => {
    return (
        <Link to={`/detail/${item.id}`} >
            <div className="flex flex-col justify-center bg-white items-center rounded-lg p-3 m-1">
                <div className="justify-center items-center">
                    <div className="relative">
                        <img src={item.image} alt={item.brand_name} className="h-full object-cover rounded-lg mb-4" />
                    </div>
                    <div className="text-left">
                        <div className='max-w-60 min-h-10 line-clamp-2 text-sm text-ellipsis hover:text-blue-600 transition-colors mb-2'>
                            {item.brand_name}
                        </div>
                        <div className='min-h-[25px]'>
                            <span className="text-sm text-gray-500 line-through italic mb-2">{item.oldPrice}</span>
                            <span className={`ml-2 mb-2 rounded-sm ${item.discount ? 'bg-[#ff424e] px-1 py-1 text-xs text-white' : 'bg-transparent'}`}>
                                {item.discount}
                            </span>
                        </div>
                        <div className="text-xl font-bold text-[#ff424e] mb-2">{item.price}</div>
                        <div>
                            <ProgressBar qty={item.qty} qty_ordered={item.qty_ordered} progress_text={item.progress_text} />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default function FlashSale() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [time, setTime] = useState(0);

    const fetchDataFlashSale = async () => {
        setLoading(true);

        try {
            const res = await getData(`${API_BASE_URL}/api/Products/sale?page=1&pageSize=10&sortBy=productid&sortOrder=asc`);

            const rawProducts = res?.data?.data?.products || [];

            const extractedItems = rawProducts.map(item => ({
                id: item.productid,
                image: item.image,
                brand_name: item.brand || "Không rõ",
                price: item.discount_price && item.discount_price > 0
                    ? `${item.discount_price.toLocaleString()}đ`
                    : item.price
                        ? `${item.price.toLocaleString()}đ`
                        : "",
                oldPrice: item.discount_price && item.discount_price > 0
                    ? item.price && item.price !== item.discount_price
                        ? `${item.price.toLocaleString()}đ`
                        : ""
                    : "",
                discount: item.discount_percent && item.discount_percent > 0
                    ? `-${item.discount_percent}%`
                    : "",
                rate: item.rating_avg,
                qty: item.stock_quantity || 0,
                qty_ordered: item.sold_quantity || 0,
                progress_text: `${item.sold_quantity || 0} đã bán`,
            }));

            setItems(extractedItems);
            setTime(0);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataFlashSale();
    }, []);

    return (
        <div>
            <div className='flex mb-2 '>
                <h2 className="text-2xl font-bold flex items-center">Flash Sale</h2>
                {time > 0 && <CountTime targetTime={time} onExpire={fetchDataFlashSale} />}
            </div>

            {loading ? (
                <div className="grid grid-cols-5 gap-4">
                    <SkeletonLoader type="card" count={5} width='100%' height='300px' />
                </div>
            ) : (
                <Carousel
                    value={items}
                    itemTemplate={itemTemplate}
                    numVisible={5}
                    numScroll={5}
                    circular={true}
                />
            )}
        </div>
    );
}
