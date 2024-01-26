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

  // You have a string called 'url', you need to find a position of a '.' inside
  // url.

  // /pages/main.page/sub.page/index.html

  const dotPosition = url.lastIndexOf(".");
  const fileExtension = url.substring(dotPosition + 1);
  const fileType = mime.getType(fileExtension);

  if (fileType === null) {
    if (url.endsWith("/")) {
      url = url.slice(0, -1);
    }

    res.statusCode = 301;
    res.setHeader("Location", url + "/index.html");
    res.end();
    return;
  }

  res.setHeader("Content-Type", fileType);

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
