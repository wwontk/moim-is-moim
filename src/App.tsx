import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import MainLayout from "./components/Layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CategoryLayout from "./components/Layout/CategoryLayout";
import CategoryListPage from "./pages/CategoryListPage";
import CategoryItemPage from "./pages/CategoryListPage/CategoryItemPage";
import MyPageLayout from "./components/Layout/MyPageLayout";
import EditPage from "./pages/MyPage/EditPage";
import MyMoimPage from "./pages/MyPage/MyMoimPage";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "./store/userSlice";
import MoimDetailPage from "./pages/MoimDetailPage";
import CreateMoimPage from "./pages/CreateMoimPage";
import UpdateMoimPage from "./pages/UpdateMoimPage";
import MoimChattingPage from "./pages/MoimChattingPage";
import SearchPage from "./pages/SearchPage";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            photoURL: user.photoURL,
            displayName: user.displayName,
          })
        );
      } else {
        dispatch(clearUser());
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, navigate]);

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/moim/create" element={<CreateMoimPage />}></Route>
          <Route path="/moim/:moimid" element={<MoimDetailPage />}></Route>
          <Route
            path="/moim/:moimid/update"
            element={<UpdateMoimPage />}
          ></Route>
          <Route path="/search" element={<SearchPage />}></Route>
        </Route>
        <Route element={<MyPageLayout />}>
          <Route path="/mypage/edit" element={<EditPage />}></Route>
          <Route path="/mypage/mymoim" element={<MyMoimPage />}></Route>
        </Route>
        <Route element={<CategoryLayout />}>
          <Route path="/categorylist" element={<CategoryListPage />}></Route>
          <Route
            path="/category/:categoryItem"
            element={<CategoryItemPage />}
          ></Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/moim/:moimid/chat" element={<MoimChattingPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
