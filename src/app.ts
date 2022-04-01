import express from 'express'

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.post('/kdbx', (req, res) => {
  req.body.q
});