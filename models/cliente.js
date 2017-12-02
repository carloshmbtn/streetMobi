module.exports = function(sequelize, DataTypes){
    var cliente = sequelize.define('cliente', {
        'nome': {
            type: DataTypes.STRING,
            validate: {
                len: {args: [3, 100], msg: 'Nome deve ter entre 3 e 100 caracteres'}
            }
        },
        'RG': {
            type: DataTypes.STRING,
            validate: {
                len: {args: [0, 15], msg: 'Máximo de 15 caracteres em RG'}
            }
        },
        'CPF': {
            type: DataTypes.STRING,
            validate: {
                len: {args: [11, 11], msg: 'Máximo de 11 caracteres em CPF'},
                eUnico: function(value, next){
                    cliente.find({'where': {'CPF': value}}).then(function(u){
                        if(u){
                            next('CPF já cadastrado');
                        }
                        else{
                            next();
                        }
                    });
                }
            }
        },
        'rua': {
            type: DataTypes.STRING,
            validate: {
                len: {args: [5, 250], msg: 'Mínimo de 5 e máximo 250 caracteres em rua'}
            }
        },
        'numero': {
            type: DataTypes.INTEGER,
            validate: {
                isInt: {args: true, msg: 'Informe um número válido em "número"'}
            }
        },
        'bairro': {
            type: DataTypes.STRING,
            validate: {
                len: {args: [4, 200], msg: 'Mínimo de 10 e máximo 200 caracteres em bairro'}
            }
        },
        'email': {
            type: DataTypes.STRING,
            validate: {
                isEmail: {args: true, msg: 'Informe um email válido'}
            }
        },
        'telefone': {
            type: DataTypes.STRING,
            validate: {
                eUnico: function(value, next){
                    cliente.find({'where': {'telefone': value}}).then(function(u){
                        if(u){
                            next('Telefone já cadastrado');
                        }
                        else{
                            next();
                        }
                    });
                }
            }
        },
        'rodoviario': DataTypes.BOOLEAN,
        'aereo': DataTypes.BOOLEAN,
        'pacote': DataTypes.BOOLEAN,
        'locacao': DataTypes.BOOLEAN,
        'encomendas': DataTypes.BOOLEAN
    });

    return cliente;
}
