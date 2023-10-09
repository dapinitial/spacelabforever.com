import { Outlet } from "react-router-dom"
import NavBar from "./NavBar/NavBar"
import styles from './Layout.module.scss';

const Layout = () => {
    return (
        <main className={styles.Layout}>
            <Outlet />
            <NavBar />
        </main>
    )
}

export default Layout