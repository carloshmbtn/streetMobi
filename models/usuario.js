module.exports = function(sequelize, DataTypes){
    var usuario = sequelize.define('usuario', {
        'nome': {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {args: [3, 100], msg: 'Nome deve ter entre 3 e 100 caracteres'}
            }
        },
        'username': {
            type: DataTypes.STRING,
            validate: {
                len: {args: [3, 30], msg: 'Usuário deve ter entre 3 e 30 caracteres'},
                isAlphanumeric: {args: true, msg: 'Informe um usuário alfanumérico'},
                eUnico: function(value, next){
                    usuario.find({'where': {'username': value}}).then(function(u){
                        if(u){
                            next('Usuário já cadastrado');
                        }
                        else{
                            next();
                        }
                    });
                }
            }
        },
        'senha': {
            type: DataTypes.STRING,
            validate: {
                len: {args: [4, 20], msg: 'Senha deve ter entre 4 e 20 caracteres'}
            }
        },
        'confirmaSenha': {
            type: DataTypes.VIRTUAL,
            validate: {
                confirma: function(value, next){
                    if(value == this.senha){
                        next();
                    }
                    else{
                        next('Senha não corresponde a confirmar senha');
                    }
                }
            }
        },
        'tipo':DataTypes.INTEGER
    });

    return usuario;
}
