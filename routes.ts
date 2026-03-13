import fs from 'fs';
import http from 'http';

type FormUrlEncodedString = string & { __brand: 'FormUrlEncoded' };

type ResquestHandlerProps = {
  req: http.IncomingMessage;
  res: http.ServerResponse;
}

export const requestHandler = ({ req, res }: ResquestHandlerProps) => {
  const url = req.url;
  const method = req.method;
  
  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Enter Message</title></head>');
    //action is the url to which the form data will be sent when the form is submitted. Post is the
    //method of sending the form data. It can be either GET or POST. GET appends the form data to
    //the URL, while POST sends the form data in the body of the request. The <input> name attribute
    //is used to specify the name of the form data that will be sent to the server. In this case,
    //the form data will be sent as "message".
    res.write('<body><form action="/message" method="POST"><input name="message"><button>Send</button></form></body>');
    res.write('</html>');
    return res.end();
  }
  if (url === '/message' && method === 'POST') {
    const body: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      console.log(chunk);
      body.push(chunk);
    });
     return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString() as FormUrlEncodedString;
      //const message = parsedBody.split('=')[1];
      const message = new URLSearchParams(parsedBody).get('message') ?? '';
      fs.writeFile('message.txt', message, err => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
    //Allows us to write meta info in one go. Passing a status code of 302 means that the resource
    //has been temporarily moved to a different URL. The browser will automatically redirect to the
    //new URL specified in the Location header. In this case, we are redirecting back to the root
    //URL ("/"). We also pass a js object with header info.
    //res.writeHead(302, {});
  }
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>Shiny Node.ts Server</title></head>');
  res.write('<body><h1>The shiny Node.ts server blinds me, captain.</h1></body>');
  res.write('</html>');
  res.end();
}
