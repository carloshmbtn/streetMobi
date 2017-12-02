module.exports = {
    'verifica': function(req, res, next){
        if(req.session.idU && req.session.idU != 0){
            req.sair = 'display: block;';
            next();
        }
        else{
            req.sair = 'display: none;';
            res.redirect('/usuarios/login');
        }
    },
    'nivel': function(niveis, req, res, entrar){
        for(n in niveis){
            if(niveis[n] == req.session.tipo){
                return entrar(req.session.tipo);
            }
        }
        res.send('nao autorizado');
    }
}
