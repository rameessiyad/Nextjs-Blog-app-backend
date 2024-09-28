const userRoute = require('./user-route');
const blogRoute = require('./blog-route');

const router = require('express').Router();

//end points
router.use('/auth', userRoute);
router.use('/blog', blogRoute); 

module.exports = router;