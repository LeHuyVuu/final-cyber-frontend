import { useState, useEffect } from "react";
import { getCategories } from "../../../context/api";
import { Link, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation, Autoplay } from "swiper/modules";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "../../Home/SwiperStyle.css";
import axios from "axios";

const CategoryBrowser = ({ categoryId }) => {
  const [parentCategories, setParentCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const location = useLocation();
  const currentUrlKey = new URLSearchParams(location.search).get("urlKey");
  const normalizedCategoryId = categoryId?.toString().replace(/^c/, '') || "";
  const [isLeafCategory, setIsLeafCategory] = useState(false);

  useEffect(() => {
  
    // console.log("categoryId", categoryId);
    if (isLeafCategory && normalizedCategoryId) {
      setIsLeafCategory(false);
    }
  }, [location, normalizedCategoryId]);

  useEffect(() => {
    if (isLeafCategory) return;

    const fetchParentCategories = async () => {
      setLoading(true);
      try {
        const response = await getCategories(normalizedCategoryId);
        const responeLeaf = await axios.get(`https://tiki.vn/api/v2/categories/${categoryId}?include=ancestors,children`);
        setIsLeafCategory(responeLeaf.data.is_leaf);
        // console.log("response.data", response.data);
        if (response.data) {
          // setIsLeafCategory(response.data.is_leaf);
          // Add this line to update parentCategories
          setParentCategories(response.data.data || []);

          if (normalizedCategoryId) {
            const currentCategory = response.data.data.find(
              (cat) => cat.id.toString().replace(/^c/, '') === normalizedCategoryId
            );
            if (currentCategory) {
              setSelectedCategory(currentCategory);
              handleCategoryClick(currentCategory);
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải danh mục cha:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParentCategories();
  }, [normalizedCategoryId, isLeafCategory, categoryId]);

// Handle category selection
  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setLoadingSubcategories(true);

    try {
      const response = await getCategories(category.id);
      console.log("Subcategories response:", response.data);

      if (response.data && response.data.data) {
        if (response.data.data.length > 0) {
          const categoryData = response.data.data[0];
          console.log("Category data:", categoryData);
          // Check if category is a leaf using is_leaf property
          if (categoryData.is_leaf === true) {
            setIsLeafCategory(true);
            setSubcategories([]);
          } else if (categoryData.children && categoryData.children.length > 0) {
            setSubcategories(categoryData.children);
            setIsLeafCategory(false);
          } else {
            if (category.children && category.children.length > 0) {
              setSubcategories(category.children);
              setIsLeafCategory(false);
            } else {
              setSubcategories([]);
              setIsLeafCategory(true);
            }
          }
        } else if (category.is_leaf === true) {
          setIsLeafCategory(true);
          setSubcategories([]);
        } else if (category.children && category.children.length > 0) {
          setSubcategories(category.children);
          setIsLeafCategory(false);
        } else {
          setSubcategories([]);
          setIsLeafCategory(true);
        }
      } else if (category.is_leaf === true) {
        setIsLeafCategory(true);
        setSubcategories([]);
      } else {
        setSubcategories([]);
        setIsLeafCategory(true);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh mục con:", error);
      if (category.is_leaf === true) {
        setIsLeafCategory(true);
        setSubcategories([]);
      } else if (category.children && category.children.length > 0) {
        setSubcategories(category.children);
        setIsLeafCategory(false);
      } else {
        setSubcategories([]);
        setIsLeafCategory(true);
      }
    } finally {
      setLoadingSubcategories(false);
    }
  };

  if (isLeafCategory) {
    return null;
  }

  const renderSkeletons = () => {
    return Array(12)
      .fill(0)
      .map((_, index) => (
        <SwiperSlide key={`skeleton-${index}`} className="category-slide">
          <div className="flex flex-col items-center p-4 rounded-lg animate-pulse">
            <div className="w-20 h-20 rounded-full bg-gray-300 mb-3"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
        </SwiperSlide>
      ));
  };

  
  if (loading) {
    if(isLeafCategory ) {
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 pl-2 border-l-4 border-blue-500">
          Khám phá theo danh mục
        </h2>
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
    );
  }
}

  return (
    <div className="bg-white py-8">
    <div className="container mx-auto px-4 py-8">
      {(!selectedCategory || (selectedCategory && subcategories.length > 0)) ? (
        <h2 className="text-3xl font-bold mb-8 text-gray-800 pl-2 border-l-4 border-blue-500">
          Khám phá theo danh mục
        </h2>
      ) : null}

      <Swiper
        slidesPerView={4}
        grid={{ rows: 2, fill: "row" }}
        spaceBetween={20}
        navigation={true}
        modules={[Grid, Navigation, Autoplay]}
        // autoplay={{
        //   delay: 3000,
        //   disableOnInteraction: false,
        // }}
        breakpoints={{
          1280: { slidesPerView: 6, grid: { rows: 2 } },
          1024: { slidesPerView: 4, grid: { rows: 2 } },
          768: { slidesPerView: 3, grid: { rows: 2 } },
          480: { slidesPerView: 2, grid: { rows: 2 } },
        }}
        className={`category-swiper ${(!selectedCategory || (selectedCategory && subcategories.length > 0)) ? 'mb-10' : ''}`}
      >
        {parentCategories.map((category, index) => (
          <SwiperSlide key={`parent-category-${category.id}-${index}`} className="category-slide">
            <Link
              to={`/category/${category.id.toString().replace(/^c/, '')}?urlKey=${category.url_key}`}
              className={` cursor-pointer flex flex-col items-center p-4 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 group ${
                selectedCategory?.id === category.id
                  ? "bg-blue-50 shadow-md"
                  : ""
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              <div
                className={`w-20 h-20 overflow-hidden rounded-full bg-gray-100 mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                  selectedCategory?.id === category.id
                    ? "ring-2 ring-blue-500 ring-offset-2"
                    : ""
                }`}
              >
                <img
                  src={
                    category.thumbnail_url ||
                    "https://salt.tikicdn.com/assets/img/image.svg"
                  }
                  alt={category.name}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <span
                className={`text-sm font-medium text-center ${
                  selectedCategory?.id === category.id
                    ? "text-blue-600"
                    : "text-gray-700 group-hover:text-blue-600"
                } transition-colors duration-300`}
              >
                {category.name}
              </span>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </div>
);
};

export default CategoryBrowser;
