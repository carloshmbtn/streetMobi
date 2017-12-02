var express = require('express');
var router = express.Router();
var auth = require('../auth');
var models = require('../models');
var menu = require('../menus');

/* GET users listing. */
router.get('/', auth.verifica, function(req, res, next) {
    auth.nivel(['admin', 'comum'], req, res, function(){
        if(req.session.tipo == 'comum'){
            models.usuario.findAll({
                'where': {
                    $or: [{'tipo': 2}, {'tipo': 3}],
                    $and: {'lojaId': req.session.loja}}
            }).then(function(us){

                var renderParam = {
                    'title': 'Usuários',
                    'sair': req.sair,
                    'p': 'comum',
                    'usuarios': us,
                    'menus': menu.getMenus('comum')
                }

                res.render('users', renderParam);
            });
        }
        else{
            models.loja.findAll().then(function(l){
                models.usuario.findAll({
                    'where': {'tipo': 2}
                }).then(function(us){
                    var renderParam = {
                        'title': 'Usuários',
                        'sair': req.sair,
                        'p': 'admin',
                        'lojas': l,
                        'usuarios': us,
                        'menus': menu.getMenus('admin')
                    }
                    res.render('users', renderParam);
                });
            });
        }
    });
});

router.post('/login', function(req, res){
    var usuario = req.body.username;
    var senha = req.body.senha;

    models.usuario.find({'where': {'username': usuario}}).then(function(u){
        if(u && u.senha == senha){
            req.session.idU = u.id;
            if(u.tipo == 1){
                req.session.tipo = 'admin';
                return res.redirect('/');
            }
            else if(u.tipo == 2){
                req.session.tipo = 'comum';
                req.session.loja = u.lojaId;
                return res.redirect('/usuarios');
            }
            else if(u.tipo == 3){
                req.session.tipo = 'comum2';
                req.session.loja = u.lojaId;
                return res.redirect('/clientes');
            }
        }
        else {
            req.flash('erro', "Usuário ou senha incorretos");
            res.redirect('/usuarios/login');
        }
    });
});

router.get('/login', function(req, res){
    var renderParam = {
        'title': 'Login',
        'p': 'deslogado',
        'sair': 'display: none',
        'menus': menu.getMenus('deslogado')
    }

    res.render('login', renderParam);
});

router.get('/login/sair', function(req, res, next){
    req.session.idU = 0;
    res.redirect('/');
});

router.get('/lojas', auth.verifica, function(req, res){
    auth.nivel(['admin'], req, res, function(){
        models.loja.findAll().then(function(l){
            var renderParam = {
                'title': 'Lojas',
                'p': req.session.tipo,
                'sair': req.sair,
                'lojas': l,
                'menus': menu.getMenus(req.session.tipo)}
            res.render('loja', renderParam);
        });
    });
});

router.post('/loja', auth.verifica, function(req, res){
    auth.nivel(['admin'], req, res, function(){

        var loja = {
            'nome': req.body.nome,
            'token': req.body.token,
            'user': req.body.user
        }

        models.loja.create(loja).then(function(){
            req.flash('sucesso', 'Loja salva com sucesso');
            res.redirect('/usuarios/lojas');
        }).catch(models.Sequelize.ValidationError, function(e){
            req.flash('erro', e.errors[0].message);
            for(i in loja){
                req.flash(i, loja[i]);
            }
            res.redirect('/usuarios/lojas');
        });
    });
});

/*nível de administrador*/
router.post('/novo1', auth.verifica, function(req, res){
    auth.nivel(['admin', 'comum'], req, res, function(){

        var usuario = {};

        usuario.username = req.body.usuario;
        usuario.senha = req.body.senha;
        usuario.nome = req.body.nome;
        usuario.confirmaSenha = req.body.senha2;

        if(req.session.tipo == 'admin'){
            usuario.tipo = 2;
            usuario.lojaId = req.body.loja;
            if(!usuario.lojaId){
                for(i in usuario){
                    req.flash(i, usuario[i]);
                }
                req.flash('erro', 'Loja deve ser informada!');
                return res.redirect('/usuarios');
            }
        }
        else{
            usuario.tipo = 3;
            usuario.lojaId = req.session.loja;
        }

        models.usuario.create(usuario).then(function(){
            req.flash('sucesso', "Usuario criado com sucesso");
            res.redirect('/usuarios');
        }).catch(models.Sequelize.ValidationError, function(e){
            for(i in usuario){
                req.flash(i, usuario[i]);
            }
            req.flash('erro', e.errors[0].message);
            res.redirect('/usuarios');
        });
    });
});

router.route('/perfil').get(auth.verifica, function(req, res){
    models.usuario.findById(req.session.idU).then(function(u){
        var renderParams = {
            'title': 'Perfil',
            'menus': menu.getMenus(req.session.tipo),
            'usuario': u
        };
        res.render('editUser', renderParams);
    });
}).post(auth.verifica, function(req, res){
    var senha = req.body.senhaA;
    var usuario = {
        'nome': req.body.nome,
        'username': req.body.usuario
    };
    if(req.body.senha || req.body.senha2){
        usuario.senha = req.body.senha;
        usuario.confirmaSenha = req.body.senha2;
    }
    models.usuario.findById(req.session.idU).then(function(u){
        if(u && u.senha == senha){
            u.updateAttributes(usuario).then(function(){
                req.flash('sucesso', 'Usuário atualizado com sucesso');
                res.redirect('/usuarios/perfil');
            }).catch(models.Sequelize.ValidationError, function(e){
                req.flash('erro', e.errors[0].message);
                res.redirect('/usuarios/perfil');
            });
        }
        else{
            req.flash('erro', 'Senha incorreta');
            res.redirect('/usuarios/perfil');
        }
    });
});

module.exports = router;
