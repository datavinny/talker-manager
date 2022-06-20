const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

  app.listen(PORT, () => {
    console.log('Online');
  });
// GetAllTalkersRequest
// PPC = Pessoas Palestrantes Cadastradas
const arrPPC = [
  { name: 'Henrique Albuquerque',
    age: 62,
    id: 1,
    talk: { watchedAt: '23/10/2020', rate: 5 },
  },
  {
    name: 'Heloísa Albuquerque',
    age: 67,
    id: 2,
    talk: { watchedAt: '23/10/2020', rate: 5 },
  },
  {
    name: 'Ricardo Xavier Filho',
    age: 33,
    id: 3,
    talk: { watchedAt: '23/10/2020', rate: 5 },
  },
  {
    name: 'Marcos Costa',
    age: 24,
    id: 4,
    talk: { watchedAt: '23/10/2020', rate: 5 },
  },
];
function handleGetAllTalkersRequest(req, res) {
  if (arrPPC.length === 0) return res.status(200).send([]);
  if (arrPPC) return res.status(200).send(arrPPC);
}

app.get('/talker', handleGetAllTalkersRequest);
// GetTalkerByIdRequest
function handleGetTalkerByIdRequest(req, res) {
  const { id } = req.params;
  const pessoa = arrPPC.find((p) => p.id === Number(id));
  
  if (pessoa !== undefined) return res.status(200).send(pessoa);
  if (pessoa === undefined) {
  return res.status(404).send({ message: 'Pessoa palestrante não encontrada' }); 
  }
}

app.get('/talker/:id', handleGetTalkerByIdRequest);
// endpoint POST /login
const credenciais = {
  email: 'email@email.com',
  password: '123456',
};

const mensagensLogin = {
1: { message: 'O campo "email" é obrigatório' },
2: { message: 'O "email" deve ter o formato "email@email.com"' },
3: { message: 'O campo "password" é obrigatório' },
4: { message: 'O "password" deve ter pelo menos 6 caracteres' },
5: 'pass',
};

const verificarCredenciais = (email, password) => {
  const mailformat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // const authEmail = credenciais.email === email;
  // const authPassword = credenciais.password === password;
  // const auth = !!(authEmail && authPassword === true);
  if (email === undefined) {
    return mensagensLogin[1]; 
  }
  if (email.match(mailformat) === null) {
    return mensagensLogin[2];
  }
  if (password === undefined) {
    return mensagensLogin[3]; 
  }
  if (password.length < 6) {
    return mensagensLogin[4];  
  }
  return mensagensLogin[5];
};

function handleLogin(req, res) {
  const { email, password } = req.body;

  const authMessage = verificarCredenciais(email, password);
  const token = '7mqaVRXJSp886CGr'; // token aleatório a cada vez que for acessado.
  
  if (authMessage === 'pass') return res.status(200).send({ token });
  return res.status(400).send(authMessage);
}

app.post('/login', handleLogin);