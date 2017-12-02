var express = require('express');
var router = express.Router();
var request = require('request');
var auth = require('../auth');
var menu = require('../menus');
var models = require('../models');

/* GET home page. */
router.get('/', auth.verifica, function(req, res, next) {
    if(req.session.tipo == 'comum' || req.session.tipo == 'comum2'){
        return res.redirect('/clientes');
    }
    auth.nivel(['admin'], req, res, function(){
        var where = {};

        if(req.query.rod){
            where.$or = where.$or || [];
            where.$or.push({'rodoviario': true});
        }
        if(req.query.aer){
            where.$or = where.$or || [];
            where.$or.push({'aereo': true});
        }
        if(req.query.pac){
            where.$or = where.$or || [];
            where.$or.push({'pacote': true});
        }
        if(req.query.loc){
            where.$or = where.$or || [];
            where.$or.push({'locacao': true});
        }
        if(req.query.enc){
            where.$or = where.$or || [];
            where.$or.push({'encomendas': true});
        }

        models.cliente.findAll({'where': where}).then(function(cs){
            var renderParam = {
                'title': 'Enviar mensagem',
                'sair': req.sair,
                'p': req.session.tipo,
                'menus': menu.getMenus(req.session.tipo),
                'clientes': cs
            }
            res.render('index', renderParam);
        });
    });
});

router.post('/enviar', auth.verifica, function(req, res){
    auth.nivel(['admin'], req, res, function(){
        var query = req.body.query;
        var string = req.body.selecionados;
        string = string.substring(0, string.length - 1);

        var selec = string.split(';');
        var where = {};
        where.$or = [];
        for(var i = 0; i < selec.length; i++){
            var x = parseFloat(selec[i]);
            if(!isNaN(selec[i]) && (x | 0) === x){
                where.$or.push({'id': selec[i]});
            }
        }

        var nums = [];

        models.cliente.findAll({'where': where}).then(function(cs){
            for(i in cs){
                nums.push(cs[i].telefone);
            }
            var numeros = nums.join(';');

            var erro = null;
            if(!numeros){
                erro = 'O número deve ser informado!'
            }
            else if(!req.body.mensagem){
                erro = 'BBCODE deve ser informada!';
            }
            else if(req.body.mensagem2.length > 400){
                erro = 'Mensagem muito grande (max 160)';
            }

            var m = req.body.mensagem;
            var r = '';
            var i = 1;
            for(;i<m.length && m[i] != '[';i++);

            if(m[i+1] != 'i' || m[i+2] != 'm' || m[i+3] != 'g'){
                erro = "Informe um bbcode válido";
            }

            i = i + 5;

            for(j = i; j < m.length && m[j] != '['; j++){
                r = r + m[j];
            }

            if(erro){
                req.flash('erro', erro);
                req.flash('numero', req.body.numero);
                req.flash('mensagem', req.body.mensagem);
                req.flash('selecionados', selec);
                return res.redirect('/'+query);
            }
            else{
                /*var mensagem = encodeURI(req.body.mensagem);
                var numero = req.body.numero;

                request('http://www.misterpostman.com.br/gateway.aspx?UserID=9c1e0cd1-b73f-4ad0-8224-b8b4e873fb2b&Token=12703638&NroDestino='+ numero +'&Mensagem='+mensagem, function(p1, p2, p3){
                    req.flash('sucesso', 'Mensagem enviada com sucesso!! ' + p3);
                    return res.redirect('/');
                });*/
                var msg = req.body.mensagem2;
                msg = encodeURI(msg);

                var url = 'http://54.233.99.254/plataforma/api5.php?usuario=lucasmeins&senha=carlos123&destinatario='+ numeros +'&msg='+ r + '[%S%]'+ msg +'&tipo=6';//+'&lista='+req.session.loja;


                request(url, function(p1, p2, p3){
                    req.flash('sucesso', p3);
                    return res.redirect('/'+query);
                });
            }
        });
    });
});

module.exports = router;
