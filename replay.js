const LineByLineReader = require('line-by-line')
const net = require('net')


let sockets = []
const server = net.createServer(socket => {
  sockets.push(socket)

  socket.on('close', () => {
    console.log('socket is closed')
    sockets = sockets.filter(s => s !== socket)
  })
})
server.listen(5000, '0.0.0.0')

const sendEvent = (socket, event) => {
  try {
      socket.write(event + '\n')
  } catch (e) { }
}

const readFile = () => {
  const lr = new LineByLineReader('standing-still.log')

  let prev = null

  lr.on('line', line => {
    lr.pause()

    console.log(line)
    sockets.forEach(socket => sendEvent(socket, line))
    const json = JSON.parse(line)

    const timeout = prev ? json.time - JSON.parse(prev).time : 0

    console.log(timeout)

    setTimeout(() => {
      lr.resume()
    }, timeout)

    prev = line
  })

  lr.on('end', function () {
  	readFile()
  });
}

readFile()
