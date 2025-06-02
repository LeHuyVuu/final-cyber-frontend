import React, { useEffect, useState } from 'react';
import { getData } from '../../../context/api';
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader.jsx';

export default function SmallCategory() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);

            try {
                const res = await getData("https://api.tiki.vn/raiden/v3/widgets/quick_link_v2");
                const items = res.data?.items || [];

                // Lấy ra name, thumbnail_url và url
                const simplified = items.map(item => ({
                    name: item.name,
                    image: item.thumbnail_url,
                    link: item.url,
                }));
                setCategories(simplified);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu danh mục:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
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
                            src={category.image}
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
