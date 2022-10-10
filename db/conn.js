const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('thoughts', 'root', '', {
    host:'localhost',
    dialect:'mysql'
})

try{
    sequelize.authenticate()
    console.log('Conexão com bd estabelecida')
}catch{
    (err) => console.log(`Não foi possível fazer a conexão com bd: ${err}`)
}

module.exports = sequelize;