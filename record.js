const net = require('net')
const split = require('split')
const fs = require('fs')

const client = new net.Socket()

client.connect(5000, '192.168.0.105', () => {
  console.log('Connected')
})
/*
client.connect(5000, '127.0.0.1', () => {
  console.log('Connected')
})
*/
var fileStream = fs.createWriteStream("sample.log", { flags:'a' });

const stream = client.pipe(split())
stream.on('data', data => {
  console.log(data)
  fileStream.write(data + "\n");
})
