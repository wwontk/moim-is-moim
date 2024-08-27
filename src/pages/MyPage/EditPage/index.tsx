import { useDispatch, useSelector } from "react-redux";
import { RootState, ValidCheckType } from "../../../types/User";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, database, storage } from "../../../firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { setPhotoURL, setUser } from "../../../store/userSlice";
import { update, ref as dbref, onValue } from "firebase/database";
import { md5 } from "js-md5";
import useInput from "../../../hooks/useInput";
import { useEffect, useState } from "react";
import { area } from "../../../data/area";
import { years } from "../../../data/age";
import { useNavigate } from "react-router-dom";

const EditPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!currentUser.isLogin) {
      navigate("/login");
    }
  }, [currentUser.isLogin, navigate]);

  const [newNickname, , handleChangeNewNickname] = useInput(
    currentUser.displayName
  );

  const [password, , handleChangePassword] = useInput("");
  const [newPassword, , handleChangeNewPassword] = useInput("");
  const [newPasswordCheck, , handleChangeNewPasswordCheck] = useInput("");
  const [pwConfirm, setPwConfirm] = useState(false);

  const handleUploadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const user = auth.currentUser;

    if (!file) return;
    if (!user) return;

    const storageRef = ref(storage, "user_profile/" + user.uid + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

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
          updateProfile(user, {
            photoURL: downloadURL,
          });
          dispatch(setPhotoURL(downloadURL));
          update(dbref(database, `users/${user.uid}`), {
            profile: downloadURL,
          });
        });
      }
    );
  };

  function getProfile() {
    const letters = "0123456789ABCDEF";
    let color = "";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    const profileImg = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${md5(
      String(currentUser.email)
    )}&backgroundColor=${color}`;
    return profileImg;
  }

  const handleDeleteProfile = () => {
    const user = auth.currentUser;
    if (!user) return;

    const newProfile = getProfile();

    updateProfile(user, {
      photoURL: newProfile,
    });
    dispatch(setPhotoURL(newProfile));
    update(dbref(database, `users/${user.uid}`), {
      profile: newProfile,
    });
  };

  const handleChangeNickname = () => {
    const user = auth.currentUser;
    if (!user) return;

    updateProfile(user, {
      displayName: newNickname,
    });
    dispatch(
      setUser({
        ...currentUser,
        displayName: newNickname,
      })
    );
    update(dbref(database, `users/${user.uid}`), {
      name: newNickname,
    });
  };

  const CheckInit = {
    status: false,
    msg: "",
  };

  const [validPassword, setValidPassword] = useState<ValidCheckType>(CheckInit);
  const [validPasswordCheck, setValidPasswordCheck] =
    useState<ValidCheckType>(CheckInit);

  const isValidPassword = (password: string) => {
    const regExp =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regExp.test(password);
  };

  useEffect(() => {
    if (!newPassword) return;
    if (isValidPassword(newPassword)) {
      setValidPassword({ status: true, msg: "올바른 형식의 비밀번호 입니다." });
    } else {
      setValidPassword({
        status: false,
        msg: "올바른 형식의 비밀번호가 아닙니다.",
      });
    }
  }, [newPassword]);

  useEffect(() => {
    if (!newPasswordCheck) return;
    if (newPasswordCheck === newPassword) {
      setValidPasswordCheck({ status: true, msg: "비밀번호가 일치합니다." });
    } else {
      setValidPasswordCheck({
        status: false,
        msg: "비밀번호가 일치하지 않습니다.",
      });
    }
  }, [newPassword, newPasswordCheck]);

  useEffect(() => {
    if (validPassword.status && validPasswordCheck.status) {
      setPwConfirm(true);
    } else {
      setPwConfirm(false);
    }
  }, [validPassword.status, validPasswordCheck.status]);

  const handleChangePW = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const credential = EmailAuthProvider.credential(
      String(user.email),
      String(password)
    );

    await reauthenticateWithCredential(user, credential)
      .then(() => {
        updatePassword(user, String(newPassword))
          .then(() => {})
          .catch((error) => console.error(error));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  const districts = area.find((area) => area.city === city)?.district || [];

  useEffect(() => {
    const fetchUserOptions = async () => {
      try {
        if (currentUser?.uid) {
          const userOptionRef = dbref(
            database,
            `users/${currentUser.uid}/option`
          );
          const unsubscribe = onValue(userOptionRef, (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              setAge(data.age || "");
              setGender(data.gender || "");
              setCity(data.city || "");
              setDistrict(data.district || "");
            }
          });
          return () => unsubscribe();
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserOptions();
  }, [currentUser.uid]);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
    setDistrict("");
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrict(e.target.value);
  };

  const handleSubmitOptional = async () => {
    const newOptionData = {
      age: age,
      gender: gender,
      city: city,
      district: district,
      residence: `${city} ${district}`,
    };
    const userOptionRef = dbref(database, `users/${currentUser.uid}/option`);
    await update(userOptionRef, newOptionData);
  };

  return (
    <>
      <div className="mb-14 xs:hidden">
        <p className="text-lg">기본 정보</p>
        <div className="flex h-96 justify-between mt-3">
          <div className="flex flex-col gap-7 w-[480px]">
            <div className="h-48 bg-white rounded-2xl p-7 flex flex-col gap-8 shadow">
              <p className="text-custom-gray-003 text-sm">프로필 사진</p>
              <div className="flex items-center">
                <img
                  src={`${currentUser.photoURL}`}
                  alt="profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="ml-10 flex">
                  <label htmlFor="newProfile" className="cursor-pointer">
                    <p className="w-20 border-2 p-2 rounded-md mr-3 text-custom-gray-004">
                      사진 선택
                    </p>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="newProfile"
                    id="newProfile"
                    className="hidden"
                    onChange={handleUploadImg}
                  />
                  <button
                    className="w-20 border-2 p-2 rounded-md text-custom-gray-004"
                    onClick={handleDeleteProfile}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-white rounded-2xl p-7 flex flex-col gap-8 shadow">
              <p className="text-custom-gray-003 text-sm">닉네임</p>
              <div className="flex justify-between gap-4">
                <input
                  type="text"
                  value={newNickname}
                  onChange={handleChangeNewNickname}
                  className="flex-1 bg-[#f6f6f6] rounded h-10 focus:outline-none px-3"
                />
                <button
                  className="border-2 h-10 rounded-md text-custom-gray-004 px-3"
                  onClick={handleChangeNickname}
                >
                  닉네임 변경
                </button>
              </div>
            </div>
          </div>
          <div className="w-[480px] bg-white rounded-2xl p-7 flex flex-col gap-8 shadow">
            <p className="text-custom-gray-003 text-sm">비밀번호</p>
            <div className="flex flex-col gap-4 items-end">
              <input
                type="password"
                className="bg-[#f6f6f6] rounded h-10 w-full px-3"
                placeholder="현재 비밀번호"
                onChange={handleChangePassword}
              />
              <div className="w-full">
                <input
                  type="password"
                  className="bg-[#f6f6f6] rounded h-10 w-full px-3"
                  placeholder="새 비밀번호"
                  onChange={handleChangeNewPassword}
                />
                <p
                  className={`text-sm mt-1 ${
                    newPassword
                      ? validPassword.status
                        ? "text-green-500"
                        : "text-red-600"
                      : "text-custom-gray-002"
                  }`}
                >
                  {newPassword
                    ? validPassword.msg
                    : "한글,영문,특수문자 포함 8자 이상"}
                </p>
              </div>
              <div className="w-full">
                <input
                  type="password"
                  className="bg-[#f6f6f6] rounded h-10 w-full px-3"
                  placeholder="새 비밀번호 재확인"
                  onChange={handleChangeNewPasswordCheck}
                />
                <p
                  className={`text-sm mt-1 ${
                    validPasswordCheck.status
                      ? "text-green-500"
                      : "text-red-600"
                  }`}
                >
                  {newPasswordCheck && validPasswordCheck.msg}
                </p>
              </div>
            </div>
            <button
              className="w-28 p-2 border-2 rounded-md text-custom-gray-004"
              onClick={handleChangePW}
              disabled={!pwConfirm}
            >
              비밀번호 변경
            </button>
          </div>
        </div>
      </div>
      <div className="hidden xs:flex flex-col gap-4 ">
        <p className="text-lg">기본 정보</p>
        <div className="h-48 bg-white rounded-2xl p-7 flex flex-col gap-8 shadow">
          <p className="text-custom-gray-003 text-sm">프로필 사진</p>
          <div className="flex items-center">
            <img
              src={`${currentUser.photoURL}`}
              alt="profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="ml-10 flex">
              <label htmlFor="newProfile" className="cursor-pointer">
                <p className="w-20 border-2 p-2 rounded-md mr-3 text-custom-gray-004">
                  사진 선택
                </p>
              </label>
              <input
                type="file"
                accept="image/*"
                name="newProfile"
                id="newProfile"
                className="hidden"
                onChange={handleUploadImg}
              />
              <button
                className="w-20 border-2 p-2 rounded-md text-custom-gray-004"
                onClick={handleDeleteProfile}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-2xl p-7 flex flex-col gap-8 shadow">
          <p className="text-custom-gray-003 text-sm">닉네임</p>
          <div className="flex justify-between gap-4 xs:gap-2">
            <input
              type="text"
              value={newNickname}
              onChange={handleChangeNewNickname}
              className="flex-1 xs:w-1/2 bg-[#f6f6f6] rounded h-10 focus:outline-none px-3"
            />
            <button
              className="border-2 h-10 rounded-md text-custom-gray-004 px-3"
              onClick={handleChangeNickname}
            >
              닉네임 변경
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-7 flex flex-col gap-8 shadow">
          <p className="text-custom-gray-003 text-sm">비밀번호</p>
          <div className="flex flex-col gap-4 items-end">
            <input
              type="password"
              className="bg-[#f6f6f6] rounded h-10 w-full px-3"
              placeholder="현재 비밀번호"
              onChange={handleChangePassword}
            />
            <div className="w-full">
              <input
                type="password"
                className="bg-[#f6f6f6] rounded h-10 w-full px-3"
                placeholder="새 비밀번호"
                onChange={handleChangeNewPassword}
              />
              <p
                className={`text-sm mt-1 ${
                  newPassword
                    ? validPassword.status
                      ? "text-green-500"
                      : "text-red-600"
                    : "text-custom-gray-002"
                }`}
              >
                {newPassword
                  ? validPassword.msg
                  : "한글,영문,특수문자 포함 8자 이상"}
              </p>
            </div>
            <div className="w-full">
              <input
                type="password"
                className="bg-[#f6f6f6] rounded h-10 w-full px-3"
                placeholder="새 비밀번호 재확인"
                onChange={handleChangeNewPasswordCheck}
              />
              <p
                className={`text-sm mt-1 ${
                  validPasswordCheck.status ? "text-green-500" : "text-red-600"
                }`}
              >
                {newPasswordCheck && validPasswordCheck.msg}
              </p>
            </div>
          </div>
          <button
            className="w-28 p-2 border-2 rounded-md text-custom-gray-004"
            onClick={handleChangePW}
            disabled={!pwConfirm}
          >
            비밀번호 변경
          </button>
        </div>
      </div>
      <div className="xs:mt-8">
        <p className="text-lg">선택 개인정보</p>
        <div className="flex xs:flex-col xs:items-center xs:gap-3 justify-between mt-3">
          <div className="w-80 xs:w-full h-36 bg-white rounded-2xl p-7 shadow">
            <p className="text-custom-gray-003 text-sm">연령</p>
            <select
              name="age"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border-2 rounded text-custom-gray-002 p-3 focus:outline-none mt-6"
            >
              <option value="">연령 선택</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="w-80 xs:w-full h-36 bg-white rounded-2xl p-7 shadow">
            <p className="text-custom-gray-003 text-sm">성별</p>
            <select
              name="gender"
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border-2 rounded text-custom-gray-002 p-3 focus:outline-none mt-6"
            >
              <option value="">성별 선택</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>
          <div className="w-80 xs:w-full h-36 bg-white rounded-2xl p-7 shadow">
            <p className="text-custom-gray-003 text-sm">거주 지역</p>
            <div className="flex gap-2">
              <select
                name="city"
                id="city"
                value={city}
                onChange={handleCityChange}
                className="w-1/2 border-2 rounded text-custom-gray-002 p-3 focus:outline-none mt-6"
              >
                <option value="">지역 선택</option>
                {area.map((area) => (
                  <option key={area.city} value={area.city}>
                    {area.city}
                  </option>
                ))}
              </select>
              {city && (
                <select
                  name="district"
                  id="district"
                  value={district}
                  onChange={handleDistrictChange}
                  className="w-1/2 border-2 rounded text-custom-gray-002 p-3 focus:outline-none mt-6"
                >
                  <option value="">시,군,구 선택</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
        <button
          className="border-2 h-10 rounded-md text-custom-gray-004 px-3 bg-white my-5"
          onClick={handleSubmitOptional}
        >
          개인정보 저장
        </button>
      </div>
    </>
  );
};

export default EditPage;
