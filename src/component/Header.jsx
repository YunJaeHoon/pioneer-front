import { useState } from "react";
import { Link } from "react-router-dom";
import style from "./HeaderStyle.module.css"

import logo from "../asset/logo.svg";
import loginIcon from "../asset/login-icon.svg";
import linkLeftParentheses from "../asset/link-left-parentheses.svg";
import linkRightParentheses from "../asset/link-right-parentheses.svg";

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

function Header()
{
    // state
    const [hasLogin, setHasLogin] = useState(false);

    return (
        <div id={style["main-container"]}>
            <div id={style["left-container"]}>
                <Link to="/" id={style["logo"]}>
                    <img src={logo} className={style["btn"]}/>
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
                    ) : (
                        <div>완료</div>
                    )
                }
            </div>
        </div>
    );
}

export default Header