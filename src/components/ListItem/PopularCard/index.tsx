import { Link } from "react-router-dom";
import { MoimObjectType } from "../../../types/Moim";
import useMemberCount from "../../../hooks/useMemberCount";
import { FaLocationDot } from "react-icons/fa6";
import { BsCalendarDateFill } from "react-icons/bs";
import useCheckIsToday from "../../../hooks/useCheckIsToday";
import { cateMapping } from "../../../types/Category";

const PopularCard = ({ moim }: { moim: MoimObjectType }) => {
  const date = moim.moimDate.split(" ");
  const location = moim.moimLocation.split(" ");

  const isToday = useCheckIsToday(new Date(moim.moimDate));

  return (
    <>
      <Link to={`/moim/${moim.moimId}`}>
        <div className="w-[320px] h-[340px] bg-white rounded-2xl shadow-md">
          {moim.moimPhoto ? (
            <img
              src={moim.moimPhoto}
              alt={moim.moimTitle}
              className="w-[320px] h-[150px] bg-theme-color-001 rounded-t-2xl object-cover"
            />
          ) : (
            <div className="h-[150px] bg-theme-color-001 rounded-t-2xl"></div>
          )}
          <div className="flex flex-col px-8 pt-4">
            <div className="flex gap-2">
              {isToday && (
                <div className="w-9 h-5 bg-badge-red-001 text-badge-red-002 rounded text-[10px] flex justify-center items-center">
                  오늘
                </div>
              )}

              <div className="w-11 h-5 bg-badge-green-001 text-badge-green-002 rounded text-[10px] flex justify-center items-center">
                {cateMapping[String(moim.moimCate)]}
              </div>
            </div>
            <p className="mt-2 text-xl font-bold">{moim.moimTitle}</p>
            <div className="mt-1 text-xs font-bold text-custom-gray-002 flex gap-2">
              <div className="flex items-center gap-1">
                <BsCalendarDateFill />
                <p>{date[0]}</p>
              </div>
              <div className="flex items-center gap-1">
                <FaLocationDot />
                <p>{location[0] + " " + location[1]}</p>
              </div>
            </div>
            <p className="mt-4 text-[15px]">{moim.moimIntro}</p>
            <p className="mt-3 font-semibold text-theme-main-color">
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

export default PopularCard;
