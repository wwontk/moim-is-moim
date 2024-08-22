import { MdOutlineSearch } from "react-icons/md";
import { FaRegBell } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { RootState } from "../../../types/User";
import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth, database } from "../../../firebase";
import { useEffect, useRef, useState } from "react";
import useGetAlarm from "../../../hooks/useGetAlarm";
import { ref, remove } from "firebase/database";

const Header = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const alarms = useGetAlarm();

  const togglePopup = () => {
    setIsPopupVisible((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setIsPopupVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteAlarm = async (key: string) => {
    await remove(ref(database, `users/${currentUser.uid}/alarm/${key}`));
  };

  return (
    <>
      <div className="shadow-five-percent bg-white">
        <div className="w-[1000px] h-24 m-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-cover bg-symbol-pattern w-12 h-12"></div>
            <Link to={"/"}>
              <p className="font-bold text-2xl text-theme-main-color pl-6">
                모임이 모임
              </p>
            </Link>
          </div>
          <form className="flex items-center w-[500px] h-14 bg-main-gray rounded-lg">
            <input
              type="text"
              placeholder="오늘의 모임을 검색해보세요."
              className="flex-1 pl-4 bg-main-gray focus:outline-none"
            />
            <button className="p-2">
              <MdOutlineSearch size={24} />
            </button>
          </form>
          <div className="flex items-center gap-9">
            <div className="relative" ref={popupRef}>
              <button
                className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-100"
                onClick={togglePopup}
              >
                <FaRegBell size={24} />
              </button>
              {isPopupVisible && (
                <div className="absolute z-50 top-10 -right-5 w-[350px] bg-white border border-gray-200 rounded-lg shadow-lg p-5">
                  <div>
                    <p className="font-semibold text-xl mb-3">알림</p>
                    <div className="flex flex-col gap-3">
                      {alarms.map((alarm, index) =>
                        alarm.data.type === "welcome" ? (
                          <Link to={`/moim/${alarm.data.moimId}`}>
                            <div
                              key={index}
                              className="flex flex-col gap-1 shadow p-3 rounded"
                              onClick={() => {
                                handleDeleteAlarm(alarm.id);
                              }}
                            >
                              <div className="flex gap-2 items-center">
                                <img
                                  src={alarm.data.moimPhoto}
                                  alt={`moim_photo`}
                                  className="w-7 h-7 rounded-full object-cover"
                                />
                                <p>{alarm.data.moimTitle}</p>
                              </div>
                              <div>{alarm.data.msg}</div>
                            </div>
                          </Link>
                        ) : (
                          <div
                            key={index}
                            className="flex flex-col gap-1 shadow p-3 rounded"
                            onClick={() => {
                              handleDeleteAlarm(alarm.id);
                            }}
                          >
                            <div className="flex gap-2 items-center">
                              <img
                                src={alarm.data.moimPhoto}
                                alt={`moim_photo`}
                                className="w-7 h-7 rounded-full object-cover"
                              />
                              <p>{alarm.data.moimTitle}</p>
                            </div>
                            <div>{alarm.data.msg}</div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {currentUser.isLogin ? (
              <>
                <Link to={"/mypage/edit"}>
                  <p>마이페이지</p>
                </Link>
                <p className="cursor-pointer" onClick={handleLogout}>
                  로그아웃
                </p>
              </>
            ) : (
              <>
                <Link to={"/login"}>
                  <p>로그인</p>
                </Link>
                <Link to={"/signup"}>
                  <p>회원가입</p>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
