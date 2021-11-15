const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const serial = require("serialport");
const ByteLength = require('@serialport/parser-byte-length');
const os = require('os');
const url = "https://tranquil-cove-09766.herokuapp.com";
let timestamp = [];
const port1 = 3000;
const network = os.networkInterfaces();
const crypto= require('crypto-js')

while(!checkInternetConnection()) {
  console.log("No internet connection");
}

const id = (network['wlan0'][0].mac);


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
  timestamp.push(date.getUTCDate())
  timestamp.push(date.getUTCMonth()+1)
  timestamp.push(date.getUTCFullYear())
  timestamp.push(date.getUTCHours())
  timestamp.push(date.getUTCMinutes())
  timestamp.push(date.getUTCSeconds())
  timestamp.push(date.getUTCMilliseconds())
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
// const data = [14, 30, 59, 20, 224, 2, 36, 0, 2, 112, 164, 224, 79, 88, 75, 24, 35, 12, 77, 98, 43, 21, 79, 34, 83, 70, 50, 70, 50, 22, 23, 153,15,9,2021, 10, 32, 21, 755, 'dca632b8f170'];


// const server = `${url}/api/v1/aggregator/updateAggregatorAndBox`
// // if(checkInternetConnection()) {
// //   axios.put(server, {
// //     body: {
// //       data: (data)
// //     },
  
// //   }).then(res => {
// //     console.log(res.data.result.body.data)
// //   }).catch(e => {
// //     console.log(e.message);
// //   })
// // }
let sp, sp1;
sp = new serial(portName, {
  baudRate: 115200,
});
const options = {
  length: 32
}
sp1 = sp.pipe(new ByteLength(options))
let result;


sp1.on('data', (data) => {
 
  let val = JSON.stringify(data);
  val = (JSON.parse(val));
  const time = createTimestampAndAggregator();
  let finaldata = [...val.data, ...time];
  const internet = checkInternetConnection();
  if (internet) {
    const server = `${url}/api/v1/aggregator/updateAggregatorAndBox`
    axios.put(server, {
      body: {
        data: (finaldata),
          
      },

    }).then(res => {
      console.log(res.data)
    })
  }
  timestamp = [];

  // const send = val1.data[5].toString();
  // const finaldata = send + "\r" + "\n";
  // sp.write(send);
  // sp.write("\r\n");
});







app.listen(port1, () => {
  console.log(`Server is running on port ${port1}`)
})


