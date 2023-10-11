import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useSignout from '../../../hooks/useSignout';
import styles from './NavBar.module.scss';

const ROLES = {
    'User': 2001,
    'Editor': 1984,
    'Admin': 5150
};

const NavBar = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const signout = useSignout();

    const signOut = async () => {
        await signout();
        navigate('/');
    }

    const navLinks = [
        { path: '/', displayName: 'Home', allowedRoles: [] },
        { path: '/about-us', displayName: 'Origins', allowedRoles: [ROLES.User] },
        { path: '/blog', displayName: 'Blog', allowedRoles: [ROLES.User] },
        { path: '/blog/create', displayName: 'Add Post', allowedRoles: [ROLES.Admin] },
        { path: '/contact', displayName: 'Contact', allowedRoles: [ROLES.User] },
        { path: '/guestbook', displayName: 'Guestbook', allowedRoles: [ROLES.User] },
        { path: '/training', displayName: 'Training', allowedRoles: [ROLES.User] },
        { path: '/music', displayName: 'Music', allowedRoles: [ROLES.User] },
        { path: '/admin', displayName: 'Admin', allowedRoles: [ROLES.Admin] },

    ];

    if (auth?.roles.includes(ROLES.User)) {
        navLinks.push({ path: '#', displayName: 'Sign Out', allowedRoles: [ROLES.User], action: signOut });
    } else {
        navLinks.push({ path: '/sign-in', displayName: 'Sign In', allowedRoles: [] });
    }

    const activeLinkIndex = navLinks.findIndex(link => link.path === location.pathname);
    const shouldRenderLink = (link) => {
        if (link.displayName === 'Sign In' || link.displayName === 'Training' || link.displayName === 'Contact' || link.displayName === 'Home') {
            return true;
        }
        if (auth?.roles.some(role => link.allowedRoles.includes(role))) {
            return true;
        }
        return false;
    }

    let effectiveIndex = 0;
    let currentIndex = -1;

    const renderedLinks = navLinks.map((link, index) => {
        if (shouldRenderLink(link)) {
            const isCurrentPath = location.pathname === link.path;
            if (isCurrentPath) {
                currentIndex = effectiveIndex;
            }
            effectiveIndex++;

            return (
                <li className={`${styles.nav__link} ${isCurrentPath ? styles.active : ''}`} key={link.path.replace(/\//g, '-').replace(/^-/, '')}>
                    <Link className={`${isCurrentPath ? styles.active : ''}`} to={link.path} onClick={link.action ? (e) => { e.preventDefault(); link.action(); } : null}>
                        {link.displayName}
                    </Link>
                </li>
            );
        }
        return null;
    });

    const computeBarTop = (index) => {
        const baseHeight = 70;
        return `${index * baseHeight}px`;
    };

    return (
        <nav className={styles.NavBar}>
            <ul className={styles.nav}>
                {renderedLinks}
                <div className={`${styles.nav__bar}`} style={{ top: computeBarTop(currentIndex) }}></div>
            </ul>
        </nav>
    );
};

export default NavBar;