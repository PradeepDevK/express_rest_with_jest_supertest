const express = require('express');
const app = express();
const todoRoute = require('./routes/todo.route');
const mongodb = require('./mongodb/mongodb.connect');
mongodb.connect();

app.use(express.json());

app.use('/todos', todoRoute);

app.use((error, req, res, next) => {
    res.status(500).json({ message: error.message })
});

app.get('/', (req, res) => {
    // res.send("Hello World!")
    res.json("Hello World")
});

// app.listen(3000, () => {
//     console.log(`Server is running now! Port 3000`)
// });

module.exports = app;