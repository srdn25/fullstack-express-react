const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('ok');
});

app.listen(port, () => {
    console.log(`Application started on ${port} port!`);
})