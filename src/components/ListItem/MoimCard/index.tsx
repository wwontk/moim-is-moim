import { FaLocationDot } from "react-icons/fa6";
import { BsCalendarDateFill } from "react-icons/bs";
import { MoimObjectType } from "../../../types/Moim";
import { Link } from "react-router-dom";
import useMemberCount from "../../../hooks/useMemberCount";
import { cateMapping } from "../../../types/Category";
import useCheckIsToday from "../../../hooks/useCheckIsToday";

const MoimCard = ({ moim }: { moim: MoimObjectType }) => {
  const date = moim.moimDate.split(" ");
  const location = moim.moimLocation.split(" ");

  const isToday = useCheckIsToday(new Date(moim.moimDate));

  return (
    <>
      <Link to={`/moim/${moim.moimId}`}>
        <div className="w-56 h-60 xs:w-[350px] xs:h-36 xs:flex bg-white rounded-2xl shadow-sm">
          <div className="h-24 xs:w-28 xs:h-36 bg-theme-color-003 rounded-t-2xl xs:rounded-l-2xl xs:rounded-r-none">
            {moim.moimPhoto && (
              <img
                src={moim.moimPhoto}
                alt="moim+photo"
                className="w-full h-24 xs:h-36 xs:rounded-l-2xl xs:rounded-r-none object-cover rounded-t-2xl"
              />
            )}
          </div>
          <div className="px-3 py-2">
            <div className="flex gap-2 mb-2">
              {isToday && (
                <div className="w-9 h-5 bg-badge-red-001 text-badge-red-002 rounded text-[10px] flex justify-center items-center">
                  오늘
                </div>
              )}
              <div className="w-11 h-5 bg-badge-green-001 text-badge-green-002 rounded text-[10px] flex justify-center items-center">
                {cateMapping[String(moim.moimCate)]}
              </div>
            </div>
            <p className="text-xl xs:text-base font-bold truncate">
              {moim.moimTitle}
            </p>
            <div className="flex text-xs xs:text-[10px] text-custom-gray-002 gap-2">
              <div className="flex items-center gap-1">
                <BsCalendarDateFill />
                <p>{date[0]}</p>
              </div>
              <div className="flex items-center gap-1 w-28">
                <FaLocationDot />
                <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                  {location[0] + " " + location[1]}
                </p>
              </div>
            </div>
            <p className="w-full text-sm mt-1 mb-1 text-ellipsis overflow-hidden whitespace-nowrap">
              {moim.moimIntro}
            </p>
            <p className="font-semibold text-theme-main-color">
              {`현재 모임 인원 ${useMemberCount(moim.moimId)}/${
                moim.moimMemberNum
              }`}
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default MoimCard;
