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
// requisito 1
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
function handleTalkerRequest(req, res) {
  // const { id } = req.params;
  // const pessoa = arrPPC.find((p) => p.id === Number(id));

  if (arrPPC.length === 0) return res.status(200).send([]);
  if (arrPPC) return res.status(200).send(arrPPC);
}

app.get('/talker', handleTalkerRequest);
