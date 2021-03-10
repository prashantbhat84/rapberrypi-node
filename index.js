const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');

app.use(cors({ origin: "*" }));

app.use(express.json());

const port = 3000;

axios.post("https://rtcbackend.gariyasi.org", {
    "id": "2"
}).then(res => {
    console.log(res.data)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})





