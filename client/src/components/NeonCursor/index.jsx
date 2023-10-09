import { useEffect } from 'react';
import { neonCursor } from 'threejs-toys';

const NeonCursor = () => {
    useEffect(() => {

        neonCursor({
            el: document.getElementById('root'),
            shaderPoints: 16,
            curvePoints: 5,
            curveLerp: .5,
            radius1: 10,
            radius2: 10,
            velocityTreshold: 20,
            sleepRadiusX: 1000,
            sleepRadiusY: 50,
            sleepTimeCoefX: 0.0025,
            sleepTimeCoefY: 0.0025,
        });

        return () => {
        };
    }, []);

    return null; // Since this component doesn't render anything
};

export default NeonCursor;
