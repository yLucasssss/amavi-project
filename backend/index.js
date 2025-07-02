require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { "rejectUnauthorized": false } // Temporariamente desabilitado para depuração
});

// Teste de conexão do banco de dados
pool.getConnection()
  .then(connection => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    connection.release(); // Libera a conexão de volta para o pool
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    console.error('Detalhes do erro:', err);
  });

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // Se não houver token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Token inválido
    req.user = user;
    next();
  });
};

// Rota de Login
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(senha, user.senha);

    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, nome: user.nome });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para produtos (protegidas)
app.get('/api/produtos', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, codigo, tipo, valor, status FROM produtos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/produtos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT id, codigo, tipo, valor, status FROM produtos WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/produtos/by-codigo/:codigo', authenticateToken, async (req, res) => {
  try {
    const { codigo } = req.params;
    const [rows] = await pool.query('SELECT id, codigo, tipo, valor, status FROM produtos WHERE codigo = ?', [codigo]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/produtos', authenticateToken, async (req, res) => {
  try {
    const { codigo, tipo, valor } = req.body;

    // Verificar se o código já existe
    const [existingProduct] = await pool.query('SELECT id FROM produtos WHERE codigo = ?', [codigo]);
    if (existingProduct.length > 0) {
      return res.status(409).json({ message: 'Este código de produto já está cadastrado.' });
    }

    const [result] = await pool.query('INSERT INTO produtos (codigo, tipo, valor, status) VALUES (?, ?, ?, ?)', [codigo, tipo, valor, 'disponivel']);
    res.status(201).json({ id: result.insertId, codigo, tipo, valor, status: 'disponivel' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/produtos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, tipo, valor } = req.body;

    // Verificar se o novo código já existe para outro produto
    const [existingProduct] = await pool.query('SELECT id FROM produtos WHERE codigo = ? AND id != ?', [codigo, id]);
    if (existingProduct.length > 0) {
      return res.status(409).json({ message: 'Este código de produto já está em uso por outro produto.' });
    }

    const [result] = await pool.query('UPDATE produtos SET codigo = ?, tipo = ?, valor = ? WHERE id = ?', [codigo, tipo, valor, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/produtos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM produtos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para vendas (protegidas)
app.get('/api/vendas', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT v.id, v.data_venda, p.codigo as produto_codigo, p.tipo as produto_tipo, p.valor as produto_valor FROM vendas v JOIN produtos p ON v.produto_id = p.id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/vendas', authenticateToken, async (req, res) => {
  try {
    const { produto_id } = req.body;

    // Verificar se o produto está disponível
    const [productStatus] = await pool.query('SELECT status FROM produtos WHERE id = ?', [produto_id]);
    if (productStatus.length === 0 || productStatus[0].status !== 'disponivel') {
      return res.status(400).json({ message: 'Produto não disponível para venda.' });
    }

    const [result] = await pool.query('INSERT INTO vendas (produto_id) VALUES (?)', [produto_id]);
    // Atualizar status do produto para 'vendido'
    await pool.query('UPDATE produtos SET status = ? WHERE id = ?', ['vendido', produto_id]);

    res.status(201).json({ id: result.insertId, produto_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/vendas/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    // Obter produto_id antes de deletar a venda
    const [saleInfo] = await pool.query('SELECT produto_id FROM vendas WHERE id = ?', [id]);
    if (saleInfo.length === 0) {
      return res.status(404).json({ message: 'Venda não encontrada' });
    }
    const produto_id = saleInfo[0].produto_id;

    const [result] = await pool.query('DELETE FROM vendas WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Venda não encontrada' });
    }
    // Atualizar status do produto para 'disponivel'
    await pool.query('UPDATE produtos SET status = ? WHERE id = ?', ['disponivel', produto_id]);

    res.json({ message: 'Venda excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para reverter venda por código do produto (protegida)
app.delete('/api/vendas/by-produto-codigo/:codigo', authenticateToken, async (req, res) => {
  try {
    const { codigo } = req.params;

    // Primeiro, encontrar o produto_id pelo código
    const [productRows] = await pool.query('SELECT id FROM produtos WHERE codigo = ?', [codigo]);
    if (productRows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado com o código fornecido.' });
    }
    const produto_id = productRows[0].id;

    // Em seguida, encontrar e excluir uma venda associada a este produto_id
    const [saleRows] = await pool.query('SELECT id FROM vendas WHERE produto_id = ? LIMIT 1', [produto_id]);
    if (saleRows.length === 0) {
      return res.status(404).json({ message: 'Nenhuma venda encontrada para o produto com o código fornecido.' });
    }
    const venda_id = saleRows[0].id;

    const [result] = await pool.query('DELETE FROM vendas WHERE id = ?', [venda_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Venda não encontrada para exclusão.' });
    }
    // Atualizar status do produto para 'disponivel'
    await pool.query('UPDATE produtos SET status = ? WHERE id = ?', ['disponivel', produto_id]);

    res.json({ message: 'Venda revertida com sucesso!' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para usuários (protegidas)
app.get('/api/usuarios', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nome, email FROM usuarios'); // Não retornar a senha
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/usuarios/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT id, nome, email FROM usuarios WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/usuarios', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    console.log('Recebida requisição POST para /api/usuarios com:', { nome, email, senha: '***' }); // Loga os dados recebidos

    // Verificar se o email já existe
    const [existingUser] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      console.log('Email já cadastrado:', email);
      return res.status(409).json({ message: 'Este email já está cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10); // Hash da senha
    console.log('Senha hashada com sucesso.');

    const [result] = await pool.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hashedPassword]);
    console.log('Usuário inserido no banco de dados com ID:', result.insertId);
    res.status(201).json({ id: result.insertId, nome, email });
  } catch (error) {
    console.error('Erro na rota POST /api/usuarios:', error.message);
    console.error('Detalhes do erro:', error); // Loga o objeto de erro completo
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/usuarios/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha } = req.body;
    let query = 'UPDATE usuarios SET nome = ?, email = ?';
    let params = [nome, email];
    if (senha) {
      const hashedPassword = await bcrypt.hash(senha, 10);
      query += ', senha = ?';
      params.push(hashedPassword);
    }
    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await pool.query(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/usuarios/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para Tipos de Produto (protegidas)
app.get('/api/tipos-produto', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tipos_produto');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tipos-produto', authenticateToken, async (req, res) => {
  try {
    const { nome } = req.body;
    const [result] = await pool.query('INSERT INTO tipos_produto (nome) VALUES (?)', [nome]);
    res.status(201).json({ id: result.insertId, nome });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tipos-produto/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM tipos_produto WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tipo de produto não encontrado' });
    }
    res.json({ message: 'Tipo de produto excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para Valores de Produto (protegidas)
app.get('/api/valores-produto', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM valores_produto');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/valores-produto', authenticateToken, async (req, res) => {
  try {
    const { valor } = req.body;
    const [result] = await pool.query('INSERT INTO valores_produto (valor) VALUES (?)', [valor]);
    res.status(201).json({ id: result.insertId, valor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/valores-produto/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM valores_produto WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Valor de produto não encontrado' });
    }
    res.json({ message: 'Valor de produto excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para o Dashboard (protegidas)
app.get('/api/dashboard-summary', authenticateToken, async (req, res) => {
  try {
    const [totalProductsResult] = await pool.query('SELECT COUNT(*) as total FROM produtos');
    const totalProducts = totalProductsResult[0].total;

    const [totalSoldProductsResult] = await pool.query('SELECT COUNT(*) as total FROM vendas');
    const totalSoldProducts = totalSoldProductsResult[0].total;

    const remainingProducts = totalProducts - totalSoldProducts;

    const [salesThisMonthResult] = await pool.query('SELECT SUM(valor) as totalSales FROM produtos WHERE status = ?', ['vendido']);
    const salesThisMonth = salesThisMonthResult[0].totalSales || 0; // Se não houver vendas, retorna 0

    res.json({
      totalProducts,
      totalSoldProducts,
      remainingProducts,
      salesThisMonth
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});