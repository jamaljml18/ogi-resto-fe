import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, relative, isAbsolute, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
  '.json':'application/json','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml','.png':'image/png',
  '.jpg':'image/jpeg','.jpeg':'image/jpeg','.ico':'image/x-icon','.woff':'font/woff','.woff2':'font/woff2','.webp':'image/webp'};

export function createStaticPreviewServer(directory) {
  const root = resolve(directory);
  return createServer(async (req,res) => {
    res.setHeader('X-Content-Type-Options','nosniff');
    if (!['GET','HEAD'].includes(req.method)) { res.setHeader('Allow','GET, HEAD'); res.writeHead(405); res.end(); return; }
    try {
      const url = new URL(req.url,'http://localhost');
      const pathname = decodeURIComponent(url.pathname);
      if (pathname.includes(String.fromCharCode(0))) { res.writeHead(400); res.end(); return; }
      let file = resolve(root,'.' + pathname);
      const tail = relative(root,file);
      if (tail === '..' || tail.startsWith('..' + sep) || isAbsolute(tail) || tail.split(/[\\\\/]/).some(part=>part.startsWith('.'))) {
        res.writeHead(403); res.end(); return;
      }
      let info = await stat(file);
      if (info.isDirectory()) {
        if (!pathname.endsWith('/')) { res.writeHead(308,{Location:url.pathname+'/' + url.search}); res.end(); return; }
        file = resolve(file,'index.html'); info = await stat(file);
      }
      if (!info.isFile()) throw new Error('not a file');
      const body = await readFile(file);
      res.setHeader('Content-Type',types[extname(file)] || 'application/octet-stream');
      res.setHeader('Cache-Control',pathname.startsWith('/_next/static/') ? 'public, max-age=31536000, immutable' : 'no-cache');
      res.writeHead(200); res.end(req.method === 'HEAD' ? undefined : body);
    } catch {
      let body = 'Not found';
      try { body = await readFile(resolve(root,'404.html')); res.setHeader('Content-Type','text/html; charset=utf-8'); } catch {}
      res.writeHead(404); res.end(req.method === 'HEAD' ? undefined : body);
    }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../out/',import.meta.url));
  if (!existsSync(resolve(root,'index.html'))) { console.error('Folder out belum tersedia. Jalankan npm run build terlebih dahulu.'); process.exitCode = 1; }
  else {
    const port = Number(process.env.PORT || 3000);
    if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('PORT tidak valid.');
    const server = createStaticPreviewServer(root);
    server.listen(port,'127.0.0.1',()=>console.log('Preview statis: http://127.0.0.1:' + server.address().port));
  }
}
