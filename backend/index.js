const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = express.Router()

const app = express()
const port = 8080
require('express-ws')(app);

const messages = ['first', 'second', 'third']

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions))
app.disable('etag')

router.get('/messages', (req, res) => {
    res.send(messages)
})

router.ws('/msg', function(ws, req) {
  ws.on('message', function(msg) {
        const parsed = JSON.parse(msg)
        console.log(parsed)
        messages.push(parsed.message)
        ws.send(JSON.stringify({ message: 'success' }))
    });
});

app.use('/', router)
app.use("/ws-stuff", router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})