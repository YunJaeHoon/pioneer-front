import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./JoinPageStyle.module.css"
import { apiRequest } from "../../util/apiUtil";

import westernImage from "../../asset/join-image.svg";
import showPasswordIcon from "../../asset/show-password-icon.svg";
import unshowPasswordIcon from "../../asset/unshow-password-icon.svg";
import checkIcon from "../../asset/check-icon.svg";
import xIcon from "../../asset/x-icon.svg";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{};:'",.<>/?`~\\|])[A-Za-z\d!@#$%^&*()\-_=+\[\]{};:'",.<>/?`~\\|]{8,20}$/;
const NICKNAME_REGEX = /^[A-Za-z0-9가-힣]{2,12}$/;

function JoinPage()
{
    const navigate = useNavigate();

    // state
    const [email, setEmail] = useState("");                                                     // 이메일
    const [password, setPassword] = useState("");                                               // 비밀번호
    const [passwordCheck, setPasswordCheck] = useState("");                                     // 비밀번호 확인
    const [nickname, setNickname] = useState("");                                               // 닉네임
    const [verificationCode, setVerificationCode] = useState("");                               // 인증번호
    const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);                // 이메일 인증번호 전송 여부
    const [isVerificationCodeChecked, setIsVerificationCodeChecked] = useState(false);          // 이메일 인증번호 확인 여부
    const [isPasswordFormatValid, setIsPasswordFormatValid] = useState(false);                  // 비밀번호 형식 체크 여부
    const [isPasswordChecked, setIsPasswordChecked] = useState(false);                          // 비밀번호 확인 여부
    const [isNicknameFormatValid, setIsNicknameFormatValid] = useState(false);                  // 닉네임 형식 체크 여부
    const [isNicknameDuplicationChecked, setIsNicknameDuplicationChecked] = useState(false);    // 닉네임 중복 확인 여부
    const [showPassword, setShowPassword] = useState(false);                                    // 비밀번호 표시 여부
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);                          // 비밀번호 확인 표시 여부
    const [isWaiting, setIsWaiting] = useState(false);                                          // 응답 기다림 여부
    const [verificationCodeTimer, setVerificationCodeTimer] = useState(0);                      // 이메일 인증번호 타이머

    // 이메일 인증번호 타이머
    useEffect(() => {
        if(!isVerificationCodeSent || isVerificationCodeChecked) {
            return;
        }

        if(verificationCodeTimer <= 0) {
            setIsVerificationCodeSent(false);
            return;
        }

        const interval = setInterval(() => {
            setVerificationCodeTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [verificationCodeTimer, isVerificationCodeSent, isVerificationCodeChecked]);

    // 이메일 인증번호 전송
    function sendVerificationCode()
    {
        if(isWaiting) {
            return;
        }

        setIsWaiting(true);
        setVerificationCode("");

        try {
            apiRequest("/user/send-verification-code", "POST", {
                "email": email
            });

            setIsVerificationCodeSent(true);
            setVerificationCodeTimer(600);
        } catch(e) {
            alert(e.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
        } finally {
            setIsWaiting(false);
        }
    }

    // 이메일 인증번호 확인
    function checkVerificationCode()
    {
        if(isWaiting) {
            return;
        }

        if(verificationCode === "") {
            alert("이메일로 받은 인증번호를 입력해주세요.");
            return;
        }

        setIsWaiting(true);

        try {
            apiRequest("/user/check-verification-code", "POST", {
                "email": email,
                "verificationCode": verificationCode
            });

            setIsVerificationCodeChecked(true);
            alert("이메일 인증번호가 확인되었습니다!");
        } catch(e) {
            setIsVerificationCodeSent(false);
            alert(e.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
        } finally {
            setIsWaiting(false);
        }
    }

    // 닉네임 중복 확인
    function checkNicknameDuplication()
    {
        if(isWaiting) {
            return;
        }

        setIsWaiting(true);

        try {
            apiRequest("/user/check-nickname-duplication", "GET", {
                "nickname": nickname
            });

            setIsNicknameDuplicationChecked(true);
            alert("사용 가능한 닉네임입니다!");
        } catch(e) {
            setIsNicknameDuplicationChecked(false);
            alert(e.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
        } finally {
            setIsWaiting(false);
        }
    }

    // 회원가입
    function join(e)
    {
        e.preventDefault();

        if(isWaiting) {
            return;
        }
       
        setIsWaiting(true);

        try {
            apiRequest("/user/join", "POST", {
                "email": email,
                "password": password,
                "nickname": nickname
            });

            alert("회원가입에 성공하였습니다!");
            navigate("/login");
            window.location.reload();
        } catch(e) {
            alert(e.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
            setIsWaiting(false);
        }
    }

    // 초 단위를 타이머 형식으로 변경
    function formatTime(sec)
    {
        const m = Math.floor(sec / 60).toString().padStart(2, "0");
        const s = (sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    return (
        <div id={style["container"]}>
            <img src={westernImage} id={style["main-image"]}/>
            <form className={style["join-form"]} onSubmit={join}>

                <div className={style["input-title"]}>이메일</div>
                <div className={style["input-container"]}>
                    <input
                        className={style["input"]}
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e)=>{
                            setEmail(e.target.value);
                            setIsVerificationCodeSent(false);
                            setIsVerificationCodeChecked(false);
                        }}
                        autoComplete = "new-password"
                        required
                    />
                </div>
                {
                    isVerificationCodeChecked ? <div className={style["already-check-message"]}>이메일 인증번호 확인이 완료되었습니다.</div> :
                    isVerificationCodeSent ?
                    <div id={style["verification-code-input-container"]}>
                        <input
                            className={style["input"]}
                            type="text"
                            placeholder="인증번호 입력"
                            value={verificationCode}
                            onChange={(e)=>{
                                setVerificationCode(e.target.value);
                            }}
                            autoComplete="new-password"
                            required
                        />
                        <div id={style["verification-code-timer"]}>
                            {formatTime(verificationCodeTimer)}
                        </div>
                        <button
                            type="button"
                            id={style["check-verification-code-btn"]}
                            onClick={checkVerificationCode}
                            disabled={isWaiting}
                        >
                            인증번호 확인
                        </button>
                    </div> :
                    <button
                        type="button"
                        className={style["send-verification-code-btn"]}
                        onClick={sendVerificationCode}
                        disabled={isWaiting}
                    >
                        인증번호 전송
                    </button>
                }

                <div className={style["input-title"]}>비밀번호</div>
                <div className={style["input-container"]}>
                    <input
                        className={style["input"]}
                        type={showPassword ? "text" : "password"}
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e)=>{
                            setPassword(e.target.value);
                            setIsPasswordFormatValid(PASSWORD_REGEX.test(e.target.value));
                            setIsPasswordChecked(e.target.value === passwordCheck);
                        }}
                        autoComplete="new-password"
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
                <div className={style["input-container"]}>
                    <input
                        className={style["input"]}
                        type={showPasswordCheck ? "text" : "password"}
                        placeholder="비밀번호 확인"
                        value={passwordCheck}
                        onChange={(e)=>{
                            setPasswordCheck(e.target.value);
                            setIsPasswordChecked(password === e.target.value);
                        }}
                        autoComplete="new-password"
                        required
                    />
                    <button
                        type="button"
                        id={style["password-toggle-btn"]}
                        onClick={() => {
                            setShowPasswordCheck(!showPasswordCheck);
                        }}
                    >
                        <img src={showPasswordCheck ? showPasswordIcon : unshowPasswordIcon} id={style["show-password-icon"]}/>
                    </button>
                </div>

                <div className={style["input-title"]}>닉네임</div>
                <div className={style["input-container"]}>
                    <input
                        className={style["input"]}
                        type="text"
                        placeholder="닉네임"
                        value={nickname}
                        onChange={(e)=>{
                            setNickname(e.target.value);
                            setIsNicknameFormatValid(NICKNAME_REGEX.test(e.target.value));
                            setIsNicknameDuplicationChecked(false);
                        }}
                        autoComplete="new-password"
                        required
                    />
                </div>
                {
                    isNicknameDuplicationChecked ? <div className={style["already-check-message"]}>닉네임 중복 확인이 완료되었습니다.</div> :
                    <button
                        type="button"
                        className={style["send-verification-code-btn"]}
                        onClick={checkNicknameDuplication}
                        disabled={isWaiting}
                    >
                        닉네임 중복 확인
                    </button>
                }

                <div id={style["join-availability-container"]}>
                    <div className={style["join-availability-subcontainer"]}>
                        <img src={isVerificationCodeChecked ? checkIcon : xIcon} className={style["join-availability-icon"]}/>
                        <div className={style["join-availability-text"]}>이메일 인증번호 확인이 필요합니다.</div>
                    </div>
                    <div className={style["join-availability-subcontainer"]}>
                        <img src={isPasswordFormatValid ? checkIcon : xIcon} className={style["join-availability-icon"]}/>
                        <div className={style["join-availability-text"]}>비밀번호는 영문, 숫자, 특수문자로 이루어진<br/>8 ~ 20 글자여야 합니다.</div>
                    </div>
                    <div className={style["join-availability-subcontainer"]}>
                        <img src={isNicknameFormatValid ? checkIcon : xIcon} className={style["join-availability-icon"]}/>
                        <div className={style["join-availability-text"]}>닉네임은 영문, 한글, 숫자만 가능하며,<br/>2 ~ 12 글자여야 합니다.</div>
                    </div>
                    <div className={style["join-availability-subcontainer"]}>
                        <img src={isPasswordChecked ? checkIcon : xIcon} className={style["join-availability-icon"]}/>
                        <div className={style["join-availability-text"]}>비밀번호와 비밀번호 확인이 일치해야 합니다.</div>
                    </div>
                    <div className={style["join-availability-subcontainer"]}>
                        <img src={isNicknameDuplicationChecked ? checkIcon : xIcon} className={style["join-availability-icon"]}/>
                        <div className={style["join-availability-text"]}>닉네임 중복 확인을 수행해야 합니다.</div>
                    </div>
                </div>

                <button
                    type="submit"
                    id={style["join-btn"]}
                    disabled={
                        isWaiting ||
                        !isVerificationCodeChecked ||
                        !isPasswordFormatValid ||
                        !isPasswordChecked ||
                        !isNicknameFormatValid ||
                        !isNicknameDuplicationChecked
                    }
                >
                    회원가입
                </button>
            </form>
        </div>
    );
}

export default JoinPage;