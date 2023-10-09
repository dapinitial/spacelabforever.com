import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
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
        navLinks.push({
            path: '#',
            displayName: 'Sign Out',
            allowedRoles: [ROLES.User],
            action: signOut
        }
        );
    };

    if (!auth || !auth.roles || auth.roles.length === 0) {
        navLinks.push(
            {
                path: '/sign-in',
                displayName: 'Sign In',
                allowedRoles: []  // empty, because the display is based on the absence of roles
            }
        );
    };

    return (
        <nav className={styles.NavBar}>
            <ul>
                {navLinks.map(link => (
                    (link.displayName === 'Sign In' || link.displayName === 'Training' || link.displayName === 'Contact' || link.displayName === 'Home' || auth?.roles.some(role => link.allowedRoles.includes(role))) && (
                        <li key={link.path.replace(/\//g, '-').replace(/^-/, '')}>
                            <Link to={link.path} onClick={link.action ? (e) => { e.preventDefault(); link.action(); } : null}>
                                {link.displayName}
                            </Link>
                        </li>
                    )
                ))}
            </ul>
        </nav>
    );
};

export default NavBar;