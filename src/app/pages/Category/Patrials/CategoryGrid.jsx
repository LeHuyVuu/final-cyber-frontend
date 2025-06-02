import { useState, useEffect } from "react";
import { getCategories } from "../../../context/api";
import { Link } from "react-router-dom";

const CategoryGrid = ({ parentId = 931 }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);

  // Fetch main categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await getCategories(parentId);
        setCategories(response.data.data);

        // Pre-select the first category if available
        if (response.data.data && response.data.data.length > 0) {
          setSelectedCategory(response.data.data[0]);
          setSubcategories(response.data.data[0].children || []);
        }
      } catch (err) {
        setError("Không thể tải danh mục sản phẩm");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [parentId]);

  // Handle category selection
  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);

    // If already have children, use them
    if (category.children && category.children.length > 0) {
      setSubcategories(category.children);
    } else {
      // Otherwise fetch subcategories
      try {
        setLoading(true);
        const response = await getCategories(category.id);
        if (response.data.data && response.data.data.length > 0) {
          setSubcategories(response.data.data[0].children || []);
        } else {
          setSubcategories([]);
        }
      } catch (err) {
        console.error("Error fetching subcategories:", err);
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Khám phá theo danh mục
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-white p-4 rounded-lg shadow-sm flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-gray-300 rounded-full mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
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

      {/* Main categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`bg-white p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-300 flex flex-col items-center ${
              selectedCategory?.id === category.id
                ? "ring-2 ring-blue-500"
                : "hover:shadow-md"
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            <div className="w-24 h-24 flex justify-center items-center mb-3 overflow-hidden rounded-full bg-gray-100 p-2">
              <img
                src={
                  category.thumbnail_url ||
                  "https://salt.tikicdn.com/assets/img/image.svg"
                }
                alt={category.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-sm font-medium text-center text-gray-700">
              {category.name}
            </div>
          </div>
        ))}
      </div>

      {/* Subcategories section */}
      {selectedCategory && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {selectedCategory.name}
            </h3>
            {selectedCategory.product_count > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                ({selectedCategory.product_count.toLocaleString()} sản phẩm)
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {loading ? (
              // Loading skeleton for subcategories
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={`subcat-skeleton-${index}`}
                    className="animate-pulse bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3 mx-auto"></div>
                  </div>
                ))
            ) : subcategories.length > 0 ? (
              // Display subcategories
              subcategories.map((subcat) => (
                <Link
                  key={subcat.id}
                  to={`/category/${subcat.id}`}
                  className="group bg-gray-50 p-3 rounded-lg hover:bg-blue-50 transition-colors flex flex-col items-center"
                >
                  <div className="w-16 h-16 mb-2 overflow-hidden rounded-full bg-white p-1 transition-transform duration-300 group-hover:scale-110">
                    <img
                      src={
                        subcat.thumbnail_url ||
                        "https://salt.tikicdn.com/assets/img/image.svg"
                      }
                      alt={subcat.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-xs font-medium text-gray-700 text-center group-hover:text-blue-600">
                    {subcat.name}
                  </div>
                  {subcat.product_count > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {subcat.product_count.toLocaleString()} sản phẩm
                    </div>
                  )}
                </Link>
              ))
            ) : (
              // No subcategories found
              <div className="col-span-full text-center py-4 text-gray-500">
                Không có danh mục con
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;
