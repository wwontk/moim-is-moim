import { MdOutlineSportsTennis } from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";
import { IoGameControllerOutline } from "react-icons/io5";
import { SiPlaywright } from "react-icons/si";
import { FaBookOpen } from "react-icons/fa6";
import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const categoryItem = [
    {
      id: 1,
      path: "/category/sports",
      icon: (
        <MdOutlineSportsTennis size={70} className="text-theme-main-color" />
      ),
      title: "운동",
    },
    {
      id: 2,
      path: "/category/food",
      icon: <IoFastFoodOutline size={70} className="text-theme-main-color" />,
      title: "맛집",
    },
    {
      id: 3,
      path: "/category/game",
      icon: (
        <IoGameControllerOutline size={70} className="text-theme-main-color" />
      ),
      title: "오락",
    },
    {
      id: 4,
      path: "/category/play",
      icon: <SiPlaywright size={70} className="text-theme-main-color" />,
      title: "문화/예술",
    },
    {
      id: 5,
      path: "/category/study",
      icon: <FaBookOpen size={70} className="text-theme-main-color" />,
      title: "스터디",
    },
    {
      id: 6,
      path: "/category/etc",
      icon: (
        <HiChatBubbleLeftEllipsis size={70} className="text-theme-main-color" />
      ),
      title: "기타",
    },
  ];
  return (
    <>
      <div className="flex justify-between xs:w-full xs: gap-3 xs:overflow-scroll xs:py-2">
        {categoryItem.map((item) => (
          <Link to={item.path} key={item.id}>
            <div className="w-36 h-36 rounded-2xl shadow flex flex-col justify-center items-center">
              <p>{item.icon}</p>
              <p className="mt-5 text-theme-main-color font-bold">
                {item.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default CategoryList;
