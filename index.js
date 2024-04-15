const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configuração do pool de conexão com o PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'atividade_pratica_01', // Alterado para o nome do seu banco de dados
  password: 'ds564',
  port: 5432, // Porta padrão do PostgreSQL
});

// Função para calcular a idade a partir da data de nascimento
function calcularIdade(dataNascimento) {
  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = dataNascimento.getMonth();
  if (mesNascimento > mesAtual || (mesNascimento === mesAtual && hoje.getDate() < dataNascimento.getDate())) {
    idade--;
  }
  return idade;
}

// Função para calcular o signo do zodíaco
function calcularSigno(mes, dia) {
  if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) {
    return 'Aquário';
  } else if ((mes === 2 && dia >= 19) || (mes === 3 && dia <= 20)) {
    return 'Peixes';
  } else if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) {
    return 'Áries';
  } else if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) {
    return 'Touro';
  } else if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) {
    return 'Gêmeos';
  } else if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) {
    return 'Câncer';
  } else if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) {
    return 'Leão';
  } else if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) {
    return 'Virgem';
  } else if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) {
    return 'Libra';
  } else if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) {
    return 'Escorpião';
  } else if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) {
    return 'Sagitário';
  } else {
    return 'Capricórnio'; // Caso padrão para os demais dias de dezembro e janeiro
  }
}

// Rota para adicionar um usuário
app.post('/usuarios', async (req, res) => {
  try {
    const { nome, email, datanascimento, status, sexo } = req.body;

    const dataNascimento = new Date(datanascimento);
    const idade = calcularIdade(dataNascimento);
    const signo = calcularSigno(dataNascimento.getMonth() + 1, dataNascimento.getDate());

    await pool.query('INSERT INTO users (nome, email, idade, signo, datanascimento, status, sexo) VALUES ($1, $2, $3, $4, $5, $6, $7)', [nome, email, idade, signo, datanascimento, status, sexo]);
    res.status(201).send({ mensagem: 'Usuário adicionado com sucesso'});
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
    res.status(500).send('Erro ao adicionar usuário');
  }
});

// Rota para obter todos os usuários
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json({
        total: result.rowCount,
        usuarios: result.rows,
    });
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    res.status(500).send('Erro ao obter usuários');
  }
});

// Rota para atualizar um usuário
app.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, datanascimento, status, sexo } = req.body;
    const dataNascimento = new Date(datanascimento);
    const idade = calcularIdade(dataNascimento);
    const signo = calcularSigno(dataNascimento.getMonth() + 1, dataNascimento.getDate());
    await pool.query('UPDATE users SET nome = $1, email = $2, idade = $3, signo = $4, datanascimento = $5, status = $6, sexo = $7 WHERE id = $8', [nome, email, idade, signo, datanascimento, status, sexo, id]);
    res.status(200).send({ mensagem: 'Usuário atualizado com sucesso'});
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).send('Erro ao atualizar usuário');
  }
});

// Rota para excluir um usuário
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.status(200).send({ mensagem: 'Usuário excluído com sucesso'});
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).send('Erro ao excluir usuário');
  }
});

// Rota para obter um usuário por ID
app.get('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      res.status(404).send({ mensagem: 'Usuário não encontrado' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Erro ao obter usuário por ID:', error);
    res.status(500).send('Erro ao obter usuário por ID');
  }
});

// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
