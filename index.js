const express = require('express');
const bodyParse = require('body-parser');
const fs = require('fs');
const { v4: uuidv4} = require('uuid');

const app = express();

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended:true}));

const path = './data/data.json';

const SaveData = (data) => {
    let stringify = JSON.stringify(data);
    fs.writeFileSync(path,stringify);
}

const GetData = () => {
    let json = fs.readFileSync(path);
    return JSON.parse(json)
}

app.get('/users',(req,res) => {
    fs.readFile(path, 'utf8', (err,data) => {
        if(err)
        {
            throw err
        }
        res.send(JSON.parse(data))
    })
})

app.post('/users', (req,res) => {
    let getData = GetData();
    const userId = uuidv4();

    getData[userId] = req.body;

    SaveData(getData);
    res.send({message:'POST Method Executed'})
});

app.put('/users/:id', (req, res) => {
    let getData = GetData();
    const userId = req.params.id;
    getData[userId] = req.body;
    SaveData(getData);
    res.send({message: 'PUT Method Executed'})
})

app.delete('/users/:id', (req,res) => {
    let getData = GetData();
    const userId = req.params.id;
    if(userId in getData) {
        delete getData[userId];
        SaveData(getData);
        res.send({message: 'DELETE Method Executed'})
    } else {
        res.send({message: "Invalid User ID"})
    }
    

})

app.listen(8080, () => {
    console.log("server start")
})