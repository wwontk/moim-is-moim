import { MdOutlineSearch } from "react-icons/md";
import { FaRegBell } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../../types/User";
import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth, database } from "../../../firebase";
import { useEffect, useRef, useState } from "react";
import useGetAlarm from "../../../hooks/useGetAlarm";
import { ref, remove } from "firebase/database";
import AlarmList from "../../common/AlarmList";
import useInput from "../../../hooks/useInput";
import { IoMenu } from "react-icons/io5";

const Header = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const alarms = useGetAlarm();

  const [keyword, setKeyword, handleChangeKeyword] = useInput("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const menuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

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
    setIsPopupVisible(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!keyword) return;
    navigate(`/search?keyword=${keyword}`);
    setKeyword("");
    setSearchOpen(false);
  };

  return (
    <>
      {searchOpen && (
        <div className="hidden xs:flex w-full bg-white h-24 items-center gap-3 p-3">
          <form onSubmit={handleSubmit} className="flex-1 bg-main-gray rounded">
            <input
              type="text"
              placeholder="오늘의 모임을 검색해보세요."
              className="px-4 w-full h-10 bg-main-gray rounded focus:outline-none"
              value={keyword}
              onChange={handleChangeKeyword}
            />
          </form>
          <div onClick={() => setSearchOpen(false)}>취소</div>
        </div>
      )}
      <div>
        {!searchOpen && (
          <div className="shadow-five-percent xs:shadow-none bg-white">
            <div className="w-[1000px] xs:w-[350px] h-24 m-auto flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-cover bg-symbol-pattern w-12 h-12 xs:hidden"></div>
                <Link to={"/"}>
                  <p className="font-bold text-2xl text-theme-main-color pl-6 xs:pl-0">
                    모임이 모임
                  </p>
                </Link>
              </div>
              <form
                className="flex items-center w-[500px] h-14 bg-main-gray rounded-lg xs:hidden"
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  placeholder="오늘의 모임을 검색해보세요."
                  className="flex-1 pl-4 bg-main-gray focus:outline-none"
                  value={keyword}
                  onChange={handleChangeKeyword}
                />
                <button className="p-2">
                  <MdOutlineSearch size={24} />
                </button>
              </form>
              <div className="flex items-center gap-9 xs:hidden">
                <div className="relative" ref={popupRef}>
                  <button
                    className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-100"
                    onClick={togglePopup}
                  >
                    <FaRegBell size={24} />
                    {alarms.length > 0 && (
                      <div className="w-2 h-2 bg-red-600 rounded-full absolute top-0 right-0"></div>
                    )}
                  </button>
                  {isPopupVisible && (
                    <div className="absolute z-50 top-10 -right-5 w-[350px] bg-white border border-gray-200 rounded-lg shadow-lg p-5">
                      <div>
                        <p className="font-semibold text-xl mb-3">알림</p>
                        <div className="flex flex-col gap-3">
                          <AlarmList
                            alarms={alarms}
                            handleDeleteAlarm={handleDeleteAlarm}
                          />
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
              <div className="hidden xs:flex gap-3 items-center">
                <MdOutlineSearch
                  size={24}
                  onClick={() => setSearchOpen(true)}
                />
                <IoMenu size={24} onClick={menuToggle} />
              </div>
            </div>
          </div>
        )}

        {menuOpen ? (
          currentUser.isLogin ? (
            <>
              <nav className="bg-white p-4 gap-4 border-t border-t-slate-200 absolute w-full transition-transform animate-slideDown z-10">
                <ul className="flex flex-col gap-4">
                  <li>알림</li>
                  <Link to={"/mypage/edit"}>
                    <li>마이페이지</li>
                  </Link>
                  <li onClick={handleLogout}>로그아웃</li>
                </ul>
              </nav>
              <div className="bg-black w-full h-screen opacity-50 fixed top-24 left-0"></div>
            </>
          ) : (
            <>
              <nav className="bg-white p-4 gap-4 border-t border-t-slate-200 absolute w-full transition-transform animate-slideDown z-10">
                <ul className="flex flex-col gap-4">
                  <li>알림</li>
                  <Link to={"/login"}>
                    <li>로그인</li>
                  </Link>
                  <Link to={"/signup"}>
                    <li>회원가입</li>
                  </Link>
                </ul>
              </nav>
              <div className="bg-black w-full h-screen opacity-50 fixed top-24 left-0"></div>
            </>
          )
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Header;
