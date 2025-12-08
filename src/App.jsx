import { useEffect } from 'react'
import style from "./AppStyle.module.css"
import { Route, Routes } from 'react-router-dom';
import { apiRequest } from "./util/apiUtil";

import HomePage from './page/home/HomePage';
import Header from './component/Header';
import Footer from './component/Footer';
import LoginPage from './page/login/LoginPage';
import JoinPage from './page/login/JoinPage';
import ForgotPasswordPage from './page/login/ForgotPasswordPage';

function App()
{
    // 서버 연결 테스트
    useEffect(() => {
        async function testBackend() {
            try {
                await apiRequest("/test/success", "GET", null);
                console.log("백엔드 서버와 정상적으로 연결되었습니다.");
            } catch(e) {
                console.log(e);
                alert(e.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
            }
        };

        testBackend();
    }, []);  

    return (
        <div id={style["container"]}>

            <Header />
            
            <div id={style["content"]}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/join" element={<JoinPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                </Routes>
            </div>

            <Footer />

        </div>
    );
}

export default App
