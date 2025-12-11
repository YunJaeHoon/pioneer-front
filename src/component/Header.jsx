import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "./HeaderStyle.module.css"

import logo from "../asset/logo.svg";
import loginIcon from "../asset/login-icon.svg";
import optionIcon from "../asset/option-icon.svg";
import linkLeftParentheses from "../asset/link-left-parentheses.svg";
import linkRightParentheses from "../asset/link-right-parentheses.svg";
import { apiRequest } from "../util/apiUtil";

function Header()
{
    // 프로필 이미지 불러오기
    const profileImages = import.meta.glob("../asset/profile-image/*.svg", {
        eager: true,
        import: "default",
    });

    // (프로필 이미지 파일, 프로필 이미지 파일명) 매핑 객체로 생성
    const profileImageMap = Object.fromEntries(
        Object.entries(profileImages).map(([path, src]) => {
            const fileName = path.split("/").pop().replace(".svg", ""); 
            return [fileName, src];
        })
    );

    // state
    const [hasLogin, setHasLogin] = useState(false);            // 로그인 여부
    const [isProfileOpen, setIsProfileOpen] = useState(false);  // 프로필 클릭 여부
    const [nickname, setNickname] = useState("");               // 닉네임
    const [profileImage, setProfileImage] = useState("");       // 프로필 이미지
    const [level, setLevel] = useState(0);                      // 현재 레벨
    const [exp, setExp] = useState(0);                          // 현재 경험치
    const [requiredExp, setRequiredExp] = useState(0);          // 레벨업에 필요한 총 경험치

    // 로그인 여부 확인
    useEffect(() => {
        async function checkLogin() {
            try {
                const userBasicInfo = await apiRequest("/user/basic-info", "GET", null);
                console.log(userBasicInfo);

                setHasLogin(true);
                setNickname(userBasicInfo.nickname);
                setProfileImage(userBasicInfo.profileImage)
                setLevel(userBasicInfo.level);
                setExp(userBasicInfo.exp);
                setRequiredExp(userBasicInfo.requiredExp);

            } catch {
                setHasLogin(false);
            }
        };

        checkLogin();
    }, []);  

    return (
        <div id={style["main-container"]}>
            <div id={style["left-container"]}>
                <Link to="/" id={style["logo"]}>
                    <img src={logo} className={style["btn"]} alt="logo"/>
                </Link>
                <HeaderLink to="/fight" label="결투" />
                <HeaderLink to="/weapons" label="무기고" />
                <HeaderLink to="/challenges" label="도전 과제" />
                <HeaderLink to="/records" label="기록장" />
            </div>
            <div id={style["right-container"]}>
                {
                    !hasLogin ? (
                        <Link to="/login">
                            <img src={loginIcon} id={style["login-icon"]} className={style["btn"]}/>
                        </Link>
                    ) : !isProfileOpen ? (
                        <div
                            id={style["profile-icon-container"]}
                            onClick={() => { setIsProfileOpen(!isProfileOpen); }}
                        >
                            <img
                                src={profileImageMap[profileImage]}
                                id={style["profile-icon"]}
                                alt="profile-icon"
                            />
                            <div id={style["profile-level-badge"]}>
                                {level}
                            </div>
                        </div>
                    ) : (
                        <div id={style["profile-panel"]} onClick={() => {setIsProfileOpen(!isProfileOpen)}}>
                            <div id={style["profile-row"]}>
                                <div id={style["profile-row-icon-container"]}>
                                    <img
                                        src={profileImageMap[profileImage]}
                                        id={style["profile-row-icon"]}
                                    />
                                    <div id={style["profile-row-level-badge"]}>
                                        {level}
                                    </div>
                                </div>
                                <div id={style["profile-row-nickname"]}>
                                    {nickname}
                                </div>
                                <img
                                    src={optionIcon}
                                    id={style["profile-option-icon"]}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("옵션 아이콘 클릭됨!");
                                    }}
                                />
                            </div>

                            <div id={style["exp-row"]}>
                                <div id={style["exp-bar"]}>
                                    <div
                                        id={style["exp-fill"]}
                                        style={{ width: `${(exp / requiredExp) * 100}%` }}
                                    ></div>
                                </div>
                                <div id={style["exp-text"]}>
                                    {exp} / {requiredExp}
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

function HeaderLink({ to, label })
{
    return (
        <Link to={to} className={style["link-container"]}>
            <img src={linkLeftParentheses} className={style["link-decorator"]}/>
            <div className={style["link-text"]}>{label}</div>
            <img src={linkRightParentheses} className={style["link-decorator"]}/>
        </Link>
    );
}

export default Header