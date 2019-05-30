const fs = require("fs")
const lines = fs.readFileSync("./running-around.log").toString('utf-8').split('\n')

const events = lines.map(JSON.parse).filter(event => event.type === "AXL" || event.type === "GYRO")

let last = null
const combined = events.filter(event => event.type === "AXL").map(axl => {
  const gyro = events.find(event => event.type === "GYRO" && Math.abs(event.time - axl.time) <= 30)

  const delta = last !== null ? axl.time - last : 0
  last = axl.time

  if (gyro) {
    return `${axl.time},${delta},${axl.value.x},${axl.value.y},${axl.value.z},${gyro.value.x},${gyro.value.y},${gyro.value.z}`
  }
}).filter(event => event !== undefined)

const content = combined.join('\n')

fs.writeFileSync("./axl_gyro.csv", content)