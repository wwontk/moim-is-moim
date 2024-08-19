import { Link } from "react-router-dom";

const PopularCard = () => {
  return (
    <>
      <Link to={"/moim/moimid"}>
        <div className="w-[320px] h-[340px] bg-white rounded-2xl shadow-md">
          <div className="h-[150px] bg-theme-color-001 rounded-t-2xl"></div>
          <div className="flex flex-col px-8 pt-4">
            <div className="w-9 h-5 bg-badge-red-001 text-badge-red-002 rounded text-[10px] flex justify-center items-center">
              오늘
            </div>
            <p className="mt-2 text-xl font-bold">축구 하실분</p>
            <p className="mt-1 text-xs font-bold text-custom-gray-002">
              모임일 24.08.07
            </p>
            <p className="mt-4 text-[15px]">
              매탄동에서 축구하실 여자분들 모집합니다!!
            </p>
            <p className="mt-3 font-semibold text-theme-main-color">
              현재 모임 인원 8/10
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default PopularCard;
