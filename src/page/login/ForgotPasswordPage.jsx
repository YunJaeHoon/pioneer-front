import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../util/apiUtil";
import style from "./ForgotPasswordPageStyle.module.css"

import cactusIcon from "../../asset/cactus-icon.svg";

function ForgotPasswordPage()
{
    const navigate = useNavigate();

    // state
    const [email, setEmail] = useState("");             // 이메일
    const [isWaiting, setIsWaiting] = useState(false);  // 응답 기다림 여부


    // 비밀번호 초기화
    async function resetPassword(e)
    {
        e.preventDefault();

        if(isWaiting) {
            return;
        }
        
        setIsWaiting(true);

        try {
            await apiRequest("/user/reset-password", "POST", {
                "email": email,
            });

            alert("비밀번호가 성공적으로 초기화되었습니다.\n이메일을 확인해주세요.");
            navigate("/login");
            window.location.reload();
        } catch(e) {
            alert(e.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
            setIsWaiting(false);
        }
    };

    return (
        <div id={style["container"]}>
            <img src={cactusIcon} id={style["main-icon"]}/>
            <form className={style["send-password-form"]} onSubmit={resetPassword}>
                <div id={style["input-text"]}>
                    이메일을 입력하세요.
                </div>
                <input
                    id={style["input"]}
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e)=>{
                        const filteredValue = e.target.value.replace(/[가-힣ㄱ-ㅎㅏ-ㅣ]/g, '');
                        setEmail(filteredValue);
                    }}
                    required
                />
                <button type="submit" id={style["reset-password-btn"]} disabled={isWaiting}>
                    확인
                </button>
            </form>
        </div>
    );
}

export default ForgotPasswordPage;