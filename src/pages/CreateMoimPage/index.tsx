import {
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";
import { FormEvent, useEffect, useRef, useState } from "react";
import DaumPostcodeEmbed from "react-daum-postcode";
import { FaCamera } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { BsCalendarDateFill } from "react-icons/bs";
import { FaClock } from "react-icons/fa6";
import useInput from "../../hooks/useInput";
import { Modal } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { database, storage } from "../../firebase";
import { useSelector } from "react-redux";
import { RootState } from "../../types/User";
import moment from "moment";
import { push, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

interface AddressType {
  address: string;
}

const CreateMoimPage = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser.isLogin) {
      navigate("/login");
    }
  }, [currentUser.isLogin, navigate]);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleOpenFileRef = () => {
    if (!fileRef.current) return;
    fileRef.current.click();
  };

  const [imageUrl, setImageUrl] = useState("");

  const handleUploadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const storageReference = storageRef(storage, "moimPhoto/" + file.name);
    const uploadTask = uploadBytesResumable(storageReference, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImageUrl(downloadURL);
        });
      }
    );
  };

  const [cate, setCate] = useState("sports");
  const [memberNum, setMemberNum] = useState("2");

  const handleCateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCate(e.target.value);
  };
  const handleMemberNumSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMemberNum(e.target.value);
  };

  const [title, , handleChangeTitle] = useInput("");

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);

  const [intro, , handleChangeIntro] = useInput("");
  const [textDetail, , handleChangeTextDetail] = useInput("");

  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [addressDetail, , handleAddressDetail] = useInput("");

  const showModal = () => {
    setIsOpen(true);
  };

  const handleOk = () => {
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleGetAddress = (data: AddressType) => {
    const { address } = data;
    setAddress(address);
    handleCancel();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const newMoimRef = push(ref(database, "moims"));

      await set(newMoimRef, {
        masterUid: currentUser.uid,
        moimTitle: title,
        moimIntro: intro,
        moimDate: `${
          String(moment(startDate).format("YYYY.MM.DD")) +
          " " +
          String(moment(startTime).format("H:mm"))
        }`,
        moimLocation: address,
        moimLocationDetail: addressDetail,
        moimText: textDetail,
        moimCate: cate,
        moimMemberNum: memberNum,
        moimPhoto: imageUrl,
        moimMember: {
          [currentUser.uid]: {
            profile: currentUser.photoURL,
            name: currentUser.displayName,
            uid: currentUser.uid,
          },
        },
        createdAt: new Date().toISOString(),
        views: 0,
      });

      const moimKey = newMoimRef.key;

      if (moimKey) {
        await set(
          ref(database, `users/${currentUser.uid}/mymoim/master/${moimKey}`),
          true
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      navigate("/categorylist", { replace: true });
    }
  };

  return (
    <>
      <section className="w-[1000px] xs:w-[350px] m-auto py-20">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt="photo"
                className="w-36 h-36 xs:w-20 xs:h-20 rounded-xl object-cover"
              />
            </>
          ) : (
            <div
              onClick={handleOpenFileRef}
              className="w-36 h-36 xs:w-20 xs:h-20 bg-white rounded-xl flex justify-center items-center text-theme-main-color shadow"
            >
              <FaCamera className="text-[70px] xs:text-[30px]" />
            </div>
          )}

          <input
            type="file"
            ref={fileRef}
            className="hidden"
            onChange={handleUploadImg}
          />
          <div className="w-full bg-white rounded-xl shadow p-7 flex flex-col gap-2">
            <p className="text-theme-main-color font-light">모임 분류</p>
            <select
              name="category"
              id="category"
              className="w-full border-2 p-2 rounded"
              onChange={handleCateSelect}
              defaultValue={cate}
            >
              <option value="sports">운동</option>
              <option value="food">맛집</option>
              <option value="game">오락</option>
              <option value="play">문화/예술</option>
              <option value="study">스터디</option>
              <option value="etc">기타</option>
            </select>
          </div>
          <div className="w-full bg-white rounded-xl shadow p-7 flex flex-col gap-2">
            <p className="text-theme-main-color font-light">모임 인원</p>
            <select
              name="category"
              id="category"
              className="w-1/4 border-2 p-2 rounded"
              onChange={handleMemberNumSelect}
              defaultValue={memberNum}
            >
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          <div className="w-full bg-white rounded-xl shadow p-7 flex flex-col gap-2">
            <p className="text-theme-main-color font-light">모임 제목</p>
            <input
              type="text"
              className="w-full bg-[#fafafa] p-2 rounded focus:outline-none"
              value={title}
              onChange={handleChangeTitle}
            />
          </div>
          <div className="w-full bg-white rounded-xl shadow p-7 flex flex-col gap-2">
            <p className="text-theme-main-color font-light">모임 일정</p>
            <div className="flex gap-2">
              <div className="border p-2 rounded flex items-center gap-2 xs:w-1/2">
                <BsCalendarDateFill className="text-custom-gray-002" />
                <DatePicker
                  selected={startDate}
                  placeholderText="날짜 선택"
                  onChange={(date) => {
                    if (!date) return;
                    setStartDate(date);
                  }}
                  dateFormat="yyyy.MM.dd"
                  className="xs:w-full"
                />
              </div>
              <div className="border p-2 rounded flex items-center gap-2 xs:w-1/2">
                <FaClock className="text-custom-gray-002" />
                <DatePicker
                  selected={startTime}
                  placeholderText="시간 선택"
                  onChange={(date) => {
                    if (!date) return;
                    setStartTime(date);
                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="H:mm"
                  className="xs:w-full"
                />
              </div>
            </div>
          </div>
          <div className="w-full bg-white rounded-xl shadow p-7 flex flex-col gap-2">
            <p className="text-theme-main-color font-light">모임 장소</p>
            <div className="flex flex-col gap-2">
              {isOpen && (
                <Modal open={true} onOk={handleOk} onCancel={handleCancel}>
                  <DaumPostcodeEmbed onComplete={handleGetAddress} />
                </Modal>
              )}
              <div className="flex items-center gap-2">
                <p className="w-1/2 xs:w-full border-2 p-2 h-11 rounded">
                  {address}
                </p>
                <div
                  onClick={showModal}
                  className="w-11 h-11 border-2 flex items-center justify-center rounded cursor-pointer"
                >
                  <FaSearch />
                </div>
              </div>
              <input
                type="text"
                className="w-1/2 xs:w-full h-11 border-2 p-2 rounded focus:outline-none"
                placeholder="상세 주소 입력"
                value={addressDetail}
                onChange={handleAddressDetail}
              />
            </div>
          </div>
          <div className="w-full bg-white rounded-xl shadow p-7 flex flex-col gap-2">
            <p className="text-theme-main-color font-light">모임 한줄소개</p>
            <input
              type="text"
              className="w-full bg-[#fafafa] p-2 rounded focus:outline-none"
              value={intro}
              onChange={handleChangeIntro}
            />
          </div>
          <div className="w-full bg-white rounded-xl shadow p-7 flex flex-col gap-2">
            <p className="text-theme-main-color font-light">모임 소개글</p>
            <textarea
              className="w-full h-48 bg-[#fafafa] p-2 rounded focus:outline-none resize-none"
              value={textDetail}
              onChange={handleChangeTextDetail}
            />
          </div>
          <div className="flex gap-4 xs:gap-2 justify-end">
            <button
              type="button"
              className="bg-[#e0e0e0] hover:bg-[#d3d3d3] text-gray-500 text-lg xs:text-sm xs:w-16 font-medium w-20 p-2 rounded hover:shadow"
              onClick={() => navigate("/categorylist")}
            >
              취소
            </button>
            <button className="bg-[#32d998] hover:bg-[#12d68a] text-white text-lg xs:text-sm xs:w-20 font-medium w-24 p-2 rounded hover:shadow">
              모임 생성
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default CreateMoimPage;
