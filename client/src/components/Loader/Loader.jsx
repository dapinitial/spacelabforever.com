import React from 'react';
import styles from './Loader.module.scss';

const Loader = () => {
    return (
        <div className={styles.Loader}>
            <svg
                id="loaderSvg"
                version="1.1"
                xmlSpace="preserve"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <defs></defs>
                <g id="loadingGroup" fill="#FFFFFF" fillRule="evenodd">
                    <symbol id="text">
                        <text className={styles.tspanStyles}>
                            <tspan dy="50px" x="-30px" y="-20px" dx="110px">
                                spacelab
                            </tspan>
                            <tspan dy="30px" x="-50px" y="45px" dx="125px">
                                forever
                            </tspan>
                            <tspan dy="50px" x="-25px" y="60px" dx="90px">
                                is loading
                            </tspan>
                        </text>
                    </symbol>
                    <use xlinkHref="#text"></use>
                </g>
            </svg>
            <div className={styles.LoadingComponent}>
                <section className={styles.LoadingComponent__shade}>
                    <section className={styles.LoadingComponent__circle}>
                        <div className={styles.LoadingComponent__circleInner} />
                        <div className={styles.LoadingComponent__lineMask}>
                            <div className={styles.LoadingComponent__line} />
                        </div>
                        <p className={styles.LoadingComponent__symbol}>.</p>
                    </section>
                </section>
            </div>
        </div>
    );
};

export default Loader;
