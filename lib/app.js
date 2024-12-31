const express = require("express")
const https = require("https")
const app = express()

app.get("/api/city-data", (req, res) => {
  https.get("http://api.geonames.org/", (proxyRes) => {
    let data = ""
    proxyRes.on("data", chunk => {
      data += chunk
    })
    proxyRes.on("end", () => {
      res.send(data)
    })
  }).on("error", (e) => {
    console.error(`Got error: ${e.message}`)
    res.status(500).send("Error fetching data")
  })
})

app.listen(3000, () => {
  console.log("Proxy server running on port 3000")
})
