import { Link } from "react-router-dom";
import CategoryList from "../../components/common/CategoryList";
import NewCard from "../../components/ListItem/NewCard";
import PopularCard from "../../components/ListItem/PopularCard";

const HomePage = () => {
  return (
    <>
      <div>
        <section className="w-[1000px] m-auto">
          <div className="flex flex-col py-14 gap-8">
            <p className="font-bold text-2xl text-custom-gray-001">
              오늘의 인기모임이 모임?
            </p>
            <div className="flex justify-between">
              <PopularCard />
              <PopularCard />
              <PopularCard />
            </div>
          </div>
        </section>
      </div>
      <div className="bg-white">
        <section className="w-[1000px] m-auto">
          <div className="flex flex-col py-14 gap-14">
            <div className="flex items-center justify-between">
              <p className="font-bold text-2xl text-custom-gray-001">
                원하는 모임을 선택하세요
              </p>
              <Link to={"/categorylist"}>
                <p className="text-custom-gray-002 text-sm">목록 전체보기</p>
              </Link>
            </div>
            <CategoryList />
          </div>
        </section>
      </div>
      <div>
        <section className="w-[1000px] m-auto">
          <div className="flex flex-col py-14">
            <p className="font-bold text-2xl text-custom-gray-001 mb-10">
              새로 올라온 모임을 확인해보세요
            </p>
            <div className="flex flex-col gap-7">
              <NewCard />
              <NewCard />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
