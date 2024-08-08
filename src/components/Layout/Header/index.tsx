import { MdOutlineSearch } from "react-icons/md";
import { FaRegBell } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Header = () => {
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
            <button>
              <FaRegBell size={24} />
            </button>
            <Link to={"/login"}>
              <p>로그인</p>
            </Link>
            <Link to={"/signup"}>
              <p>회원가입</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
