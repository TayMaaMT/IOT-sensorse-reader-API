const exprss = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require("./db");


require('dotenv').config();
const app = exprss();

app.use(cors({
    credentials: true
}))

const creat = async(table, data) => {
    try {
        const colval = Object.keys(data).map(function(key) {
            return data[key];
        });
        const QueryUser = CreatQuery(table, data);
        const { rows } = await db.query(`${QueryUser}`, colval);
        return rows[0].id;
    } catch (err) {
        console.log(err);
        throw err.detail;
    }
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Wellcom to IOT API .... ');
});
app.get('/write',async (req, res) => {
    try{
        const { heart_beats , temperature , longitude , latitude  } = req.query;
        console.log(heart_beats , temperature , longitude , latitude );
        const date = new Date();
        console.log(date)
        await db.query(`INSERT INTO IOT_DATA(heart_beats, temperature, longitude,latitude,date)
        VALUES ($1, $2, $3,$4,$5)`,[heart_beats, temperature, longitude,latitude, date]);
        res.status(200).send("OK");
    }catch(err){
        console.log(err)
    }
   
});
app.get('/read', async(req, res) => {
    const data =await db.query(`Select * from IOT_DATA ORDER BY date ASC`);
    console.log(data);
    res.send(data.rows);
});
app.get('/readLast', async(req, res) => {
    const data =await db.query(`Select * from IOT_DATA ORDER BY date DESC LIMIT 1`);
    console.log(data);
    res.send(data.rows[0]);
});
const port = process.env.PORT || 3000;
app.listen(port, () => {

    console.log("your server is running on port " + port);
})