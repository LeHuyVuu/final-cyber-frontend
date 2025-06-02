import { useState, useEffect } from "react";
import { getCategories } from "../../../context/api";
import { Link } from "react-router-dom";

const CategoryExplorer = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        // Fetch the fashion category to get its children
        const response = await getCategories(931); // 931 is "Thời trang nữ"

        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          // Get main categories
          const mainCategories = response.data.data;
          setCategories(mainCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Khám phá theo danh mục</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array(12)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-gray-300 rounded-full mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Khám phá theo danh mục</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="flex flex-col items-center group"
            >
              <div className="w-20 h-20 overflow-hidden rounded-full bg-white shadow-sm mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 border border-gray-100">
                <img
                  src={
                    category.thumbnail_url ||
                    "https://salt.tikicdn.com/assets/img/image.svg"
                  }
                  alt={category.name}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <span className="text-sm font-medium text-center text-gray-700 group-hover:text-blue-600 transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryExplorer;
