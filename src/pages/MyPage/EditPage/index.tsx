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
import { update, ref as dbref } from "firebase/database";
import { md5 } from "js-md5";
import useInput from "../../../hooks/useInput";
import { useEffect, useState } from "react";

const EditPage = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

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
      password
    );

    await reauthenticateWithCredential(user, credential)
      .then(() => {
        updatePassword(user, newPassword)
          .then(() => {})
          .catch((error) => console.error(error));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <div className="mb-14">
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
      <div>
        <p className="text-lg">선택 개인정보</p>
        <div className="flex justify-between mt-3">
          <div className="w-80 h-36 bg-white rounded-2xl p-7 shadow">
            <p className="text-custom-gray-003 text-sm">연령</p>
            <select
              name="age"
              id="age"
              className="w-full border-2 rounded text-custom-gray-002 p-3 focus:outline-none mt-6"
            >
              <option value="2001">2001</option>
            </select>
          </div>
          <div className="w-80 h-36 bg-white rounded-2xl p-7 shadow">
            <p className="text-custom-gray-003 text-sm">성별</p>
            <select
              name="sex"
              id="sex"
              className="w-full border-2 rounded text-custom-gray-002 p-3 focus:outline-none mt-6"
            >
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>
          <div className="w-80 h-36 bg-white rounded-2xl p-7 shadow">
            <p className="text-custom-gray-003 text-sm">거주 지역</p>
            <div className="flex gap-2">
              <select
                name="first-add"
                id="first-add"
                className="border-2 rounded text-custom-gray-002 p-3 focus:outline-none mt-6"
              >
                <option value="male">서울</option>
                <option value="female">경기도</option>
              </select>
              <select
                name="second-add"
                id="second-add"
                className="flex-1 border-2 rounded text-custom-gray-002 p-3 focus:outline-none mt-6"
              >
                <option value="male">강남구</option>
                <option value="female">수원시</option>
              </select>
            </div>
          </div>
        </div>
        <button className="border-2 h-10 rounded-md text-custom-gray-004 px-3 bg-white my-5">
          개인정보 저장
        </button>
      </div>
    </>
  );
};

export default EditPage;
