import React from 'react';

const FormattedSold = ({ sold }) => {
    // Hàm chuyển đổi số sang định dạng k, k9, v.v.
    const formatSold = (sold) => {
        if (sold === undefined || sold === null || isNaN(sold)) {
            return '0'; // Handle invalid or missing data
        }

        if (sold >= 1000) {
            const valueInK = (sold / 1000).toFixed(1); // Chia số bán cho 1000 và làm tròn tới 1 chữ số
            return valueInK.replace(/\.0$/, '') + 'k';  // Loại bỏ .0 nếu không cần thiết
        }
        return sold.toString();
    };

    return <span>{formatSold(sold)}</span>;
};

export default FormattedSold;
