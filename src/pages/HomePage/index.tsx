import CategoryList from "../../components/common/CategoryList";
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
            <p className="font-bold text-2xl text-custom-gray-001">
              원하는 모임을 선택하세요
            </p>
            <CategoryList />
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
