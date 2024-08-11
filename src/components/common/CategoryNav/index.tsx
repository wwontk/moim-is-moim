import { NavLink } from "react-router-dom";

const CategoryNav = () => {
  const navItem = [
    {
      id: 1,
      path: "/categorylist",
      title: "전체",
    },
    {
      id: 2,
      path: "/category/sports",
      title: "운동",
    },
    {
      id: 3,
      path: "/category/food",
      title: "맛집",
    },
    {
      id: 4,
      path: "/category/game",
      title: "오락",
    },
    {
      id: 5,
      path: "/category/play",
      title: "문화/예술",
    },
    {
      id: 6,
      path: "/category/study",
      title: "스터디",
    },
    {
      id: 7,
      path: "/category/etc",
      title: "기타",
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

export default CategoryNav;
