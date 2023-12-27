const express = require('express');
const colors = require('colors');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
ATLAS_URI = process.env.MONGO_URI
const { MongoClient, ObjectId } = require("mongodb");
const { api } = require('./app.controller');
const multer = require('multer');
const connectionString = ATLAS_URI;
const client = new MongoClient(connectionString);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/var/www/html/files')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })
// middle wares
app.use(cors());
// app.use(express.json());
app.use(express.json({ limit: '50mb' }));

try {
    client.connect().then(database => {
        let db = database.db("bayla");
        global.db = db;
        console.log("mongo connected".bgGreen.white);
    }).catch(e => {
        console.log(e)
    });

} catch (e) {
    console.error(e);
}

app.post("/app", api);


app.post("/attachment", upload.single("file"), async (req, res) => {
    console.log("http://192.168.10.56/files/" + req.file.filename)
    return res.send({ filename: "http://192.168.10.56/files/" + req.file.filename });

});
//connection response
app.get('/', async (req, res) => {
    res.send('Bayla successfully runnning'.bgBlue.white);
});

app.listen(port, () => {
    console.log(`project running on ${port}`.bgYellow.white);
})