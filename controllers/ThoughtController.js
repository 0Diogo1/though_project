const Thought = require('../models/Thoughts')
const User = require('../models/User')

module.exports = class ThoughtController {
    static async showThoughts(req, res) {

        const thoughtsData = await Thought.findAll({include:User})

        const thoughts = thoughtsData.map((result) => result.get({plain:true}))

        console.log(thoughts)
        res.render('thoughts/home', {thoughts})
    }
    static async dashboard(req, res) {
        const userId = req.session.userId

        const user = await User.findOne({
            where:{id: userId},
            include:Thought,
            plain:true,
        })

        if(!user){
            res.redirect('/login')
        }
        const thoughts = user.Thoughts.map((result) => result.dataValues)
        console.log(thoughts)

        let emptyThoughts = false
        if(thoughts.length === 0){
          emptyThoughts = true
        }

        res.render('thoughts/dashboard', {thoughts, emptyThoughts})
    }
    
    static createThought(req, res) {
        res.render('thoughts/create')
    }
    static createThoughtSave(req, res) {
        const thought = {
          title: req.body.title,
          UserId: req.session.userId,
        }
    
        Thought.create(thought)
          .then(() => {
            req.flash('message', 'Pensamento criado com sucesso!')
            req.session.save(() => {
              res.redirect('/thoughts/dashboard')
            })
          })
          .catch((err) => console.log())
      }
      static removeThought(req, res) {
        const id = req.body.id
    
        Thought.destroy({ where: { id: id } })
          .then(() => {
            req.flash('message', 'Pensamento removido com sucesso!')
            req.session.save(() => {
              res.redirect('/thoughts/dashboard')
            })
          })
          .catch((err) => console.log(err))
      }

      static async updateThought(req, res) {
        const id = req.params.id

        const thought = await Thought.findOne({raw:true, where:{id: id}}).then((thought)=>{
          res.render('thoughts/edit', {thought})
        }).catch(err => console.log(err))
      }

      static async updateThoughtSave(req, res){
        const id = req.body.id

        const thought = {
          title:req.body.title
        }

        try{
          await Thought.update(thought, {where:{id: id}})

          req.flash('message', 'Você editou um pensamento')

          req.session.save(()=>{
            res.redirect('/thoughts/dashboard')
          })
        }catch(err){
          console.log(err)
        }
      }
}
