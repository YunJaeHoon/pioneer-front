import { useState, useEffect } from 'react'
import axios from 'axios'

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
            <h1>프론트엔드 테스트</h1>
        </div>
    );
}

export default App
