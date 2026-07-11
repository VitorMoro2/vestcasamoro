// Servidor VestCasaMoro — arquivos estáticos + API de produtos
const http = require("http");
const fs   = require("fs");
const path = require("path");

const ROOT       = __dirname;
const PORT       = 4321;
const DB_FILE    = path.join(ROOT, "produtos.json");
const UPLOAD_DIR = path.join(ROOT, "assets", "images", "produtos");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "text/javascript; charset=utf-8",
  ".mp4":  "video/mp4",
  ".webm": "video/webm",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico":  "image/x-icon",
  ".json": "application/json",
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", c => chunks.push(c));
    req.on("end", () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
      catch (e) { reject(new Error("JSON inválido")); }
    });
    req.on("error", reject);
  });
}

function json(res, code, body) {
  res.writeHead(code, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify(body));
}

http
  .createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }

    const url = req.url.split("?")[0];

    // ── API: listar produtos ───────────────────────────────────────────────────
    if (url === "/api/produtos" && req.method === "GET") {
      try {
        const data = fs.readFileSync(DB_FILE, "utf8");
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(data);
      } catch {
        return json(res, 404, { error: "produtos.json não encontrado" });
      }
    }

    // ── API: salvar produtos ───────────────────────────────────────────────────
    if (url === "/api/produtos" && req.method === "POST") {
      try {
        const body = await readBody(req);
        fs.writeFileSync(DB_FILE, JSON.stringify(body, null, 2), "utf8");
        return json(res, 200, { ok: true });
      } catch (e) {
        return json(res, 400, { error: e.message });
      }
    }

    // ── API: upload de foto ────────────────────────────────────────────────────
    if (url === "/api/upload" && req.method === "POST") {
      try {
        const { filename, data } = await readBody(req);
        if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
        const dest = path.join(UPLOAD_DIR, safeName);
        fs.writeFileSync(dest, Buffer.from(data.replace(/^data:[^;]+;base64,/, ""), "base64"));
        return json(res, 200, { path: `assets/images/produtos/${safeName}` });
      } catch (e) {
        return json(res, 400, { error: e.message });
      }
    }

    // ── Arquivos estáticos ─────────────────────────────────────────────────────
    let urlPath = decodeURIComponent(url);
    if (urlPath === "/") urlPath = "/index.html";
    const filePath = path.join(ROOT, urlPath);

    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403); return res.end("Forbidden");
    }

    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("Not found");
      }

      const mime  = TYPES[path.extname(filePath)] || "application/octet-stream";
      const total = stat.size;
      const range = req.headers.range;

      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Content-Type", mime);

      if (range) {
        const [rawStart, rawEnd] = range.replace(/bytes=/, "").split("-");
        const start = parseInt(rawStart, 10);
        const end   = rawEnd ? parseInt(rawEnd, 10) : total - 1;
        const chunk = end - start + 1;

        if (start >= total || end >= total || start > end) {
          res.writeHead(416, { "Content-Range": `bytes */${total}` });
          return res.end();
        }

        res.writeHead(206, {
          "Content-Range":  `bytes ${start}-${end}/${total}`,
          "Content-Length": chunk,
        });
        fs.createReadStream(filePath, { start, end }).pipe(res);
      } else {
        res.writeHead(200, { "Content-Length": total });
        fs.createReadStream(filePath).pipe(res);
      }
    });
  })
  .listen(PORT, () => {
    console.log("=====================================");
    console.log("  VestCasaMoro rodando!");
    console.log("  Site:  http://localhost:" + PORT);
    console.log("  Admin: http://localhost:" + PORT + "/admin.html");
    console.log("=====================================");
  });
