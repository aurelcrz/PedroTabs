const http = require('node:http');
const fs = require('node:fs/promises');
const fsSync = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = 8080;

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

function getContentType(filePath) {
  return contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

async function readJson(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

async function getAppConfig() {
  return readJson(path.join(root, 'site-config.json'), {
    features: {
      remoteImport: false
    }
  });
}

function htmlToPlainText(text) {
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function decodeJsonEscapedText(text) {
  return text
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\//g, '/')
    .replace(/\\\\/g, '\\')
    .trim();
}

function getRemoteTabContent(html) {
  const patterns = [
    /"content"\s*:\s*"(?<content>(?:\\.|[^"\\]){80,})"/is,
    /"wiki_tab"\s*:\s*\{.*?"content"\s*:\s*"(?<content>(?:\\.|[^"\\]){80,})"/is,
    /"tab"\s*:\s*\{.*?"content"\s*:\s*"(?<content>(?:\\.|[^"\\]){80,})"/is,
    /"lyrics"\s*:\s*"(?<content>(?:\\.|[^"\\]){80,})"/is,
    /<pre[^>]*>(?<content>.*?)<\/pre>/is,
    /<code[^>]*>(?<content>.*?)<\/code>/is
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (!match || !match.groups || !match.groups.content) {
      continue;
    }

    const raw = match.groups.content;
    const content = pattern.source.includes('"content"')
      ? decodeJsonEscapedText(raw)
      : htmlToPlainText(raw);

    if (/[\|\-]{3,}/.test(content) || /(^|\n)[A-G][#b]?(m|maj7|sus|dim|aug|add)?/m.test(content)) {
      return content;
    }
  }

  return null;
}

function getSafeRemoteFileName(urlString, existingNames) {
  const url = new URL(urlString);
  let leaf = path.basename(url.pathname) || url.hostname;
  leaf = path.basename(leaf, path.extname(leaf)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!leaf) {
    leaf = 'remote-tab';
  }

  const baseName = `remote-${leaf}`;
  let candidate = `${baseName}.txt`;
  let index = 2;
  while (existingNames.has(candidate.toLowerCase())) {
    candidate = `${baseName}-${index}.txt`;
    index += 1;
  }

  existingNames.add(candidate.toLowerCase());
  return candidate;
}

async function importRemoteTabs() {
  const configPath = path.join(root, 'remote-tabs.json');
  const config = await readJson(configPath, null);
  if (!config) {
    throw new Error('Fichier remote-tabs.json introuvable.');
  }
  if (!Array.isArray(config.urls) || config.urls.length === 0) {
    throw new Error('Aucune URL dans remote-tabs.json.');
  }

  const tabsPath = path.join(root, 'tabs');
  const existingFiles = await fs.readdir(tabsPath, { withFileTypes: true });
  const existingNames = new Set(
    existingFiles
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.txt'))
      .map((entry) => entry.name.toLowerCase())
  );

  const imported = [];
  const errors = [];

  for (const url of config.urls) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36',
          'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
        },
        signal: AbortSignal.timeout(20000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const content = getRemoteTabContent(html);
      if (!content) {
        throw new Error('Zone tablature introuvable sur cette page.');
      }

      const fileName = getSafeRemoteFileName(url, existingNames);
      const filePath = path.join(tabsPath, fileName);
      const header = `Source: ${url}\n\n`;
      await fs.writeFile(filePath, header + content, 'utf8');
      imported.push(fileName);
    } catch (error) {
      errors.push(`${url} -> ${error.message}`);
    }
  }

  return { imported, errors };
}

async function listTabs() {
  const tabsRoot = path.join(root, 'tabs');
  const results = [];

  async function walk(currentPath) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        await walk(absolute);
        continue;
      }

      if (entry.isFile() && entry.name.toLowerCase().endsWith('.txt')) {
        results.push(path.relative(tabsRoot, absolute).replaceAll('\\', '/'));
      }
    }
  }

  await walk(tabsRoot);
  return results.sort((a, b) => a.localeCompare(b, 'fr'));
}

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store'
  });
  response.end(body);
}

function sendText(response, statusCode, body, contentType = 'text/plain; charset=utf-8') {
  response.writeHead(statusCode, {
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(body)
  });
  response.end(body);
}

async function sendFile(response, filePath) {
  const body = await fs.readFile(filePath);
  response.writeHead(200, {
    'Content-Type': getContentType(filePath),
    'Content-Length': body.length,
    'Cache-Control': filePath.endsWith('.txt') ? 'no-store' : 'public, max-age=300'
  });
  response.end(body);
}

function resolveSafePath(requestPath) {
  const relativePath = requestPath === '/' ? 'index.html' : decodeURIComponent(requestPath.slice(1));
  const resolvedPath = path.resolve(root, relativePath);
  if (!resolvedPath.startsWith(root)) {
    return null;
  }
  return resolvedPath;
}

const server = http.createServer(async (request, response) => {
  request.setTimeout(5000);
  response.setTimeout(10000);

  try {
    if (!request.url) {
      sendText(response, 400, 'Requete invalide.');
      return;
    }

    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    const requestPath = url.pathname;

    if (request.method !== 'GET') {
      sendText(response, 405, 'Methode non autorisee.');
      return;
    }

    if (requestPath === '/api/tabs') {
      sendJson(response, 200, await listTabs());
      return;
    }

    if (requestPath === '/api/config') {
      sendJson(response, 200, await getAppConfig());
      return;
    }

    if (requestPath === '/api/import-remote') {
      const appConfig = await getAppConfig();
      if (!appConfig.features || !appConfig.features.remoteImport) {
        sendJson(response, 403, { error: 'Import distant desactive dans site-config.json.' });
        return;
      }

      try {
        const result = await importRemoteTabs();
        sendJson(response, result.imported.length > 0 ? 200 : 422, result);
      } catch (error) {
        sendJson(response, 500, { error: error.message });
      }
      return;
    }

    const filePath = resolveSafePath(requestPath);
    if (!filePath) {
      sendText(response, 403, 'Acces refuse.');
      return;
    }

    if (!fsSync.existsSync(filePath) || !fsSync.statSync(filePath).isFile()) {
      sendText(response, 404, 'Fichier introuvable.');
      return;
    }

    await sendFile(response, filePath);
  } catch (error) {
    if (!response.headersSent) {
      sendText(response, 500, 'Erreur serveur.');
    } else {
      response.destroy();
    }
  }
});

server.on('clientError', (error, socket) => {
  if (socket.writable) {
    socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log('PedroTabs disponible sur http://localhost:8080');
  console.log('Ajoute tes fichiers .txt dans le dossier tabs puis recharge la page.');
  console.log('Arret avec Ctrl + C');
});
