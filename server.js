const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const pug = require('pug');
const { getStudentsData, formatDate, addStudent, deleteStudent, calculate } = require('./core/utils');
const dotenv = require('dotenv');

dotenv.config();

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  const pathname = reqUrl.pathname;
  const method = req.method;

  if (method === 'GET') {
    if (pathname === '/') {
      const homeViewPath = path.join(__dirname, 'view', 'home.pug');
      const homeTemplate = fs.readFileSync(homeViewPath, 'utf8');
      const compiledHomeTemplate = pug.compile(homeTemplate);
      const html = compiledHomeTemplate();

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.writeHead(200);
      res.end(html);
    } else if (pathname === '/users') {
      let students = getStudentsData();
      students = students.map(student => ({
        ...student,
        birth: formatDate(student.birth)
      }));

      const usersViewPath = path.join(__dirname, 'view', 'users.pug');
      const usersTemplate = fs.readFileSync(usersViewPath, 'utf8');
      const compiledUsersTemplate = pug.compile(usersTemplate);
      const html = compiledUsersTemplate({ students });

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.writeHead(200);
      res.end(html);
    } else if (pathname === '/calculator') {
      const calculatorViewPath = path.join(__dirname, 'view', 'calculator.pug');
      const calculatorTemplate = fs.readFileSync(calculatorViewPath, 'utf8');
      const compiledCalculatorTemplate = pug.compile(calculatorTemplate);
      const html = compiledCalculatorTemplate();

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.writeHead(200);
      res.end(html);
    } else {
      if (pathname.includes('.css')) {
        const cssFilePath = path.join(__dirname, pathname);
        fs.readFile(cssFilePath, (err, data) => {
          if (err) {
            res.writeHead(404);
            return res.end('Error loading css file');
          }

          res.setHeader('Content-Type', 'text/css; charset=utf-8');
          res.writeHead(200);
          res.end(data);
        });
      } else {
        res.writeHead(404);
        res.end('Page not found');
      }
    }
  } else if (method === 'POST') {
    if (pathname === '/add-student') {
      let body = '';

      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const student = querystring.parse(body);
        addStudent(student);

        res.writeHead(302, { 'Location': '/users' });
        res.end();
      });
    } else if (pathname === '/delete-student') {
      let body = '';

      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const { name } = querystring.parse(body);
        deleteStudent(name);

        res.writeHead(302, { 'Location': '/users' });
        res.end();
      });
    } else if (pathname === '/calculator') {
      let body = '';

      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const { number1, number2, operation } = querystring.parse(body);

        let result;

        if (operation === 'addition') {
          result = calculate.addition(parseFloat(number1), parseFloat(number2));
        } else if (operation === 'multiplication') {
          result = calculate.multiplication(parseFloat(number1), parseFloat(number2));
        } else {
          result = 'Invalid operation';
        }

        const calculatorViewPath = path.join(__dirname, 'view', 'calculator.pug');
        const calculatorTemplate = fs.readFileSync(calculatorViewPath, 'utf8');
        const compiledCalculatorTemplate = pug.compile(calculatorTemplate);
        const html = compiledCalculatorTemplate({ result });

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.writeHead(200);
        res.end(html);
      });
    } else {
      res.writeHead(404);
      res.end('Page not found');
    }
  }
});

server.listen(process.env.APP_PORT, process.env.APP_LOCALHOST, () => {
  console.log(`Server running at http://${process.env.APP_LOCALHOST}:${process.env.APP_PORT}/`);
});
