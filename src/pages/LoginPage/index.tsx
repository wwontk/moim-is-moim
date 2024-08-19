import { Link, useNavigate } from "react-router-dom";
import useInput from "../../hooks/useInput";
import { MdOutlineMailOutline } from "react-icons/md";
import { MdOutlineLock } from "react-icons/md";
import { FormEvent, useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, , handleChaneEmail] = useInput("");
  const [password, , handleChagnePassword] = useInput("");

  const [allCheck, setAllCheck] = useState(false);

  useEffect(() => {
    if (email && password) {
      setAllCheck(true);
    } else {
      setAllCheck(false);
    }
  }, [email, password]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <div className="flex justify-center mt-20">
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
              <label className="text-gray-700">이메일</label>
              <div className="flex items-center w-full h-14 rounded-lg bg-white">
                <MdOutlineMailOutline
                  size={24}
                  className="box-content px-2 text-custom-gray-001"
                />
                <input
                  type="email"
                  value={email}
                  onChange={handleChaneEmail}
                  className="flex-1 focus:outline-none"
                ></input>
              </div>
            </div>
            <div className="flex flex-col w-full gap-2">
              <label className="text-gray-700">비밀번호</label>
              <div className="flex items-center w-full h-14 rounded-lg bg-white">
                <MdOutlineLock
                  size={24}
                  className="box-content px-2 text-custom-gray-001"
                />
                <input
                  type="password"
                  value={password}
                  onChange={handleChagnePassword}
                  className="flex-1 focus:outline-none"
                ></input>
              </div>
            </div>
            <button
              className="w-full h-14 bg-theme-color-003 text-white font-semibold rounded-lg mt-11"
              disabled={!allCheck}
            >
              로그인
            </button>
          </form>
          <Link to={"/signup"}>
            <p className="text-gray-300 mt-11">회원가입</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
