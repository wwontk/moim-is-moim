const NewCard = () => {
  return (
    <>
      <div className="h-32 flex rounded-2xl bg-white">
        <div className="w-64 bg-theme-color-002 rounded-l-2xl"></div>
        <div className="flex-1 flex flex-col pl-8 justify-center">
          <p className="text-2xl font-bold">
            야구 경기 같이 보러가실 KT위즈 팬 모임
          </p>
          <p className="text-custom-gray-002">모임일 24.08.08</p>
          <p className="text-xl text-theme-main-color font-semibold mt-3">
            현재 모임 인원 1/4
          </p>
        </div>
        <div className="flex items-center mx-5">
          <button className="px-4 py-3 bg-theme-main-color text-white font-semibold rounded-lg">
            모임 상세보기
          </button>
        </div>
      </div>
    </>
  );
};

export default NewCard;
