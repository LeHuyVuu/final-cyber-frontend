import { Skeleton } from 'primereact/skeleton'; // Nếu sử dụng PrimeReact Skeleton

const SkeletonLoader = ({ type = 'text', count = 1, width = '100%', height = 30 }) => {
    const renderSkeleton = () => {
        switch (type) {
            case 'text':
                return <Skeleton width={width} height={height} />;
            case 'image':
                return <Skeleton width={width} height={height} />;
            case 'card':
                return (
                    <div className="card">
                        <Skeleton width={width} height={height} />  {/* Hình ảnh chính */}
                        <Skeleton width="60%" height="20px" className="mt-2" />  {/* Tiêu đề */}
                        <Skeleton width="40%" height="20px" className="mt-1" />  {/* Thương hiệu */}
                        <Skeleton width="100%" height="20px" className="mt-2" />  {/* Giá cũ */}
                        <Skeleton width="60%" height="20px" className="mt-1" />  {/* Giá giảm */}
                        <Skeleton width="50%" height="20px" className="mt-2" />  {/* Đánh giá */}
                    </div>
                );
            default:
                return <Skeleton width={width} height={height} />;
        }
    };

    return (
        <>
            {Array(count)
                .fill(0)
                .map((_, index) => (
                    <div key={index}>{renderSkeleton()}</div>
                ))}
        </>
    );
};

export default SkeletonLoader;
