let express = require('express');
let router = express.Router();

router.post('/sendScore', (req, res) => {
    let score = req.body;   
    res.render('submit', {score:'score'});
})

router.post('/submitScore', (req, res) => {

})

module.exports = router;