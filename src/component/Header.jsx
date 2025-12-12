import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../util/apiUtil";
import style from "./HeaderStyle.module.css"

import logo from "../asset/logo.svg";
import linkLeftParentheses from "../asset/link-left-parentheses.svg";
import linkRightParentheses from "../asset/link-right-parentheses.svg";
import loginIcon from "../asset/login-icon.svg";
import optionIcon from "../asset/option-icon/option-icon.svg";
import closeIcon from "../asset/close-icon.svg";
import accountIcon from "../asset/option-icon/account-icon.svg";
import securityIcon from "../asset/option-icon/security-icon.svg";

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

function Header()
{
    // state
    const [hasLogin, setHasLogin] = useState(false);            // 로그인 여부
    const [isProfileOpen, setIsProfileOpen] = useState(false);  // 프로필 클릭 여부
    const [isOptionOpen, setIsOptionOpen] = useState(false);    // 옵션 클릭 여부
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
                                        setIsOptionOpen(!isOptionOpen);
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

            {isOptionOpen && (
                <OptionWindow
                    onClose={(e) => {
                        e.stopPropagation();
                        setIsOptionOpen(false);
                    }}
                    originProfileImage={profileImage}
                    onProfileImageUpdated={(newProfileImage) => {setProfileImage(newProfileImage);}}
                    originNickname={nickname}
                    onNicknameUpdated={(newNickname) => {setNickname(newNickname);}}
                />
            )}
        </div>
    );
}

// 헤더 링크
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

// 옵션 팝업창
function OptionWindow({ onClose, originProfileImage, onProfileImageUpdated, originNickname, onNicknameUpdated })
{
    const navigate = useNavigate();

    // 닉네임 정규 표현식
    const NICKNAME_REGEX = /^[A-Za-z0-9가-힣]{2,12}$/;

    // state
    const [currentSubOption, setCurrentSubOption] = useState("account");            // 현재 하위 옵션
    const [profileImage, setProfileImage] = useState(originProfileImage);           // 프로필 이미지
    const [isProfileSelectorOpen, setIsProfileSelectorOpen] = useState(false);      // 프로필 이미지 선택창 열림 여부
    const [nickname, setNickname] = useState(originNickname);                       // 닉네임
    const [isNicknameChanging, setIsNicknameChanging] = useState(false);            // 닉네임을 변경 중인지 여부
    const [isNicknameFormatValid, setIsNicknameFormatValid] = useState(true);       // 닉네임 형식 체크 여부

    // 닉네임 최신화
    useEffect(() => {
        setNickname(originNickname);
    }, [originNickname]);    

    return (
        <div id={style["option-overlay"]} onClick={onClose}>
            <div
                id={style["option-panel"]}
                onClick={(e) => e.stopPropagation()}
            >
                <div id={style["option-header"]}>
                    <div id={style["option-header-title"]}>환경설정</div>
                    <div id={style["sub-option-bar"]}>
                        <SubOption
                            isSelected={currentSubOption === "account"}
                            onClick={(e)=>{
                                setCurrentSubOption("account");
                            }}
                            iconSource={accountIcon}
                            title="계정 설정"
                        />
                        <SubOption
                            isSelected={currentSubOption === "security"}
                            onClick={(e)=>{
                                setCurrentSubOption("security");
                            }}
                            iconSource={securityIcon}
                            title="보안"
                        />
                    </div>
                </div>

                <div id={style["option-content"]}>
                    
                    {
                        currentSubOption === "account" ?
                        <div style={{width: "100%"}}>
                            <div className={style["option-subtitle"]}>계정 설정</div>
                            <div id={style["option-profile-info-container"]}>
                                <div
                                    id={style["option-profile-icon-wrapper"]}
                                    onClick={() => setIsProfileSelectorOpen(true)}
                                >
                                    <img
                                        src={profileImageMap[profileImage]}
                                        id={style["option-profile-icon"]}
                                    />
                                    <div id={style["option-profile-icon-hover-text"]}>
                                        이미지 변경
                                    </div>
                                </div>
                                <input
                                    id={style["option-nickname-input"]}
                                    placeholder="닉네임"
                                    value={nickname}
                                    onChange={(e) => {
                                        setNickname(e.target.value);
                                        setIsNicknameFormatValid(NICKNAME_REGEX.test(e.target.value));
                                    }}
                                    disabled={!isNicknameChanging}
                                />
                                <button
                                    id={style["option-change-nickname-button"]}
                                    onClick={isNicknameChanging ? async (e) => {

                                        if(!isNicknameFormatValid) {
                                            alert("닉네임은 영문, 한글, 숫자만 가능하며, 2~12 글자여야 합니다.");
                                        } else {
                                            try {
                                                await apiRequest("/user/nickname", "PATCH", {
                                                    "nickname": nickname
                                                });

                                                // 부모 닉네임 최신화
                                                onNicknameUpdated(nickname);

                                                // 닉네임 변경 중 여부 변경
                                                setIsNicknameChanging(!isNicknameChanging);
                                            } catch(e) {
                                                alert(e.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
                                            }
                                        }

                                    } : (e) => {
                                        setIsNicknameChanging(!isNicknameChanging);
                                    }}
                                >
                                    {isNicknameChanging ? "확인" : "닉네임 변경"}
                                </button>
                            </div>
                            <button
                                id={style["logout-button"]}
                                onClick={async (e) => {
                                    try {
                                        await apiRequest("/user/logout", "POST", {});
                                        window.localStorage.removeItem("accessToken");

                                        alert("로그아웃에 성공하였습니다!");
                                        navigate("/");
                                        window.location.reload();
                                    } catch {
                                        alert(e.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
                                    }
                                }}
                            >
                                로그아웃
                            </button>
                        </div>
                         :
                        <div>
                            안녕
                        </div>
                    }

                    <img
                        src={closeIcon}
                        id={style["option-close-button"]}
                        onClick={onClose}
                    />

                </div>
            </div>

            {isProfileSelectorOpen && (
                <ProfileImageSelector
                    onClose={(e) => {
                        e.stopPropagation();
                        setIsProfileSelectorOpen(false);
                    }}
                    onSelect={async (selectedImage) => {
                        try {
                            await apiRequest("/user/profile-image", "PATCH", {
                                "profileImage": selectedImage
                            });

                            // 부모 프로필 이미지 최신화
                            onProfileImageUpdated(selectedImage);
                        } catch(e) {
                            alert(e.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
                        }

                        setProfileImage(selectedImage);
                        setIsProfileSelectorOpen(false);
                    }}
                />
            )}

        </div>
    );
}

// 하위 옵션
function SubOption({ isSelected, onClick, iconSource, title })
{
    return (
        <div
            className={`
                ${style["sub-option-item"]}
                ${isSelected ? style["selected"] : ""}
            `}
            onClick={onClick}
        >
            <img src={iconSource} className={style["sub-option-icon"]} />
            <div className={style["sub-option-title"]}>{title}</div>
        </div>
    );
}

// 프로필 이미지 선택창
function ProfileImageSelector({ onClose, onSelect }) {
    return (
        <div id={style["profile-selector-overlay"]} onClick={onClose}>
            <div id={style["profile-selector-panel"]}>
                <img
                    src={closeIcon}
                    id={style["profile-selector-close"]}
                    onClick={onClose}
                />
                <div id={style["profile-grid"]}>
                    {Object.keys(profileImageMap).map((key) => (
                        <img
                            key={key}
                            src={profileImageMap[key]}
                            id={style["profile-grid-item"]}
                            onClick={() => onSelect(key)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}


export default Header