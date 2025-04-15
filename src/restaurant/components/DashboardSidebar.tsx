import { useLocation, useNavigate } from "react-router-dom";
import styles from "./DashboardSidebar.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faSquarePlus, faRectangleList, faClipboardList } from "@fortawesome/free-solid-svg-icons";

const navItems = [
    { name: "Active Orders", icon: faClipboardList, link: "" },
    { name: "Menu", icon: faHome, link: "/menu" },
    { name: "Add Items", icon: faSquarePlus, link: "/add-items" },
    { name: "Orders", icon: faRectangleList, link: "/orders" },
    { name: "Account", icon: faUser, link: "/account" }
]

const DashboardSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const basePath = "/restaurant/dashboard";
    const handleNavigation = (item: { name: String; link: string }) => {
        navigate(`${basePath}${item.link}`);
    };


    return (
        <div className={`d-flex flex-column ${styles.sidebar}`}>
            <ul className="nav flex-column">
                {navItems.map((item) => (
                    <li key={item.name} className={`nav-item ${styles.navItem}`}>
                        <a
                            className={`${styles.navLink} ${(item.link === "" && location.pathname === `/restaurant/dashboard`) ||
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
                                className={`${styles.icon}`}
                            />
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default DashboardSidebar;