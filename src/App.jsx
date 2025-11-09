import { useState, useEffect } from 'react'
import axios from 'axios'
import style from "./AppStyle.module.css"
import { Route, Routes } from 'react-router-dom';
import HomePage from './page/HomePage';
import Header from './component/Header';
import Footer from './component/Footer';

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
            
            <Routes>
                <Route path="/" element={<HomePage />} />
            </Routes>

            <Footer />

        </div>
    );
}

export default App
