const models = require('./models');

module.exports = {
    'init': function(callback){
        models.loja.hasMany(models.usuario);
        models.loja.hasMany(models.cliente);

        models.sequelize.sync().then(function(){
            callback(models);
        });
    }
};
