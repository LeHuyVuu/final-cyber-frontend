import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader.jsx'; // Import Skeleton Loader
import { getData } from "../../../context/api";

export default function Branch() {
  const [branch, setBranch] = useState([]);
  const [loading, setLoading] = useState(false);

  // Danh sách thương hiệu nổi bật
  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const res = await getData("https://tka.tiki.vn/widget/api/v1/banners-group?group=msp_widget_banner_premium");
        // console.log(res.data.data);

        // Lấy image_url từ tất cả các phần tử trong mảng banners
        const data = res.data.data.map((item) => ({
          title: item.title,
          imageUrls: item.banners.map((banner) => banner.image_url),  // Lấy image_url từ từng banner
        }));
        setBranch(data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu danh mục:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  return (
    <div className="">
      {loading ? (
        // Hiển thị Skeleton khi dữ liệu đang tải
        <SkeletonLoader type="image" count={1} width="100%" height="400px" />
      ) : (
        <Swiper
          slidesPerView={1} // 1 logo trên mỗi slide
          spaceBetween={20} // Khoảng cách giữa các item
          autoplay={{ delay: 2500, disableOnInteraction: false }} // Tự động trượt
          pagination={{ clickable: true }}
          navigation={false} // Nút next/prev
          modules={[Autoplay, Pagination, Navigation]}
          breakpoints={{
            1024: { slidesPerView: 1 },
            768: { slidesPerView: 1 },
            640: { slidesPerView: 1 },
            320: { slidesPerView: 1 },
          }}
          className="mySwiper"
        >
          {branch.map((brand, index) => (
            brand.imageUrls.map((imgUrl, idx) => (
              <SwiperSlide key={index + '-' + idx}>
                <div className="flex justify-center items-center bg-gray-200 rounded-lg">
                  <img src={imgUrl} alt={`Brand Image ${idx}`} className="h-auto object-contain" />
                </div>
              </SwiperSlide>
            ))
          ))}
        </Swiper>
      )}
    </div>
  );
}
