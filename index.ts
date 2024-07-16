
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// routes
const booksRoutes = require('./routes/booksRoutes');
const usersRoutes = require('./routes/usersRoutes');

app.use('/', booksRoutes);
app.use('/', usersRoutes);

app.listen(3000, ()=>{
    console.log('Server is runnig');
});