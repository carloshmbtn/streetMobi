/*global module*/
module.exports = function(sequelize, DataTypes){
    var usuario = sequelize.define('Usuario', {
        nome: DataTypes.STRING,
        senha: DataTypes.STRING,
        email: DataTypes.STRING,
        limitacao: DataTypes.BOOLEAN,
        tipoLimitacao: DataTypes.STRING,
        score: DataTypes.INTEGER,
        rep: DataTypes.INTEGER
    });
    return usuario;
};
/* Define o modelo Usuario */
