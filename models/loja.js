module.exports = function(sequelize, DataTypes){
    var loja = sequelize.define('loja', {
        'nome': {
            type: DataTypes.STRING,
            validate: {
                len: {args: [4, 250], msg: 'Nome deve ter entre 4 e 250 caracteres'}
            }
        },
        'token': DataTypes.STRING,
        'userId': DataTypes.STRING
    });

    return loja;
}
