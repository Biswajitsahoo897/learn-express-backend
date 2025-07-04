import express from 'express'

const app=express()

app.get('/api/jokes',(req,res)=>{
    const jokes=[
        {
            id:1,
            title:'A Joke',
            Content:'this is the joke 1'
        },
        {
            id:2,
            title:'A Joke',
            Content:'this is the joke 2'
        },
        {
            id:3,
            title:'A Joke',
            Content:'this is the joke 3'
        },
        {
            id:4,
            title:'A Joke',
            Content:'this is the joke 4'
        },
        {
            id:5,
            title:'A Joke',
            Content:'this is the joke 5'
        }
    ]
    res.send(jokes);
});


const port=process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`serve at htttps://localhost:${port}`);    
})

