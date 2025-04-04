const express = require("express");
const app = express();

let data = ["molly"];

app.use(express.json());

// ENDPOINT - HTTP VERBS (method) && Routes (or paths)
// The method informs the nature of request and the
// route is a further subdirectory(basically
// we direct the request to the body of code
// to respond appropriately, and these locations
// or routes are called endpoints)

/*

Type 1 - Website Endpoints - 
these endpoints are for sending back html and they typically
come when a user enters a url in browser
*/
app.get("/", (req, res) => {
  res.status(200).send(`
    <body style="background:pink;color:blue;">
    <h1>HomePage</h1>
      <p>Users : ${JSON.stringify(data)}</p>    
      <a href="/dashboard">Dashboard</a>
    </body >
  `);
});

app.get("/dashboard", (req, res) => {
  res.status(200).send(`
    <body style="background:pink;color:blue;">
    <h1>Dashboard</h1>
      <p>Users : ${JSON.stringify(data)}</p>    
      <a href="/">Home</a>
    </body >
  `);
});

/*
Type 2 - API Endpoints - non visual end points
*/

// CRUD - Create Read Update Delete -
// these four actions control all modifications
// 1. create - post
// 2. read   - get
// 3. update - put
// 4. delete - delete

app.get("/api/data", (req, res) => {
  res.status(200).send(data);
});

app.post("/api/data", (req, res) => {
  // someone wants to create a user
  // for example they click a sign up button
  // the user clicks the sign up button after
  // entering their credentials, and their browser
  // is wired up to send out a network request to
  // the server to handle that action
  const newUser = req.body.name;
  data = [...data, newUser];
  res.status(201).json({ message: `User ${newUser} added successfully.` });
});

app.delete("/api/data", (req, res) => {
  if (data.length === 0) {
    return res.status(404).json({ message: "No element to delete." });
  }

  const deleted = data[data.length - 1];
  // Create a new array without the last element
  data = data.slice(0, -1);
  res
    .status(200)
    .json({ message: "Deleted the most recent element.", deleted });
});

app.get("*", (req, res) => {
  res.status(404).send("Error 404 : Not found.");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

/* 
HTTP status codes are grouped into several classes, each indicating a different type of response. Here's a breakdown:

1xx – Informational:
These codes indicate that the request was
received and the process is continuing. They
are mostly used internally and are rarely
seen by end users.

2xx – Success:
The request was successfully received, understood,
and accepted. For example,

200 OK: The request was successful.

201 Created: A new resource has been created as a
result of the request.

3xx – Redirection:
These codes indicate that further action is needed
to complete the request. They often involve URL
redirection. For example,

301 Moved Permanently: The resource has permanently
moved to a new URL.

302 Found: The resource is temporarily located at a
different URL.

4xx – Client Errors:
These codes indicate that there was an error in the
request made by the client. They typically mean that
the client should modify the request. For example,

400 Bad Request: The server could not understand the
request due to invalid syntax.

404 Not Found: The requested resource could not be
found on the server.

5xx – Server Errors:
These codes indicate that the server failed to
fulfill a valid request. They suggest that the
error is on the server side. For example,

500 Internal Server Error: A generic error message 
when the server encounters an unexpected condition.

503 Service Unavailable: The server is not ready to 
handle the request, often due to temporary overload 
or maintenance.

*/
