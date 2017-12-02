var express = require('express');
var router = express.Router();
var auth = require('../auth');
var menu = require('../menus');
var models = require('../models');

router.get('/', auth.verifica, function(req, res){
    auth.nivel(['comum', 'comum2'], req, res, function(){
        var where = {};
        where.lojaId = req.session.loja;
        if(req.query.nome){
            where = {};
            where.$and = [];
            where.$and.push({'lojaId': req.session.loja});
            where.$and.push(models.Sequelize.where(models.Sequelize.fn('lower', models.Sequelize.col('nome')), ' LIKE ', models.sequelize.fn('lower', '%'+req.query.nome+'%')));
        }

        models.cliente.findAll({
            'where': where
        }).then(function(cs){
            var routerParam = {
                'title': 'Clientes',
                'p': req.session.tipo,
                'sair': req.sair,
                'menus': menu.getMenus(req.session.tipo),
                'clientes': cs
            };
            if(req.query.nome)
                routerParam.termos = req.query.nome;
            res.render('clients', routerParam);
        });
    });
});

router.post('/novo', auth.verifica, function(req, res){
    auth.nivel(['comum', 'comum2'], req, res, function(){
        var cliente = {
            'nome': req.body.nome,
            'RG': req.body.rg,
            'CPF': req.body.cpf,
            'rua': req.body.rua,
            'numero': req.body.numero,
            'bairro': req.body.bairro,
            'email': req.body.email,
            'telefone': req.body.telefone,
            'adquirido': req.body.adquirido,
            'lojaId': req.session.loja,
            'rodoviario': false,
            'aereo': false,
            'pacote': false,
            'locacao': false,
            'encomendas': false
        };

        var adqString = req.body.adquirido;
        var adqArray = adqString.split(';');
        if(adqArray.length == 1 && adqArray[0] == ''){
            req.flash('erro', 'Informe pelo menos 1 item adquirido!');
            for(c in cliente){
                req.flash(c, cliente[c]);
            }
            req.flash('adq', adqString);
            return res.redirect('/clientes');
        }

        for(var i in adqArray){
            if(adqArray[i] == 'rodoviario'){
                cliente.rodoviario = true;
            }
            else if(adqArray[i] == 'aereo'){
                cliente.aereo = true;
            }
            else if(adqArray[i] == 'pacote'){
                cliente.pacote = true;
            }
            else if(adqArray[i] == 'locacao'){
                cliente.locacao = true;
            }
            else if(adqArray[i] == 'encomendas'){
                cliente.encomendas = true;
            }
        }

        models.cliente.create(cliente).then(function(){
            req.flash('sucesso', 'Cliente criado com sucesso');
            res.redirect('/clientes');
        }).catch(models.Sequelize.ValidationError, function(e){
            for(c in cliente){
                req.flash(c, cliente[c]);
            }
            req.flash('adq', adqString);
            req.flash('erro', e.errors[0].message);
            res.redirect('/clientes');
        });
    });
});


router.get('/:id', auth.verifica, function(req, res){
    auth.nivel(['comum', 'comum2', 'admin'], req, res, function(){
        var id = req.params.id;

        models.cliente.findById(id).then(function(cs){
            var renderParams = {
                'cs': cs,
                'title': 'Visualizar',
                'menus': menu.getMenus(req.session.tipo)
            };
            if(req.session.tipo != 'admin' &&cs.lojaId != req.session.loja){
                res.send('não autorizado');
            }
            else{
                res.render('viewCliente', renderParams);
                //res.send(cs);
            }
        }).catch(function(e){
            res.send('Erro');
        });
    });
});

router.route('/edit/:id').get(auth.verifica, function(req, res){
    auth.nivel(['comum', 'comum2', 'admin'], req, res, function(){
        var id = req.params.id;
        models.cliente.findById(id).then(function(cs){
            if(req.session.tipo != 'admin' && cs.lojaId != req.session.loja){
                return res.send('não autorizado');
            }
            var renderParams = {
                'title': 'Edição Cliente',
                'menus': menu.getMenus(req.session.tipo),
                'cs': cs
            };

            res.render('editCliente', renderParams);
        }).catch(function(e){
            res.send('Erro');
        });
    });
}).post(auth.verifica, function(req, res){
    auth.nivel(['comum', 'comum2', 'admin'], req, res, function(){
        var cliente = {
            'nome': req.body.nome,
            'RG': req.body.rg,
            'CPF': req.body.cpf,
            'rua': req.body.rua,
            'numero': req.body.numero,
            'bairro': req.body.bairro,
            'email': req.body.email,
            'telefone': req.body.telefone,
            'adquirido': req.body.adquirido,
            'lojaId': req.session.loja,
            'rodoviario': false,
            'aereo': false,
            'pacote': false,
            'locacao': false,
            'encomendas': false
        };

        var adqString = req.body.adquirido;
        var adqArray = adqString.split(';');

        if(adqArray.length == 1 && adqArray[0] == ''){
            req.flash('erro', 'Informe pelo menos 1 item adquirido!');
            return req.redirect('/clientes');
        }

        for(var i in adqArray){
            if(adqArray[i] == 'rodoviario'){
                cliente.rodoviario = true;
            }
            else if(adqArray[i] == 'aereo'){
                cliente.aereo = true;
            }
            else if(adqArray[i] == 'pacote'){
                cliente.pacote = true;
            }
            else if(adqArray[i] == 'locacao'){
                cliente.locacao = true;
            }
            else if(adqArray[i] == 'encomendas'){
                cliente.encomendas = true;
            }
        }

        var id = req.params.id;
        models.cliente.findById(id).then(function(cs){
            if(req.session.tipo != 'admin' && cs.lojaId != req.session.loja){
                return res.send('não autorizado');
            }
            if(cs){
                cs.updateAttributes(cliente).then(function(){
                    req.flash('sucesso', 'Cliente atualizado com sucesso');
                    res.redirect('/clientes/edit/'+ id);
                }).catch(models.Sequelize.ValidationError, function(e){
                    req.flash('erro', e.errors[0].message);
                    res.redirect('/clientes/edit/'+ id);
                });
            }
        });
    });
});

module.exports = router;
