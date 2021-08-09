const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const serial= require("serialport");
const ByteLength = require('@serialport/parser-byte-length');
const dotenv = require('dotenv')
dotenv.config({ path: "./config/config.env" });
console.log(process.env.aggId);

;
//serial.flush();
app.use(cors({ origin: "*" }));

app.use(express.json());
//const portName= '/dev/ttyAMA1';
const portName= '/dev/ttyAMA2';
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
//setTimeout(async () => {
  //  let ports = await serial.list();
    //console.log(ports);
//},0)
/*for(let i=0; i<10;i++){
let buff= Buffer.alloc(16,3);

sp1.write(buff.write(3));
}*/
//sp.write("gariyasi");
/*sp.on('open',()=>{
console.log('port open');
});*/
/*sp.open(()=>{
console.log("open");

}*/
//sp1.on('data',console.log);
//sp.write("hello");

sp1.on('data',(data)=>{
console.log({data})
const val= JSON.stringify(data);
const  val1=(JSON.parse( val));
console.log({val1});
const val2=[];
val1.data.forEach(item=>{
  val2.push(item.toString(16))
});
//const send= String.fromCharCode(val1.data[5]);
const send= val1.data[5].toString();
const finaldata= send +"\r"+"\n";
sp.write(send);
sp.write("\r\n");

//sp.write("\r\n");
//rx=send.toString();
// sp1.write(send);
//console.log({val2});
const macid= val2.slice(0,5);
const boxid=val1.data.slice(5,14);
const acctualdata= val2.slice(14,32);
//console.log(String.fromCharCode(val1.data[13]));
const val3= val1.data.slice(13,31);
let  str="",str1="";
let id1=""
boxid.forEach(item=>{
const id= item.toString(16);
id1=id1 + id;
});
id1=+id1;
val3.map(item=>{str=str +(String.fromCharCode(item))});
console.log(str,id1);
//console.log({macid,boxid,acctualdata});
//val1.data.forEach(item=>{
  //console.log(String.fromCharCode(item));
//  console.log(item);
//});
});



const port1 = 3000;

/*axios.post("https://rtcbackend.gariyasi.org", {
    "id": "pragati"
}).then(res => {
    console.log(res.data)
})*/

app.listen(port1, () => {
    console.log(`Server is running on port ${port1}`)
})


