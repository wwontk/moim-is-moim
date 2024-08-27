import { Outlet, useNavigate } from "react-router-dom";
import Header from "../Header";
import CategoryNav from "../../common/CategoryNav";
import { FaPlus } from "react-icons/fa";

const CategoryLayout = () => {
  const navigate = useNavigate();

  const handleCreateMoim = () => {
    navigate("/moim/create");
  };
  return (
    <>
      <Header />
      <section className="w-[1000px] xs:w-[350px] m-auto">
        <CategoryNav />
        <div
          onClick={handleCreateMoim}
          className="my-5 flex items-center justify-center gap-2"
        >
          <button className="w-10 h-10 bg-white rounded-full border hover:bg-gray-100 flex justify-center items-center">
            <FaPlus className="text-custom-gray-001" />
          </button>
          <p className="cursor-pointer">새 모임 생성</p>
        </div>
        <Outlet />
      </section>
    </>
  );
};

export default CategoryLayout;
