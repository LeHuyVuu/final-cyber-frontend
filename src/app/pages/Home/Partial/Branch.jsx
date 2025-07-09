import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import SkeletonLoader from "../../../components/SkeletonLoader/SkeletonLoader.jsx"; // Import Skeleton Loader

export default function Branch() {
  const [branch, setBranch] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data từ response API
  const mockData = [
    {
      "group": "banner_carousel_2_8",
      "banners": [
        {
          "id": 101072,
          "image_url": "https://salt.tikicdn.com/ts/tikimsp/4b/ab/b2/171d8406300fc3122a71da6e87d9a619.png"
        },
        {
          "id": 101097,
          "image_url": "https://salt.tikicdn.com/ts/tikimsp/65/97/f4/583b3c6b9a1352dc1abf6042336ee345.png"
        },
        {
          "id": 101098,
          "image_url": "https://salt.tikicdn.com/ts/tikimsp/5b/d4/ff/87e691e34022ff35894045e09765f0cd.png"
        },
        {
          "id": 101123,
          "image_url": "https://salt.tikicdn.com/ts/tikimsp/2d/60/bc/2ddc37e8e471b2981e9771dc6ab0d265.png"
        },
        {
          "id": 101108,
          "image_url": "https://salt.tikicdn.com/ts/tikimsp/32/93/f2/d64c897b8e7be26cd25ad7f6d9d3e31a.png"
        }
      ]
    }
  ];

  useEffect(() => {
    // Giả lập tải dữ liệu
    setLoading(true);
    setTimeout(() => {
      setBranch(mockData[0].banners); // Lấy dữ liệu mock
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="">
      {loading ? (
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
            <SwiperSlide key={index}>
              <div className="flex justify-center items-center bg-gray-200 rounded-lg">
                <img
                  src={brand.image_url}
                  alt={`Brand Image ${index}`}
                  className="h-auto object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
