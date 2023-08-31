const express = require('express');
const path = require('path');

const app = express();

// Middleware oluşturmak için fonksiyon ve app.use ile çağırma: app.use(express.static('public')); altına app.use(myLogger); yazılarak çağırılır.
// const myLogger = (req, res, next) => {
//      console.log('Middleware 1');
//      next();
// };

// const myLogger2 = (req, res, next) => {
//      console.log('Middleware 2');
//      next();
// };

// Midlewares
app.use(express.static('public'));
// app.use(myLogger);
// app.use(myLogger2);

app.get('/', (req, res) => {
     res.sendFile(path.resolve(__dirname, 'temp/index.html'));
});

const port = 3000;
app.listen(port, () => {
     console.log(`Port: ${port} üzerinden yayına başlandı`);
});
