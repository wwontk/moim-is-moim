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
      path: "/",
      icon: (
        <MdOutlineSportsTennis size={70} className="text-theme-main-color" />
      ),
      title: "운동",
    },
    {
      id: 2,
      path: "/",
      icon: <IoFastFoodOutline size={70} className="text-theme-main-color" />,
      title: "맛집",
    },
    {
      id: 3,
      path: "/",
      icon: (
        <IoGameControllerOutline size={70} className="text-theme-main-color" />
      ),
      title: "오락",
    },
    {
      id: 4,
      path: "/",
      icon: <SiPlaywright size={70} className="text-theme-main-color" />,
      title: "문화/예술",
    },
    {
      id: 5,
      path: "/",
      icon: <FaBookOpen size={70} className="text-theme-main-color" />,
      title: "스터디",
    },
    {
      id: 6,
      path: "/",
      icon: (
        <HiChatBubbleLeftEllipsis size={70} className="text-theme-main-color" />
      ),
      title: "기타",
    },
  ];
  return (
    <>
      <div className="flex justify-between">
        {categoryItem.map((item) => (
          <Link to={item.path} key={item.id}>
            <div className="w-36 h-36 rounded-2xl shadow-sm flex flex-col justify-center items-center">
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
