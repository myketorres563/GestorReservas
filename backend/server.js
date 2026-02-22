import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import jsonServer from "json-server";

const PORT = 3000;
const JWT_SECRET = "secreto-reservas-19";

const app = express();
app.use(cors());
app.use(express.json());

const router = jsonServer.router("db.json");
const db = router.db;

// --- Helpers ---
function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "Falta token" });
  const token = header.slice("Bearer ".length);
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
}

const userIdFromReq = (req) => Number(req.user?.sub);

// --- Auth Endpoints ---
app.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  const user = db.get("users").find({ email }).value();
  if (!user) return res.status(401).json({ message: "Usuario no encontrado" });
  
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Password incorrecto" });

  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "2h" });
  return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

app.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Datos incompletos" });
  
  const passwordHash = await bcrypt.hash(password, 10);
  const users = db.get("users");
  const nextId = (users.maxBy("id").value()?.id ?? 0) + 1;
  const newUser = { id: nextId, email, name, passwordHash };
  users.push(newUser).write();
  return res.status(201).json({ id: nextId, email });
});

// --- RESERVAS (CRUD) ---
// GET: Listar mis reservas
app.get("/reservations", authRequired, (req, res) => {
  const userId = userIdFromReq(req);
  const data = db.get("reservations").filter({ userId }).value();
  res.json(data);
});

// POST: Crear reserva
app.post("/reservations", authRequired, (req, res) => {
  const userId = userIdFromReq(req);
  const { nombreCliente, fecha, personas } = req.body;

  if (!nombreCliente || !fecha) return res.status(400).json({ message: "Faltan datos" });

  const collection = db.get("reservations");
  const nextId = (collection.maxBy("id").value()?.id ?? 0) + 1;

  const newRes = {
    id: nextId,
    client: nombreCliente,
    date: fecha,
    pax: Number(personas),
    userId
  };

  collection.push(newRes).write();
  res.status(201).json(newRes);
});


// DELETE: Borrar reserva
app.delete("/reservations/:id", authRequired, (req, res) => {
  const userId = userIdFromReq(req);
  const id = Number(req.params.id);
  const item = db.get("reservations").find({ id }).value();

  if (!item || item.userId !== userId) return res.status(404).json({ message: "No encontrado" });
  
  db.get("reservations").remove({ id }).write();
  res.status(204).send();
});

// Usar router por defecto para lo demás
app.use(router);

app.listen(PORT, () => {
  console.log(`API Restaurante lista en http://localhost:${PORT}`);
});