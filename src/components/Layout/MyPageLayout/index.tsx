import { Outlet } from "react-router-dom";
import Header from "../Header";
import MyPageNav from "../../common/MyPageNav";

const MyPageLayout = () => {
  return (
    <>
      <Header />
      <section className="w-[1000px] m-auto">
        <MyPageNav />
        <Outlet />
      </section>
    </>
  );
};

export default MyPageLayout;
