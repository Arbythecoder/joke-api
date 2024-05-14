const http = require("http");

let db = [
  {
    title: "Why did the scarecrow win an award?",
    comedian: "Because he was outstanding in his field!",
    year: "Unknown",
    id: 1,
  },
  {
    title: "Why don't scientists trust atoms?",
    comedian: "Because they make up everything!",
    year: "Unknown",
    id: 2,
  },
  {
    title: "Why don't skeletons fight each other?",
    comedian: "They don't have the guts!",
    year: "Unknown",
    id: 3,
  },
  {
    title: "What do you get when you cross a snowman with a vampire?",
    comedian: "Frostbite!",
    year: "Unknown",
    id: 4,
  },
  {
    title: "Why don't eggs tell jokes?",
    comedian: "Because they'd crack each other up!",
    year: "Unknown",
    id: 5,
  },
  {
    title: "Why did the bicycle fall over?",
    comedian: "Because it was two-tired!",
    year: "Unknown",
    id: 6,
  },
  {
    title: "What do you call fake spaghetti?",
    comedian: "An impasta!",
    year: "Unknown",
    id: 7,
  },
  {
    title: "Why did the tomato turn red?",
    comedian: "Because it saw the salad dressing!",
    year: "Unknown",
    id: 8,
  },
  {
    title: "What did one plate say to the other plate?",
    comedian: "Dinner's on me!",
    year: "Unknown",
    id: 9,
  },
  {
    title: "Why did the golfer bring two pairs of pants?",
    comedian: "In case he got a hole in one!",
    year: "Unknown",
    id: 10,
  },
];
const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method; // Define method here

  // Parse request body for POST and PATCH requests
  let data;
  if (method === "POST" || method === "PATCH") {
    data = "";
    req.on("data", chunk => {
      data += chunk.toString();
    });
    req.on("end", () => {
      try {
        data = JSON.parse(data);
      } catch (error) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.write("Invalid JSON data in request body");
        res.end();
        return;
      }
      handleRequests(url, method, data, res);
    });
  } else {
    handleRequests(url, method, null, res);
  }
});

function handleRequests(url, method, data, res) {
  switch (method) {
    case "GET":
      if (url === "/") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(db));
        res.end();
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("404 Not Found");
        res.end();
      }
      break;
    case "POST":
      if (url === "/") {
        if (!data.title || !data.comedian || !data.year) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.write(
            "Missing required fields in request body (title, comedian, year)"
          );
          res.end();
          return;
        }

        // Generate a unique ID
        const newJoke = {
          id: Math.floor(Math.random() * 100000),
          comedian: data.comedian,
          year: data.year,
        };
        db.push(newJoke);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.write(JSON.stringify(db));
        res.end();
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("404 Not Found");
        res.end();
      }
      break;
    case "PATCH":
      const jokeId = url.split("/")[2];
      const matchingJoke = db.find(joke => joke.id === jokeId);
      if (!matchingJoke) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("404 Joke Not Found");
        res.end();
        return;
      }

      if (data) {
        Object.assign(matchingJoke, data);
      }
      // update the joke object based on data
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(db));
      res.end();
      break;
    default:
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.write("404 Not Found");
      res.end();
  }
}

// Start the server
server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
