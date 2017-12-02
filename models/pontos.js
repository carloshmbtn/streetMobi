/*global module*/
module.exports = function(sequelize, DataTypes){
    var ponto = sequelize.define('Ponto', {
        lat: DataTypes.STRING,
        long: DataTypes.STRING,
        descricao: DataTypes.TEXT,
        grupoX: DataTypes.INTEGER,
        grupoY: DataTypes.INTEGER
    });
    return ponto;
};
/* Define o modelo Ponto */
