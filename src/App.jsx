import { useState, useEffect } from 'react'
import axios from 'axios'
import style from "./AppStyle.module.css"

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
        <div>
            <div id={style["title"]}>서부의 바람은, 손끝으로 분다.</div>
            <div id={style["content"]}>이메일을 입력하세요.</div>
        </div>
    );
}

export default App
