import React from 'react'
import styles from './Loader.module.scss';

const Loader = () => {
    return (
        <>
            <svg id="loaderSvg" version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <defs></defs>
                <g id="loadingGroup" fill="#FFFFFF" fillRule="evenodd">
                    <symbol id="text">
                        <text>
                            <tspan dy="50rem" x="-30px" y="-10rem" dx="110rem">spacelab</tspan>
                            <tspan dy="30rem" x="-50px" y="45rem" dx="125rem">forever</tspan>
                            <tspan dy="50rem" x="-25px" y="50rem" dx="90rem">is loading</tspan>
                        </text>
                    </symbol>
                    <use xlinkHref="#text"></use>
                </g>
            </svg>
            <div className={styles.LoadingComponent}>
                <section className={styles.oadingComponent__shade}>
                    <section className={styles.LoadingComponent__circle}>
                        <div className={styles.LoadingComponent__circleInner} />
                        <div className={styles.LoadingComponent__lineMask}>
                            <div className={styles.LoadingComponent__line} />
                        </div>
                        <p className={styles.LoadingComponent__symbol}>.</p>
                    </section>
                </section>
            </div>
        </>)
};

export default Loader;