import { Link } from "react-router-dom";
import CategoryList from "../../components/common/CategoryList";
import NewCard from "../../components/ListItem/NewCard";
import PopularCard from "../../components/ListItem/PopularCard";
import { MoimObjectType } from "../../types/Moim";
import useTopMoimsByViews from "../../hooks/useTopMoimsByViews";
import useGetNewMoims from "../../hooks/useGetNewMoims";

const HomePage = () => {
  const newMoims = useGetNewMoims();
  const topMoims = useTopMoimsByViews();

  const renderNewMoims = (moims: MoimObjectType[]) => {
    return (
      moims.length > 0 &&
      moims.map((moim) => <NewCard key={moim.moimId} moim={moim} />)
    );
  };

  const renderTopMoims = (moims: MoimObjectType[]) => {
    return (
      moims.length > 0 &&
      moims.map((moim) => <PopularCard key={moim.moimId} moim={moim} />)
    );
  };

  return (
    <>
      <div>
        <section className="w-[1000px] xs:w-[350px] m-auto">
          <div className="flex flex-col py-14 gap-8 xs:items-center">
            <p className="font-bold text-2xl text-custom-gray-001">
              오늘의 인기모임이 모임?
            </p>
            <div className="flex justify-between xs:w-full xs:px-2 xs:gap-3 xs:overflow-scroll xs:py-2">
              {renderTopMoims(topMoims)}
            </div>
          </div>
        </section>
      </div>
      <div className="bg-white">
        <section className="w-[1000px] xs:w-[350px] m-auto">
          <div className="flex flex-col py-14 gap-14 xs:gap-5 xs:items-center">
            <div className="flex items-center justify-between xs:flex-col xs:gap-5">
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
        <section className="w-[1000px] xs:w-[350px] m-auto">
          <div className="flex flex-col py-14 xs:items-center">
            <p className="font-bold text-2xl text-custom-gray-001 mb-10">
              새로 올라온 모임을 확인해보세요
            </p>
            <div className="flex flex-col gap-7 xs:gap-3">
              {renderNewMoims(newMoims)}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
