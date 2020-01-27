const express = require('express');

const server = express();

server.use(express.json());

const projects = []; // array onde será armazerado os novos projetos.
var requisitions = 0; // numero de requisicoes feitas.

// procura e verifica a existencia do projeto com o id passsado por params.
function checkProjectInArray(req,res,next){
  const {id} = req.params;

  for ( i= 0 ; i< projects.length ; i++){
    if(projects[i].id === id){
      req.index = i;

      return next();
    }else{
      // retorna erro caso o projeto nao seja encontrado.
      return res.status(400).json({error: 'Project does not exist'})
    }
  };
};

// conta o numero de requisicoes feitas até o momento.
function numberOfRequisitions(req,res,next){
  requisitions++;

  console.log(`Numero de requisicoes: ${requisitions}`);

  return next();
};

// cria o projeto no array projects
server.post('/projects',numberOfRequisitions, (req,res) => {
  const {id} = req.body
  const {title} = req.body;
  const tasks = [];

  projects.push({id,title,tasks});

  return res.json(projects);
});

// retorna um json com todos os projetos do array
server.get('/projects',numberOfRequisitions, (req,res) =>{
  return res.json(projects);
});

// adiciona uma nova tarefa no projeto pelo id passado por params
server.post('/projects/:id/tasks',checkProjectInArray,numberOfRequisitions, (req,res) =>{
  const {title} = req.body;

  projects[req.index].tasks.push(title);

  return res.json(projects);
});

// deleta um projeto pelo id passado por params
server.delete('/projects/:id',checkProjectInArray,numberOfRequisitions, (req,res) => {
  projects.splice(req.index, 1); // deleta 1 posicao do index passado

  return res.send();
});

server.listen(3000);