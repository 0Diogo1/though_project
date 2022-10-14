const User = require('../models/User')

const bcrypt = require('bcryptjs')
module.exports = class AuthController {
    static async register(req, res) {
        res.render('auth/register')
    }
    static async login(req, res) {
        res.render('auth/login')
    }
    static async loginPost(req, res) {
        //find and check user
        const {email, password} = req.body

        const user = await User.findOne({where:{email: email}})

        if(!user){
            req.flash('message', 'Usuário não encontrado')
            res.render('auth/login')
            return
        }
        //check password
        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch){
            req.flash('message', 'Senha incorreta, tente novamente')
            res.render('auth/login')
            return
        }
        //initializing session
        try{
            req.session.userId = user.id
            req.flash('message', 'Usuário autenticado')
            req.session.save(()=>{
                res.redirect('/')
            })
        }catch(err){
            console.log(err)
        }
    }
    static async registerPost(req, res) {
        const {name, email, password, confirmPassword} = req.body
        //passord match validation
        if(password != confirmPassword){
            req.flash('message', 'As senhas não conferem, tente novamente')
            res.render('auth/register')

            return
        }
        //check if user exists
        const checkIfUserExists = await User.findOne({where:{email: email}})

        if(checkIfUserExists){
            req.flash('message', 'Este email já existe')
            res.render('auth/register')

            return
        }

        //create a password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }

        try{
            const createdUser = await User.create(user)

            req.session.userId = createdUser.id

            req.flash('message', 'Cadastro realizado com sucesso')

            req.session.save(()=>{
                res.redirect('/');
            })
        }catch(err){
            console.log(err)
        }
    }
    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
      }
    
}

