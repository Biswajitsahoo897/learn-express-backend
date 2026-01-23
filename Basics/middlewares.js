const express = require("express")

const app = express();


// without using the middleware
//----------------------------------------------------------------------
// app.get('/health-checkup', (req, res) => {
//     const username = req.headers.username;
//     const password = req.headers.password;
//     const kidneyId = req.query.kidneyId;

//     if (username != "biswajit" || password != "pass") {
//         res.status(400).json({
//             msg: "Somthing up with your inputs"
//         })
//         return;
//     }
//     if (kidneyId != 1 && kidneyId != 2) {

//         res.status(400).json({
//             msg: "Somthing up with your inputs"
//         })
//         return;
//     }
//     res.json({
//         msg: "Your kidney is fine!!"
//     })
// });

//----------------------------------------------------------------------
// using the middlewares
function userMiddleware(req, res, next) {
    const username = req.headers.username;
    const password = req.headers.password;

    if (username != "biswajit" || password != "pass") {
        res.status(403).json({
            msg: "Incorrect inputs 1",
        });
    } else {
        next();
    }
};

// counting every request
let count=0;
function countRequest(req,res,next){
    count+=1;
    req.requestCount=count;
    next();
}

// average time taken to respond 
app.use((req, res, next) => {
    const startTime = Date.now();   

    res.on("finish", () => {
        const endTime = Date.now(); 
        const timeTaken = endTime - startTime;

        console.log("Request took:", timeTaken, "ms");
    });

    next();
});


function kidneyMiddleware(req, res, next) {
    const kidneyId = req.query.kidneyId;

    if (kidneyId != 1 && kidneyId != 2) {
        res.status(403).json({
            msg: "Incorrect inputs (kidneyMiddleware)",
        });
    } else {
        next();
    }
};

app.get("/health-checkup",countRequest, userMiddleware, kidneyMiddleware, function (req, res) {
    // do something with kidney her

    res.json({
        msg:"Your heart is healthy",
        totalRequest:req.requestCount
    })
});


app.get("/kidney-check", userMiddleware, kidneyMiddleware, function (req, res) {
    // do something with kidney here

    res.send("Your heart is healthy");
});

app.get("/heart-check", userMiddleware, function (req, res) {
    // do something with user here

    res.send("Your heart is healthy");
});



app.listen(3001, () => {
    console.log('Server is listening on port 3001');
});