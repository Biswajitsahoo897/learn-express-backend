
const express = require('express');
const app = express();
const bodyParser=require('body-parser');
const fs=require('fs');

fs.readFile('testFile.txt','utf-8',function(err,data){
    
})
const port=3001;

app.use(bodyParser.json())


app.get('/cov', (req, res) => {
    console.log(req.body);
    res.send({
        msg:{
            "Biswa":90,
            "Mena":82
        }
    });
});

app.listen(port, () => {
    console.log('Server running on port 3001');
});
