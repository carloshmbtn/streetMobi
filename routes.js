/*global require, module, __dirname*/

var models = require('./models'),
    jwt = require('jsonwebtoken'),
    multer = require('multer'),
    util = require('./util'),
    config = require('./config'),
    fs = require('fs'),
    hash = require('hash.js');
/* models importa os modelos
* jwt é utilizado para gerenciamento de tokens para autenticação
* multer utilizado para upload de imagens
*
*/




/* Modulo node com implementações das funções utilizadas no servidor */
module.exports = {


    valida: function(req, res, next){
        /* 'Valida' intercepta requisições, verifica se elas são válidas (JWT) e faz um tratamento adequado */
        var key = req.headers.authorization;
        if(key){
            key = key.split(" ").pop();
            jwt.verify(key, config.jwtKey, function(err, decoded) {
                if (err) {
                    res.writeHead(401, {"Content-Type": "application/json"});
                    res.end('');
                }
                else{
                    req.decoded = decoded;
                    next();
                }
            });
        }
        else{
            res.writeHead(406, {"Content-Type": "application/json"});
            res.end('');
        }
    },

    logarUsuario: function(req, res){
        var usuario = req.body.usuario;
        models.Usuario.findAll(
            {
                where: {login: usuario.login}
            }
        ).then(
            function(encontrado){
                if(encontrado.length > 0 && encontrado[0].senha == hash.sha256().update(usuario.senha).digest('hex')){
                    var token = jwt.sign({
                        login: usuario.login,
                        id: encontrado[0].id},
                        config.jwtKey,
                        {expiresIn: '10m'}
                    );
                    return res.send(token);
                }
                else{
                    res.writeHead(500, {"Content-Type": "application/json"});
                    res.end('');
                }
            }
        );
    },

    /*Cadastro de usuario*/

    cadastroUsuario: function(req, res){
        var usuario = {
            nome: req.body.nome,
            senha:  hash.sha256()
                .update(req.body.senha)
                .digest('hex'),
            email: req.body.email,
            limitacao: req.body.limitacao,
            tipoLimitacao: req.body.tipoLimitacao,
            score: req.body.score,
            rep: req.body.rep
        };

        models.Usuario.create(usuario).then(
            function(){
                res.send(false, 'Registrado com sucesso');
            }
        ).catch(
            function(err){
                res.send(true, 'Erro: ' + err);
            }
        );
    },
    teste: function(req, body){
        res.send('');
    }
};
