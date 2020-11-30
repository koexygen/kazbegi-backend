const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.status(200).json({msg:'Hello from the server sides'});
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
