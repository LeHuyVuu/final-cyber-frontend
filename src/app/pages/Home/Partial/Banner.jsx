import React, { useEffect, useState } from 'react';
import { Carousel } from 'primereact/carousel';
import { getData } from '../../../context/api';
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader.jsx';


export default function Banner() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);


    const bannerTemplate = (banner) => (
        <div className="p-2 flex justify-center items-center">
            <img src={banner.image_url} alt={banner.title} className="rounded-lg " />
        </div>
    );

    useEffect(() => {
        const fetchDataCarousel = async () => {
            setLoading(true);
            
            try {
                // Fetching data from API, replace with your API endpoint
                const res = await getData("https://tka.tiki.vn/widget/api/v1/banners-group?group=banner_carousel_2_8");
                const bannersData = res.data.data[0].banners;

                // Map and extract necessary fields from each banner
                const extractedBanners = bannersData.map(banner => ({
                    id: banner.id,
                    title: banner.title,
                    image_url: banner.image_url, // Ensure to use the correct field for image URL
                    url: banner.url,
                }));

                // Update state with the extracted banner data
                setBanners(extractedBanners);
            } catch (error) {
                console.error('Error fetching banners:', error);
            }finally {
                setLoading(false);
            }
        };

        fetchDataCarousel();
    }, []);

    return (
        <div>
            {loading ? (
                 <div className="grid grid-cols-2 gap-4">
                 <SkeletonLoader type="image" count={2} width="100%" height="350px" />
             </div>
            ) : (
            <Carousel value={banners}
                itemTemplate={bannerTemplate}
                numVisible={2}
                numScroll={1}
                circular
                autoplayInterval={4000} />
            )}
        </div>
    );
}
