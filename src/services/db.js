import initSqlJs from 'sql.js';


let db = null;

export async function initDb() {
  const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });

  const saved = localStorage.getItem('db');
  db = saved
    ? new SQL.Database(Uint8Array.from(JSON.parse(saved)))
    : new SQL.Database();

  db.run(`CREATE TABLE IF NOT EXISTS muebles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numeroSerie TEXT,
    tipo TEXT,
    marca TEXT,
    ubicacion TEXT,
    estado TEXT,
    notas TEXT,
    fechaRegistro TEXT
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    email TEXT UNIQUE,
    password TEXT
  );`);

  return db;
}

export function isDbReady() {
  return db !== null;
}

function saveDb() {
  const data = db.export();
  localStorage.setItem('db', JSON.stringify(Array.from(data)));
}

export function insertMueble(data) {
  db.run(
    `INSERT INTO muebles (numeroSerie, tipo, marca, ubicacion, estado, notas, fechaRegistro)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.numeroSerie,
      data.tipo,
      data.marca,
      data.ubicacion,
      data.estado,
      data.notas,
      data.fechaRegistro
    ]
  );
  saveDb();

  const result = db.exec("SELECT last_insert_rowid() AS id");
  const id = result?.[0]?.values?.[0]?.[0];
  return id;
}

export function updateMueble(id, data) {
  const stmt = db.prepare(`UPDATE muebles SET numeroSerie = ?, tipo = ?, marca = ?, ubicacion = ?, estado = ?, notas = ?, fechaRegistro = ? WHERE id = ?`);
  stmt.run([
    data.numeroSerie,
    data.tipo,
    data.marca,
    data.ubicacion,
    data.estado,
    data.notas,
    data.fechaRegistro,
    id
  ]);
  stmt.free();
  saveDb();
}

export function deleteMueble(id) {
  const stmt = db.prepare(`DELETE FROM muebles WHERE id = ?`);
  stmt.run([id]);
  stmt.free();
  saveDb();
}

export function getMuebles() {
  const result = db.exec(`SELECT * FROM muebles`);
  if (!result.length) return [];

  const columns = result[0].columns;
  const values = result[0].values;

  return values.map(row =>
    Object.fromEntries(row.map((val, i) => [columns[i], val]))
  );
}

export function existsMueble(numeroSerie) {
  const result = db.exec(
    `SELECT COUNT(*) as count FROM muebles WHERE numeroSerie = ?`,
    [numeroSerie]
  );
  return result?.[0]?.values?.[0]?.[0] > 0;
}

export function registerUser({ nombre, email, password }) {
  try {
    db.run(
      `INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)`,
      [nombre, email, password]
    );
    saveDb();
    return true;
  } catch (e) {
    return false;
  }
}

export function loginUser({ email, password }) {
  const result = db.exec(
    `SELECT * FROM usuarios WHERE email = ? AND password = ?`,
    [email, password]
  );
  if (result.length > 0 && result[0].values.length > 0) {
    const columns = result[0].columns;
    const values = result[0].values[0];
    return Object.fromEntries(values.map((v, i) => [columns[i], v]));
  }
  return null;
}