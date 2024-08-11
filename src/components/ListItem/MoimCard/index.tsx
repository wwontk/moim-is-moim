import { FaLocationDot } from "react-icons/fa6";
import { BsCalendarDateFill } from "react-icons/bs";

const MoimCard = () => {
  return (
    <>
      <div className="w-56 h-60 bg-white rounded-2xl shadow-sm">
        <div className="h-24 bg-theme-color-003 rounded-t-2xl"></div>
        <div className="px-3 py-2">
          <div className="flex gap-2 mb-2">
            <div className="w-9 h-5 bg-badge-red-001 text-badge-red-002 rounded text-[10px] flex justify-center items-center">
              오늘
            </div>
            <div className="w-9 h-5 bg-badge-green-001 text-badge-green-002 rounded text-[10px] flex justify-center items-center">
              오락
            </div>
          </div>
          <p className="text-xl font-bold">보드게임 고수 모임</p>
          <div className="flex text-xs text-custom-gray-002 gap-2">
            <div className="flex items-center gap-1">
              <BsCalendarDateFill />
              <p>24.08.07</p>
            </div>
            <div className="flex items-center gap-1">
              <FaLocationDot />
              <p>경기도 수원</p>
            </div>
          </div>
          <p className="text-sm mt-1 mb-1">고수들아 덤벼라</p>
          <p className="font-semibold text-theme-main-color">
            현재 모임 인원 4/6
          </p>
        </div>
      </div>
    </>
  );
};

export default MoimCard;
