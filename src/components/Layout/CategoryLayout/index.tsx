import { Outlet } from "react-router-dom";
import Header from "../Header";
import CategoryNav from "../../common/CategoryNav";

const CategoryLayout = () => {
  return (
    <>
      <Header />
      <section className="w-[1000px] m-auto">
        <CategoryNav />
        <Outlet />
      </section>
    </>
  );
};

export default CategoryLayout;
