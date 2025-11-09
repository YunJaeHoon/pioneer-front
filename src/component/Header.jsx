import { Link } from "react-router-dom";
import style from "./HeaderStyle.module.css"

import logo from "../asset/logo.svg"

function Header()
{
    return (
        <div id={style["main-container"]}>
            <div id={style["left-container"]}>
                <Link to="/">
                    <img src={logo} id={style["logo"]}/>
                </Link>
            </div>
            <div id={style["right-container"]}>
                오른쪽
            </div>
        </div>
    );
}

export default Header