let express = require('express');
let router = express.Router();

router.post('/submitScore', (req, res) => {
    var score = req.body.score;
    var name= req.body.name;
    
    res.redirect(301, '/');
})

module.exports = router;