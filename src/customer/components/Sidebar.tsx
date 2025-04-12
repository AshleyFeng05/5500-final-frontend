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

const Sidebar = () => {
    return (
        <div className={`d-flex flex-column ${styles.sidebar}`}>
            <ul className="nav flex-column">
                <li className={`nav-item ${styles.navItem}`}>
                    <a href="#" className={`nav-link ${styles.navLink} ${styles.active}`}>
                        <FontAwesomeIcon icon={faHome} className={`me-3 ${styles.icon}`} />
                        Home
                    </a>
                </li>

                <hr className={styles.hr} />

            </ul>
        </div>
    );
};
export default Sidebar;