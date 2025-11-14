import { useEffect } from 'react'
import axios from 'axios'
import style from "./AppStyle.module.css"
import { Route, Routes } from 'react-router-dom';
import HomePage from './page/home/HomePage';
import Header from './component/Header';
import Footer from './component/Footer';
import LoginPage from './page/login/LoginPage';

function App()
{
    // 서버 연결 테스트
    useEffect(() => {
        async function testBackend() {
            let response = await axios.get("/test/success");
            console.log(response.data?.message);
        }
        testBackend();
    }, []);  

    return (
        <div id={style["container"]}>

            <Header />
            
            <div id={style["content"]}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </div>

            <Footer />

        </div>
    );
}

export default App
