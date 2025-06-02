import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Rating } from 'primereact/rating';
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader.jsx';
import API_BASE_URL from '../../../apiConfig.js';

export default function Trending() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const observer = useRef();

    // Fetch products data
    const fetchProducts = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/Products?page=${page}&pageSize=10&sortBy=productid&sortOrder=asc`
            );
            const res = await response.json();
            const data = res.data;

            setProducts(prev => [...prev, ...data.products]);
            setTotalPages(data.pagination.totalPages);
            setHasMore(page < data.pagination.totalPages);
        } catch (err) {
            console.error("Error fetching products:", err);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page]);

    // Intersection Observer for infinite scroll
    const lastProductRef = useRef();
    useEffect(() => {
        if (loading || !hasMore) return;

        observer.current = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 0.1 }
        );

        if (lastProductRef.current) {
            observer.current.observe(lastProductRef.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [products, loading, hasMore]);

    return (
        <div className="flex flex-col">
            {/* Content */}
            <div className="p-4">
                {loading && products.length === 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <SkeletonLoader type="card" count={5} width="100%" height="300px" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {products.map((product, index) => {
                            const isPriceEqual = product.price === product.discount_price;
                            const isLastElement = index === products.length - 1;

                            return (
                                <Link
                                    key={product.productid}
                                    to={`/detail/${product.productid}`}
                                    ref={isLastElement ? lastProductRef : null}
                                >
                                    <div className="flex flex-col p-4 rounded-lg border border-gray-200">
                                        <div className="relative">
                                            <img
                                                src={product.image}
                                                alt={product.productname}
                                                className="w-full h-full object-cover mb-4 rounded-lg"
                                            />
                                            {product.recommendation && (
                                                <span className="absolute bottom-0 left-0 bg-[#ff424e] text-white text-xs px-2 py-1 rounded">
                                                    {product.recommendation}
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <div className="max-w-60 min-h-10 line-clamp-2 text-sm text-ellipsis hover:text-blue-600 transition-colors mb-2">
                                                {product.productname}
                                            </div>
                                            <div className="min-h-[25px]">
                                                {!isPriceEqual && product.price && (
                                                    <span className="text-sm text-gray-500 line-through italic mb-2">
                                                        {product.price.toLocaleString()}đ
                                                    </span>
                                                )}
                                                {!isPriceEqual && product.discount_percent && (
                                                    <span className="ml-3 mb-2 rounded-sm bg-[#ff424e] px-1 py-1 text-xs text-white">
                                                        -{product.discount_percent}%
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xl font-bold text-[#ff424e] my-2">
                                                {product.discount_price?.toLocaleString()}đ
                                            </div>

                                            <div className="card flex justify-between">
                                                <Rating value={product.rating_avg} disabled cancel={false} />
                                                <div className="text-sm text-gray-600">
                                                    Đã bán {product.sold_quantity}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Loading indicator for additional products */}
                {loading && products.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                        <SkeletonLoader type="card" count={5} width="100%" height="300px" />
                    </div>
                )}
            </div>
        </div>
    );
}