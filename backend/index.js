const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = express.Router()

const app = express()
require('express-ws')(app);
const port = 8080

let messages = [{ id: 0, value: "Een chat app met websockets" }]

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
        const { action, id, value } = parsed
        console.log(parsed)

        switch (action) {
            case 'add':
                messages.push({ value, id })
                break;
            case 'delete':
                console.log('DELETE');
                messages = messages.filter((m) => m.id !== id)
                break;
            case 'edit':
                console.log('EDIT');
                console.log(id);
                const foundMessage = messages.find((m) => m.id === id)
                console.log(foundMessage)
                if (!foundMessage) return;
                foundMessage.value = value
                break;
            default:
                console.log('invalid type');
        }

        ws.send(JSON.stringify({ message: 'ready' }))
    });
});

app.use('/', router)
app.use("/ws-stuff", router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})