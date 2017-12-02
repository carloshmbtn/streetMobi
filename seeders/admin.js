module.exports = {
    'init': function(models, callback){
        models.usuario.findAll().then(
            function(us){
                if(us.length == 0){
                    models.usuario.create(
                        {
                            'nome': 'Admin',
                            'username': 'admin',
                            'senha': 'admin',
                            'tipo': 1
                        }
                    ).then(
                        function(){
                            callback();
                        }
                    );
                }
                else {
                    callback();
                }
            }
        );
    }
};
