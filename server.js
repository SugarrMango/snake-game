const http = require("node:http");
const fs = require("node:fs");

const mime = require("mime");

const hostname = "127.0.0.1"; // localhost
const port = 3001;

function handleRequest(req, res) {
  res.statusCode = 200; // OK!
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

  let url = req.url; // https://www.apple.com/

  if (url === "/") {
    res.statusCode = 301; // HOLD ON! REDIRECT!
    res.setHeader("Location", "/snake-game/pages/menu/index.html");
    res.end();
    return;
  }

  // url: -----------.html, ------------.css
  // mime.getType('html') -> 'text/html'

  if (url.endsWith(".html")) {
    res.setHeader("Content-Type", "text/html");
  } else if (url.endsWith(".css")) {
    res.setHeader("Content-Type", "text/css");
  } else if (url.endsWith(".js")) {
    res.setHeader("Content-Type", "text/javascript");
  } else if (url.endsWith(".mp3")) {
    res.setHeader("Content-Type", "media/mp3");
  } else if (url.endsWith(".png")) {
    res.setHeader("Content-Type", "image/png");
  } else if (url.endsWith(".jpg")) {
    res.setHeader("Content-Type", "image/jpeg");
  } else {
    if (url.endsWith("/")) {
      url = url.slice(0, -1);
    }

    res.statusCode = 301;
    res.setHeader("Location", url + "/index.html");
    res.end();
    return;
  }

  try {
    const file = fs.readFileSync("." + url);
    res.end(file);
  } catch {
    console.log("url not found", url);
    res.statusCode = 404; // ERROR! NOT FOUND
    res.end("404 Not Found");
  }
}

const server = http.createServer(handleRequest);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
