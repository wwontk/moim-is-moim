import { Link } from "react-router-dom";
import useMemberCount from "../../../hooks/useMemberCount";
import { MoimObjectType } from "../../../types/Moim";
import { FaLocationDot } from "react-icons/fa6";
import { BsCalendarDateFill } from "react-icons/bs";

const NewCard = ({ moim }: { moim: MoimObjectType }) => {
  const date = moim.moimDate.split(" ");
  const location = moim.moimLocation.split(" ");
  return (
    <>
      <Link to={`/moim/${moim.moimId}`}>
        <div className="h-32 xs:w-80 xs:h-20 flex rounded-2xl bg-white shadow">
          {moim.moimPhoto ? (
            <img
              src={moim.moimPhoto}
              alt="moim_photo"
              className="w-64 xs:w-16 bg-theme-color-002 rounded-l-2xl object-cover"
            />
          ) : (
            <div className="w-64 xs:w-16 bg-theme-color-002 rounded-l-2xl"></div>
          )}
          <div className="flex-1 flex flex-col pl-8 xs:pl-3 justify-center">
            <p className="text-2xl font-bold xs:text-sm">{moim.moimTitle}</p>
            <div className="flex text-custom-gray-002 gap-2 xs:text-xs">
              <div className="flex items-center gap-1">
                <BsCalendarDateFill />
                <p>{date[0]}</p>
              </div>
              <div className="flex items-center gap-1">
                <FaLocationDot />
                <p>{location[0] + " " + location[1]}</p>
              </div>
            </div>
            <p className="text-xl text-theme-main-color font-semibold mt-3 xs:text-sm xs:mt-1">
              현재 모임 인원 {useMemberCount(moim.moimId)}/{moim.moimMemberNum}
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default NewCard;
