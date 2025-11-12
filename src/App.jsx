import { useState, useEffect, createContext } from 'react'
import axios from 'axios'
import style from "./AppStyle.module.css"
import { Route, Routes } from 'react-router-dom';
import HomePage from './page/HomePage';
import Header from './component/Header';
import Footer from './component/Footer';

// Context API
export const UserRoleContext = createContext();

function App()
{
    // context
    const [userRole, setUserRole] = useState(undefined);

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
            <UserRoleContext.Provider value={{ userRole, setUserRole }}>

                <Header />
                
                <Routes>
                    <Route path="/" element={<HomePage />} />
                </Routes>

                <Footer />

            </UserRoleContext.Provider>
        </div>
    );
}

export default App
