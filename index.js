const http = require('http');

const secret = 'secret';

const server = http.createServer(async (req, res) => {
  const reqUrl = req.url;

  if (!reqUrl.startsWith(`/${secret}/`)) {
    res.writeHead(503, { 'Content-Type': 'text/plain' });
    res.end('Service Unavailable');
    return;
  }

  const targetUrl = decodeURIComponent(reqUrl.replace(`/${secret}/`, ''));

  const proxyRes = await fetch(targetUrl, {
    method: req.method,
    headers: req.headers,
    body: req.body
  });

  res.writeHead(proxyRes.status, proxyRes.headers);
  res.end(await proxyRes.text());
});

// 监听端口
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
