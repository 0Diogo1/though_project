
module.exports = class AuthController {
    static async register(req, res) {
        res.render('auth/register')
    }
    static async login(req, res) {
        res.render('auth/login')
    }
    static async registerPost(req, res) {
        const {name, email, password, confirmPassword} = req.body
        if(password != confirmPassword){
            req.flash('message', 'As senhas não conferem, tente novamente')
            res.render('auth/register')

            return
        }
    }
    
}

