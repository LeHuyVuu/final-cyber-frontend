import { useEffect, useState } from "react";
import { Carousel } from "primereact/carousel";
import { getBannersByCategory, getData } from "../../../context/api";
import "../../Home/SwiperStyle.css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const bannerTemplate = (banner) => (
    <div className="relative group overflow-hidden rounded-xl shadow-xl transition-transform duration-300 hover:scale-[1.02] mx-2">
      <img
        src={banner.image}
        // alt={banner.title}
        className="w-full h-[350px] object-cover"
      />
      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-8"> */}
        {/* <h3 className="text-white text-3xl font-bold mb-4 transform transition-transform duration-300 group-hover:translate-x-2">
          {banner.title}
        </h3> */}
        {/* <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all duration-300 w-fit transform group-hover:translate-x-2 hover:shadow-lg">
          Mua ngay
        </button> */}
      {/* </div> */}
    </div>
  );

  const skeletonTemplate = () => (
    <div className="animate-pulse mx-2">
      <div className="bg-gray-300 rounded-xl h-[350px] w-full"></div>
    </div>
  );

  useEffect(() => {
    const fetchDataCarousel = async () => {
      setIsLoading(true);
      try {
        const extractedBanners = await getBannersByCategory("27582", "dam-dang-xoe");
        // console.log(extractedBanners);
        setBanners(extractedBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataCarousel();
  }, []);
// console.log("banners", banners);
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 pl-2 border-l-4 border-blue-500">
        Khám phá sản phẩm mới
      </h2>
      <Carousel
        value={isLoading ? Array(4).fill({}) : banners}
        itemTemplate={isLoading ? skeletonTemplate : bannerTemplate}
        numVisible={2}
        numScroll={1}
        circular
        autoplayInterval={5000}
        className="custom-carousel"
      />
    </div>
  );
};

// const CategoryExplore = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       <Banner />
//     </div>
//   );
// };

export default Banner;
