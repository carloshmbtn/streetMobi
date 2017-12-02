module.exports = {
    'getMenus': function(per){
        var admin = [
            {h: '/', t: 'Início', a: 'index'},
            {h: '/usuarios', t: 'Cadastro Usuário', a: 'usuario'},
            {h: '/usuarios/lojas', t: 'Cadastro Lojas', a: 'loja'},
            {h: '/creditos', t: 'Relatório de Envios', a: 'credito'},
            {h: '/usuarios/perfil', t: 'Editar Perfil', a: 'perfil'}
        ];
        var comum = [
            {h: '/usuarios', t: 'Cadastro Usuário', a: 'usuario'},
            {h: '/clientes', t: 'Cadastro Clientes', a: 'cliente'},
            {h: '/usuarios/perfil', t: 'Editar Perfil', a: 'perfil'}
        ];
        var comum2 = [
            {h: '/clientes', t: 'Cadastro Clientes', a: 'cliente'},
            {h: '/usuarios/perfil', t: 'Editar Perfil', a: 'perfil'}
        ];

        if(per == 'admin'){
            return admin;
        }
        else if(per == 'comum'){
            return comum;
        }
        else if(per == 'comum2'){
            return comum2;
        }
    }
};
