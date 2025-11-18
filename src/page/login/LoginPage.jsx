import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import style from "./LoginPageStyle.module.css"

import starIcon from "../../asset/star-icon.svg";
import emailIcon from "../../asset/email-icon.svg";
import passwordIcon from "../../asset/password-icon.svg";
import showPasswordIcon from "../../asset/show-password-icon.svg";
import unshowPasswordIcon from "../../asset/unshow-password-icon.svg";

function LoginPage()
{
    const navigate = useNavigate();

    // state
    const [email, setEmail] = useState("");                     // 이메일
    const [password, setPassword] = useState("");               // 비밀번호
    const [showPassword, setShowPassword] = useState(false);    // 비밀번호 표시 여부
    const [isWaiting, setIsWaiting] = useState(false);          // 응답 기다림 여부

    // 로그인
    function login(e)
    {
        e.preventDefault();

        if(isWaiting) {
            return;
        }
        
        setIsWaiting(true);

        axios.post(
            "/login",
            {
                "email": email,
                "password": password
            },
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            }
        ).then((response) => {
            const cookies = document.cookie.split(";");

            for(let i = 0; i < cookies.length; i++)
            {
                const cookie = cookies[i].trim();

                if(cookie.startsWith("access-token="))
                {
                    const accessToken = cookie.substring("access-token".length + 1);

                    axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;

                    navigate("/");
                    window.location.reload();
                }
            }
        })
        .catch((error) => {
            alert(error.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
            setIsWaiting(false);
        });
    };

    return (
        <div id={style["container"]}>
            <img src={starIcon} id={style["main-icon"]}/>
            <form className={style["login-form"]} onSubmit={login}>
                <div className={style["input-container"]}>
                    <img src={emailIcon} className={style["input-icon"]}/>
                    <input
                        className={style["input"]}
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e)=>{
                            setEmail(e.target.value);
                        }}
                        required
                    />
                </div>
                <div className={style["input-container"]}>
                    <img src={passwordIcon} className={style["input-icon"]}/>
                    <input
                        className={style["input"]}
                        type={showPassword ? "text" : "password"}
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e)=>{
                            setPassword(e.target.value);
                        }}
                        required
                    />
                    <button
                        type="button"
                        id={style["password-toggle-btn"]}
                        onClick={() => {
                            setShowPassword(!showPassword);
                        }}
                    >
                        <img src={showPassword ? showPasswordIcon : unshowPasswordIcon} id={style["show-password-icon"]}/>
                    </button>
                </div>
                
                <button type="submit" id={style["login-btn"]} disabled={isWaiting}>
                    로그인
                </button>

                <div id={style["forgot-password-container"]}>
                    <Link to="/forgot-password" id={style["forgot-password-link"]}>
                        비밀번호를 잊으셨나요?
                    </Link>
                </div>
            </form>

            <div id={style["or-container"]}>
                <div className={style["or-line"]}></div>
                <div id={style["or-text"]}>또는</div>
                <div className={style["or-line"]}></div>
            </div>

            <Link to="/join" id={style["join-btn"]}>
                회원가입
            </Link>
        </div>
    );
}

export default LoginPage;