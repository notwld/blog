const router = require("express").Router()

router.get('/', (req, res) => {
    res.status(200).redirect(req.baseUrl + '/api/blog/')
})

module.exports = router
