import React from 'react';

const ProgressBar = ({ qty, qty_ordered, progress_text }) => {
  // Tính toán phần trăm đã bán
  const percent = (qty_ordered / qty) * 100;

  // Kiểm tra nếu progress_text là "Vừa mở bán" và qty_ordered > 0, thay đổi progress_text
  const updatedProgressText = (progress_text === "Vừa mở bán" && qty_ordered > 0)
    ? `Đã bán ${qty_ordered}`
    : progress_text;

  return (
    <div className="w-full mt-2">
      <div className="relative w-full h-4 bg-gray-300 rounded-full">
        {/* Phần thanh tiến độ đã được hoàn thành */}
        <div
          className="absolute top-0 left-0 h-full bg-[#ff424e] rounded-full"
          style={{ width: `${percent}%` }}
        ></div>
        {/* Text hiển thị trên thanh tiến độ */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-black text-xs font-semibold px-1">
          {updatedProgressText}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
