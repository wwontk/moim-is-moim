import { Link, useNavigate } from "react-router-dom";
import useInput from "../../hooks/useInput";
import { FormEvent, useEffect, useState } from "react";
import { ValidCheckType } from "../../types/User";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, database } from "../../firebase";
import { md5 } from "js-md5";
import { ref, set } from "firebase/database";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [email, , handleChaneEmail] = useInput("");
  const [password, , handleChagnePassword] = useInput("");
  const [passwordCheck, , handleChangePasswordCheck] = useInput("");
  const [nickname, , handleChangeNickname] = useInput("");

  const [allCheck, setAllCheck] = useState(false);

  const CheckInit = {
    status: false,
    msg: "",
  };

  const [validEmail, setValidEmail] = useState<ValidCheckType>(CheckInit);
  const [validPassword, setValidPassword] = useState<ValidCheckType>(CheckInit);
  const [validPasswordCheck, setValidPasswordCheck] =
    useState<ValidCheckType>(CheckInit);
  const [validNickname, setValidNickname] = useState<ValidCheckType>(CheckInit);

  const isValidEmail = (email: string) => {
    const regExp =
      /^[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*@[0-9a-zA-z]([-_\\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    return regExp.test(email);
  };

  const isValidPassword = (password: string) => {
    const regExp =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regExp.test(password);
  };

  useEffect(() => {
    if (!email) return;
    if (isValidEmail(email)) {
      setValidEmail({ status: true, msg: "올바른 형식의 이메일 입니다." });
    } else {
      setValidEmail({ status: false, msg: "올바른 형식의 이메일이 아닙니다." });
    }
  }, [email]);

  useEffect(() => {
    if (!password) return;
    if (isValidPassword(password)) {
      setValidPassword({ status: true, msg: "올바른 형식의 비밀번호 입니다." });
    } else {
      setValidPassword({
        status: false,
        msg: "올바른 형식의 비밀번호가 아닙니다.",
      });
    }
  }, [password]);

  useEffect(() => {
    if (!passwordCheck) return;
    if (passwordCheck === password) {
      setValidPasswordCheck({ status: true, msg: "비밀번호가 일치합니다." });
    } else {
      setValidPasswordCheck({
        status: false,
        msg: "비밀번호가 일치하지 않습니다.",
      });
    }
  }, [password, passwordCheck]);

  useEffect(() => {
    if (!nickname) return;
    if (nickname.length < 2) {
      setValidNickname({
        status: false,
        msg: "닉네임은 2글자 이상으로 설정해주세요.",
      });
    } else {
      setValidNickname({ status: true, msg: "사용 가능한 닉네임 입니다." });
    }
  }, [nickname]);

  useEffect(() => {
    if (
      validEmail.status &&
      validPassword.status &&
      validPasswordCheck.status &&
      validNickname.status
    ) {
      setAllCheck(true);
    } else {
      setAllCheck(false);
    }
  }, [
    validEmail.status,
    validPassword.status,
    validPasswordCheck.status,
    validNickname.status,
  ]);

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const createdUser = await createUserWithEmailAndPassword(
        auth,
        String(email),
        String(password)
      );

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: nickname,
          photoURL: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${md5(
            String(createdUser.user.email)
          )}&backgroundColor=${getRandomColor()}`,
        });
      }
      set(ref(database, `users/${createdUser.user.uid}`), {
        uid: createdUser.user.uid,
        email: createdUser.user.email,
        name: createdUser.user.displayName,
        profile: createdUser.user.photoURL,
      }).then(() => {
        toast("축하합니다! 회원가입이 되었습니다.", {
          icon: "🎉",
        });
        navigate("/", { replace: true });
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-center my-20 xs:w-[350px] xs:m-auto xs:my-20">
        <div className="flex flex-col items-center w-96">
          <div className="flex flex-col items-center mb-11">
            <div className="bg-cover bg-symbol-pattern w-12 h-12 mb-4"></div>
            <Link to={"/"}>
              <p className="font-bold text-2xl text-theme-main-color">
                모임이 모임
              </p>
            </Link>
          </div>
          <form
            className="flex w-full flex-col items-start"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col w-full gap-2 mb-4">
              <div className="flex items-center">
                <label className="text-gray-700">이메일</label>
                <p
                  className={`text-sm pl-4 ${
                    validEmail.status ? "text-green-500" : "text-red-600"
                  }`}
                >
                  {email && validEmail.msg}
                </p>
              </div>
              <div className="flex items-center w-full h-14 rounded-lg bg-white">
                <input
                  type="email"
                  value={email}
                  onChange={handleChaneEmail}
                  className="flex-1 focus:outline-none pl-4"
                ></input>
              </div>
            </div>
            <div className="flex flex-col w-full gap-2 mb-4">
              <div className="flex items-center">
                <label className="text-gray-700">비밀번호</label>
                <p
                  className={`text-sm pl-4 ${
                    validPassword.status ? "text-green-500" : "text-red-600"
                  }`}
                >
                  {password && validPassword.msg}
                </p>
              </div>
              <div className="flex items-center w-full h-14 rounded-lg bg-white">
                <input
                  type="password"
                  value={password}
                  onChange={handleChagnePassword}
                  className="flex-1 focus:outline-none pl-4"
                ></input>
              </div>
            </div>
            <div className="flex flex-col w-full gap-2 mb-4">
              <div className="flex items-center">
                <label className="text-gray-700">비밀번호 확인</label>
                <p
                  className={`text-sm pl-4 ${
                    validPasswordCheck.status
                      ? "text-green-500"
                      : "text-red-600"
                  }`}
                >
                  {passwordCheck && validPasswordCheck.msg}
                </p>
              </div>
              <div className="flex items-center w-full h-14 rounded-lg bg-white">
                <input
                  type="password"
                  value={passwordCheck}
                  onChange={handleChangePasswordCheck}
                  className="flex-1 focus:outline-none pl-4"
                ></input>
              </div>
            </div>
            <div className="flex flex-col w-full gap-2">
              <div className="flex items-center">
                <label className="text-gray-700">닉네임</label>
                <p
                  className={`text-sm pl-4 ${
                    validNickname.status ? "text-green-500" : "text-red-600"
                  }`}
                >
                  {nickname && validNickname.msg}
                </p>
              </div>
              <div className="flex items-center w-full h-14 rounded-lg bg-white">
                <input
                  type="text"
                  value={nickname}
                  onChange={handleChangeNickname}
                  className="flex-1 focus:outline-none pl-4"
                ></input>
              </div>
            </div>
            <button
              className="w-full h-14 bg-theme-color-003 text-white font-semibold rounded-lg mt-11 disabled:bg-custom-gray-004 disabled:opacity-50"
              disabled={!allCheck}
            >
              가입하기
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
