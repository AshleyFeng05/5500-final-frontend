import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../restaurant/components/DashboardSidebar.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faListCheck } from "@fortawesome/free-solid-svg-icons";
import { faRectangleList, faUser } from "@fortawesome/free-regular-svg-icons";


const navItems = [
    { name: "Active Order", icon: faClipboardList, link: "" },
    { name: "Available Orders", icon: faListCheck, link: "/available-orders" },
    { name: "Orders", icon: faRectangleList, link: "/orders" },
    { name: "Account", icon: faUser, link: "/account" }
]

const DashboardSidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const basePath = "/dasher/dashboard";
    const handleNavigation = (item: { name: String; link: string }) => {
        navigate(`${basePath}${item.link}`);
    };

    return (
        <div className={`d-flex flex-column ${styles.sidebar}`}>
            <ul className="nav flex-column">
                {navItems.map((item) => (
                    <li key={item.name} className={`nav-item ${styles.navItem}`}>
                        <a
                            className={`${styles.navLink} ${(item.link === "" && location.pathname === `/dasher/dashboard`) ||
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
