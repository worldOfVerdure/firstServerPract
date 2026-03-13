import http from 'http';
import { requestHandler } from './routes.ts';


const server = http.createServer((req, res) => {
  requestHandler({ req, res });
});

server.listen(3000);

/*
Why the 302 redirect is important:

The 302 status code with Location: / performs a redirect. Without it:

The browser would stay on the /message URL after submission
The page would be blank/show nothing (because the response ends immediately)
If the user hits refresh, the browser would warn about resubmitting the form (annoying!)
With the redirect:

The server tells the browser: "I processed your POST, now GO to / instead"
The browser makes a fresh GET request to /, showing the form again
If the user refreshes, it just reloads the form—no resubmit warning
This is called the Post/Redirect/Get (PRG) pattern—a standard best practice to prevent accidental
duplicate form submissions and provide better UX.

The Location header alone doesn't trigger a redirect. Browsers only follow the Location header when
they receive a 3xx status code (like 302, 301, 303, etc.).

Without the status code:

The response would have a default status of 200 OK
The browser interprets this as "here's your successful response"
The Location header gets ignored
The page stays blank at /message
With res.statusCode = 302:

The browser sees "302 Found"
It checks for a Location header
It automatically navigates to that location (/)
The combo is required:


res.statusCode = 302; // "This is a redirect"res.setHeader('Location', '/'); // "Go here"
Think of it like: the status code tells the browser what to do, and the Location header tells it
where to go. You need both!
*/
