const geoip = require('geoip-lite');

const contactFormMiddleware = (req, res, next) => {
    const ipAddress = req.ip;
    const geo = geoip.lookup(ipAddress);
    const geolocation = geo ? `${geo.ll[0]}, ${geo.ll[1]}` : 'N/A';

    const userAgent = req.headers['user-agent'] || 'N/A';

    const screenWidth = req.headers['x-screen-width'] || 'N/A';
    const screenHeight = req.headers['x-screen-height'] || 'N/A';

    res.locals.geolocation = geolocation;
    res.locals.userAgent = userAgent;
    res.locals.screenWidth = screenWidth;
    res.locals.screenHeight = screenHeight;

    next();
};

module.exports = contactFormMiddleware;
