import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faReceipt, faUser } from "@fortawesome/free-solid-svg-icons";
import styles from './Sidebar.module.css';

const Sidebar = () => {
    const [expanded, setExpanded] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => {
        return (path === "/dashboard" && location.pathname === `/dashboard`) || (path !== "/dashboard" && location.pathname.endsWith(path));
    };

    const toggleSidebar = (expand: boolean) => {
        setExpanded(expand);
    };

    return (
        <>
            <div
                className={`${styles.sidebar} ${expanded ? styles.expanded : ""}`}
                onMouseEnter={() => toggleSidebar(true)}
                onMouseLeave={() => toggleSidebar(false)}
            >
                <Link
                    to="/dashboard"
                    className={`${styles.navLink} ${isActive('/dashboard') ? styles.active : ''}`}
                >
                    <FontAwesomeIcon icon={faUtensils} className={styles.icon} />
                    <span className={styles.iconText}>Restaurants</span>
                </Link>

                <div className={styles.separator}></div>

                <Link
                    to="/dashboard/orders"
                    className={`${styles.navLink} ${isActive('/dashboard/orders') ? styles.active : ''}`}
                >
                    <FontAwesomeIcon icon={faReceipt} className={styles.icon} />
                    <span className={styles.iconText}>Orders</span>
                </Link>

                <Link
                    to="/dashboard/account"
                    className={`${styles.navLink} ${isActive('/dashboard/account') ? styles.active : ''}`}
                >
                    <FontAwesomeIcon icon={faUser} className={styles.icon} />
                    <span className={styles.iconText}>Account</span>
                </Link>
            </div>
        </>
    );
};

export default Sidebar;