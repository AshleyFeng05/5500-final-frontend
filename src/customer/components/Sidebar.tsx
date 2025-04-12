import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Sidebar.module.css";
import {
    faHome,
    faShoppingBag,
    faSearch,
    faClipboardList,
    faUser,
    faDog,
    faHeart,
    faCapsules,
    faGlassCheers,
    faStore,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { name: "Home", icon: faHome, link: "" },
        { name: "Grocery", icon: faStore, link: "/grocery" },
        { name: "Retail", icon: faShoppingBag, link: "/retail" },
        { name: "Convenience", icon: faSearch, link: "/convenience" },
        { name: "Beauty", icon: faHeart, link: "/beauty" },
        { name: "Pets", icon: faDog, link: "/pets" },
        { name: "Health", icon: faCapsules, link: "/health" },
        { name: "Party", icon: faGlassCheers, link: "/party" },
    ]
    const accountNavItems = [
        { name: "Orders", icon: faClipboardList, link: "/orders" },
        { name: "Account", icon: faUser, link: "/account" },
    ]

    const handleNavigation = (item: { name: String; link: string }) => {
        const basePath = location.pathname.split("/")[1];
        const fullPath = `/${basePath}${item.link}`;
        navigate(fullPath);
    };

    return (
        <div className={`d-flex flex-column ${styles.sidebar}`}>
            <ul className="nav flex-column">
                {navItems.map((item) => (
                    <li key={item.name} className={`nav-item ${styles.navItem}`}>
                        <a
                            className={`${styles.navLink} ${(item.link === "" && location.pathname === `/${location.pathname.split("/")[1]}`) ||
                                    (item.link !== "" && location.pathname.endsWith(item.link))
                                    ? styles.active
                                    : ""
                                }`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavigation(item);
                            }}
                        >
                            <FontAwesomeIcon
                                icon={item.icon}
                                className={`me-3 ${styles.icon}`}
                            />
                            {item.name}
                        </a>
                    </li>
                ))}

                <hr className={styles.hr} />

                {accountNavItems.map((item) => (
                    <li key={item.name} className={`nav-item ${styles.navItem}`}>
                        <a
                            className={`${styles.navLink} ${location.pathname.endsWith(item.link) ? styles.active : ""}`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavigation(item);
                            }}
                        >
                            <FontAwesomeIcon
                                icon={item.icon}
                                className={`me-3 ${styles.icon}`}
                            />
                            {item.name}
                        </a>
                    </li>
                ))}

            </ul>
        </div>
    );
};
export default Sidebar;