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
const mensagensLogin = {
1: { message: 'O campo "email" é obrigatório' },
2: { message: 'O "email" deve ter o formato "email@email.com"' },
3: { message: 'O campo "password" é obrigatório' },
4: { message: 'O "password" deve ter pelo menos 6 caracteres' },
5: 'pass',
};

const verificarCredenciais = (email, password) => {
  const mailformat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

const arrTokens = [];
const generateToken = (n) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < n; i += 1) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
  // credits: https://stackoverflow.com/questions/8532406/create-a-random-token-in-javascript-based-on-user-details
};

function handleLogin(req, res) {
  const { email, password } = req.body;

  const authMessage = verificarCredenciais(email, password);
  const token = generateToken(16);
  arrTokens.push(token);
  
  if (authMessage === 'pass') return res.status(200).send({ token });
  return res.status(400).send(authMessage);
}

app.post('/login', handleLogin);
// endpoint POST /talker
const mensagensTalker = {
  1: { message: 'O "name" deve ter pelo menos 3 caracteres' },
  2: { message: 'O campo "age" é obrigatório' },
  3: { message: 'A pessoa palestrante deve ser maior de idade' },
  4: { message: 'O campo "talk" é obrigatório' },
  5: { message: 'O campo "watchedAt" é obrigatório' },
  6: { message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' },
  7: { message: 'O campo "rate" é obrigatório' },
  8: { message: 'O campo "rate" deve ser um inteiro de 1 à 5' },
  9: 'pass',
  };
  
  const verificarNameAndAge = (name, age) => {
    if (name.length < 3) {
      return mensagensTalker[1];  
    }
    if (age === undefined) {
      return mensagensTalker[2];  
    }
    if (age < 18) {
      return mensagensTalker[3];  
    }
  };
  const verificarTalk = (talk) => {
    if (talk === undefined) {
      return mensagensTalker[4];  
    }
    if (talk.watchedAt === undefined) {
      return mensagensTalker[5];  
    }
    if (!talk.watchedAt.match(/^\d{1,2}-\d{4}-\d{1,2}$/)) {
      return mensagensTalker[6];  
    }
  };
  const verificarRate = (rate) => {
    if (rate === undefined) {
      return mensagensTalker[7];  
    }
    if (rate < 1 || rate > 5) {
      return mensagensTalker[8];  
    }
  };
  const verificarCredenciaisReq = (name, age, talk, rate) => {
    if (verificarNameAndAge(name, age) !== null) return verificarNameAndAge(name, age);
    if (verificarTalk(talk) !== null) return verificarTalk(talk);
    if (verificarRate(rate) !== null) return verificarRate(rate);
    return mensagensTalker[9];
  };

function handleTalker(req, res) {
  const { authorization } = req.headers;
  const { id, name, age, talk, watchedAt, rate } = req.body;
  if (authorization === undefined || null) {
    return res.status(401).send({ message: 'Token não encontrado' });
  }
  if (arrTokens.find((t) => t === authorization) === false) {
    return res.status(401).send({ message: 'Token inválido' });
  }
  const message = verificarCredenciaisReq(name, age, talk, rate);
  if (message !== 'pass') return res.status(400).send({ message });
  arrPPC.push({ id, name, age, talk: { watchedAt, rate } });
  return res.status(201).send({ id, name, age, talk: { watchedAt, rate } });
}

app.post('/talker', handleTalker);