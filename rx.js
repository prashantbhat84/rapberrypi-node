const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const serial= require("serialport");
const ByteLength = require('@serialport/parser-byte-length');
const Readline = require('@serialport/parser-readline');
const storage=[];
;
//serial.flush();
app.use(cors({ origin: "*" }));

app.use(express.json());
const portName= '/dev/ttyAMA1';

let sp,sp1;
try{
 sp= new serial(portName,{
baudRate:115200,

});
const options={
length:32
}
sp1=sp.pipe(new ByteLength(options))
}catch(e){
  console.log(e);
}
let i=10;

i=i.toString();
for(let j=0;j<10;j++){
sp.write(i);
sp.write("\r\n");
}


const port1 = 3000;

/*axios.post("https://rtcbackend.gariyasi.org", {
    "id": "pragati"
}).then(res => {
    console.log(res.data)
})*/

app.listen(port1, () => {
    console.log(`Server is running on port ${port1}`)
})


