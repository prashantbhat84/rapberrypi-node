const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const serial = require("serialport");
const ByteLength = require('@serialport/parser-byte-length');
const os = require('os');
const url = "https://tranquil-cove-09766.herokuapp.com";
const timestamp = [];
const port1 = 3000;
const network = os.networkInterfaces();

const id = (network['eth0'][0].mac);
let aggid = id.split(":");
let temp = "";
aggid.forEach(item => {
  temp = temp + item
});

setInterval(() => {
  console.log("aggregtor status send")
  const server = `${url}/api/v1/aggregator/updateaggregator`
  const internet = checkInternetConnection();
  if (internet) {
    axios.post(server, {
      body: {
        id: JSON.stringify(temp)
      },

    }).then(result => {
      console.log(result.data)
    }).catch(e => {
      console.log(e.message)
    })
  }
}, 10000)
function createTimestampAndAggregator() {
  const date = new Date();
  timestamp.push(date.getUTCHours());
  timestamp.push(date.getUTCMinutes());
  timestamp.push(date.getUTCSeconds());
  timestamp.push(date.getUTCMilliseconds());
  timestamp.push(temp)
  return timestamp;
}
function checkInternetConnection() {
  const id = (network['wlan0']);
  if (id) {
    return true;
  } else {
    return false
  }
}

app.use(cors({ origin: "*" }));
app.use(express.json());
const portName = '/dev/ttyAMA2';
let sp, sp1;
sp = new serial(portName, {
  baudRate: 115200,
});
const options = {
  length: 32
}
sp1 = sp.pipe(new ByteLength(options))



sp1.on('data', (data) => {
  console.time("Data");
  let val = JSON.stringify(data);
  val = (JSON.parse(val));
  const time = createTimestampAndAggregator();
  let finaldata = [...val1.data, ...time]
  const internet = checkInternetConnection();
  if (internet) {
    const server = `${url}/api/v1/aggregator/updateAggregatorAndBox`
    axios.post(server, {
      body: JSON.stringify(finaldata),

    }).then(res => {
      console.log(res.data)
    })
  }
  console.timeEnd("Data")
  // const send = val1.data[5].toString();
  // const finaldata = send + "\r" + "\n";
  // sp.write(send);
  // sp.write("\r\n");
});







app.listen(port1, () => {
  console.log(`Server is running on port ${port1}`)
})


