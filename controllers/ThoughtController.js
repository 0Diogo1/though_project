const Thought = require('../models/Thoughts')
const User = require('../models/User')

module.exports = class ThoughtController {
    static async showThoughts(req, res) {
        res.render('thoughts/home')
    }
}