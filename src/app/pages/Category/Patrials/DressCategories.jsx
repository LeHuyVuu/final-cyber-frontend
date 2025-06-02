import { useState, useEffect } from "react";
import { getCategories } from "../../../context/api";
import { Link } from "react-router-dom";

const DressCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDressCategories = async () => {
      try {
        setLoading(true);
        // 941 is the ID for "Đầm nữ" from the Tiki API
        const response = await getCategories(941);
        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          const dressCategory = response.data.data[0];
          setCategories(dressCategory.children || []);
        }
      } catch (err) {
        console.error("Error fetching dress categories:", err);
        setError("Không thể tải danh mục váy đầm");
      } finally {
        setLoading(false);
      }
    };

    fetchDressCategories();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Khám phá theo danh mục
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="animate-pulse flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-gray-300 rounded-full mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Khám phá theo danh mục
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className="flex flex-col items-center group"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-3 transition-transform duration-300 group-hover:scale-105">
              <img
                src={
                  category.thumbnail_url ||
                  "https://salt.tikicdn.com/assets/img/image.svg"
                }
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-center text-gray-700 group-hover:text-blue-600 transition-colors">
              {category.name}
            </span>
            {category.product_count > 0 && (
              <span className="text-xs text-gray-500 mt-1">
                {category.product_count.toLocaleString()} sản phẩm
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DressCategories;
