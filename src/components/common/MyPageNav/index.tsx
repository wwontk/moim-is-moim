import { NavLink } from "react-router-dom";

const MyPageNav = () => {
  const navItem = [
    {
      id: 1,
      path: "/mypage/edit",
      title: "내 정보 수정",
    },
    {
      id: 2,
      path: "/mypage/mymoim",
      title: "내 모임",
    },
  ];
  return (
    <>
      <nav className="h-20 flex gap-8 items-center bg-white rounded-2xl border-2 pl-9 my-10">
        {navItem.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "text-theme-main-color font-semibold"
                : "text-custom-gray-002"
            }
          >
            {item.title}
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default MyPageNav;
