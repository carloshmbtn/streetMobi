var express = require('express');
var router = express.Router();
var request = require('request');
var auth = require('../auth');
var menu = require('../menus');
var models = require('../models');

router.get('/', auth.verifica, function(req, res, next){
    auth.nivel(['admin'], req, res, function(){
        var renderParam = {
            'title': 'Envios',
            'sair': req.sair,
            'p': req.session.tipo,
            'menus': menu.getMenus(req.session.tipo)
        }
        res.render('credits', renderParam);
    })
});

router.get('/requisicao', auth.verifica, function(req, res, next){
    auth.nivel(['admin'], req, res, function(){
        /*request('http://www.misterpostman.com.br/gateway.aspx?UserID=9c1e0cd1-b73f-4ad0-8224-b8b4e873fb2b&Token=12703638&acao=saldo', function(p1, p3, p3){
            res.send(p3);
        });*/
        var datainicio = req.query.inicio + '+00:00:00';
        var datafinal = req.query.final + '+23:59:59';

        var url = 'http://54.233.99.254/plataforma/relatorio.php?usuario=lucasmeins&senha=carlos123&tipo=9&datainicio='+ datainicio +'&datafinal='+ datafinal;//+'&lista='+req.session.loja;

        var getStatus = function(codigo){
            if(codigo == 0){
                return "Entregue com sucesso";
            }
            if(codigo == -2){
                return "Possível erro na entrega";
            }
            if(codigo == 3){
                return "Arguarde envio";
            }
        }


        request(url, function(p1, p2, p3){
            var texto = p3;
            var vetor = [];
            var tmp = '';
            var i = 0;
            while(i < texto.length){
                if(texto[i] != '<'){
                    tmp = tmp+texto[i];
                    i++;
                }
                else{
                    var t = tmp.split(';');
                    vetor.push({'codigo': getStatus(t[0]), 'numero': t[1], 'data': t[2]});
                    tmp = '';
                    i = i+4;
                }
            }

            if(vetor.length == 0){
                res.send([{'codigo': 'Não há resgistros', 'numero': 0, 'data': 0}]);
            }
            else
                res.send(vetor);
        });
    });
});

router.get('/nome', function(req, res){
    var num = req.query.num;
    models.cliente.find({'where': {'telefone': num}}).then(function(c){
        if(c)
            res.send({'id': c.id, 'nome': c.nome});
        else{
            res.send({'id': 0, 'nome': ''});
        }
    });
});

module.exports = router;
