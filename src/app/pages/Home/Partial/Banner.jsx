import React, { useEffect, useState } from 'react';
import { Carousel } from 'primereact/carousel';
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader.jsx';

export default function Banner() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);

    const bannerTemplate = (banner) => (
        <div className="p-2 flex justify-center items-center">
            <img src={banner.image_url} className="rounded-lg " />
        </div>
    );

    useEffect(() => {
        const fetchDataCarousel = async () => {
            setLoading(true);

            // Mock Data - Simulating the API response
            const mockBanners = [
                {
                    id: 101072,
                    title: "https://tiki.vn/khuyen-mai/sieu-sale-77?waypoint_id=b1g1",
                    image_url: "https://salt.tikicdn.com/ts/tikimsp/4b/ab/b2/171d8406300fc3122a71da6e87d9a619.png",
                    url: "https://tiki.vn/khuyen-mai/sieu-sale-77?itm_campaign=HMP_YPD_TKA_BNA_UNK_ALL_ALL_UNK_UNK_UNK_TMSX.34fbc96d-c16f-4907-920e-94c334c69a36&itm_medium=CPD&itm_source=tiki-ads&tmsx=34fbc96d-c16f-4907-920e-94c334c69a36&waypoint_id=b1g1"
                },
                {
                    id: 101097,
                    title: "https://tiki.vn/khuyen-mai/khuyen-mai-hot-lam-dep-suc-khoe?waypoint_id=giadinh",
                    image_url: "https://salt.tikicdn.com/ts/tikimsp/65/97/f4/583b3c6b9a1352dc1abf6042336ee345.png",
                    url: "https://tiki.vn/khuyen-mai/khuyen-mai-hot-lam-dep-suc-khoe?itm_campaign=HMP_YPD_TKA_BNA_UNK_ALL_ALL_UNK_UNK_UNK_TMSX.de339bde-32a0-4cfd-a57d-89ea3492622b&itm_medium=CPD&itm_source=tiki-ads&tmsx=de339bde-32a0-4cfd-a57d-89ea3492622b&waypoint_id=giadinh"
                },
                {
                    id: 101098,
                    title: "https://tiki.vn/khuyen-mai/top-dien-thoai-may-tinh-bang?waypoint_id=tikichon",
                    image_url: "https://salt.tikicdn.com/ts/tikimsp/5b/d4/ff/87e691e34022ff35894045e09765f0cd.png",
                    url: "https://tiki.vn/khuyen-mai/top-dien-thoai-may-tinh-bang?itm_campaign=HMP_YPD_TKA_BNA_UNK_ALL_ALL_UNK_UNK_UNK_TMSX.5727bb44-4566-43e6-bb3c-7fa30e836a00&itm_medium=CPD&itm_source=tiki-ads&tmsx=5727bb44-4566-43e6-bb3c-7fa30e836a00&waypoint_id=tikichon"
                }
            ];

            // Simulate the state update with mock data
            setBanners(mockBanners);
            setLoading(false);
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
