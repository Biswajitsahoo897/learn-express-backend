require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const githubdata=
    {
    "login": "Biswajitsahoo897",
    "id": 179953022,
    "node_id": "U_kgDOCrndfg",
    "avatar_url": "https://avatars.githubusercontent.com/u/179953022?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/Biswajitsahoo897",
    "html_url": "https://github.com/Biswajitsahoo897",
    "followers_url": "https://api.github.com/users/Biswajitsahoo897/followers",
    "following_url": "https://api.github.com/users/Biswajitsahoo897/following{/other_user}",
    "gists_url": "https://api.github.com/users/Biswajitsahoo897/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/Biswajitsahoo897/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/Biswajitsahoo897/subscriptions",
    "organizations_url": "https://api.github.com/users/Biswajitsahoo897/orgs",
    "repos_url": "https://api.github.com/users/Biswajitsahoo897/repos",
    "events_url": "https://api.github.com/users/Biswajitsahoo897/events{/privacy}",
    "received_events_url": "https://api.github.com/users/Biswajitsahoo897/received_events",
    "type": "User",
    "user_view_type": "public",
    "site_admin": false,
    "name": "Biswajit sahoo",
    "company": null,
    "blog": "",
    "location": "Bhubaneswar,Odisha,India",
    "email": null,
    "hireable": null,
    "bio": "👋 Hi, I'm Biswajit Sahoo!\r\n💻 B.tech(CSE)\r\n📫 Let's connect:www.linkedin.com/in/biswajit-sahoo-b378242b1",
    "twitter_username": "Biswajit5574160",
    "public_repos": 9,
    "public_gists": 0,
    "followers": 10,
    "following": 16,
    "created_at": "2024-08-30T16:06:15Z",
    "updated_at": "2025-06-15T12:34:13Z"
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/login',(req,res)=>{
    res.send('<h1>Please login</h1>')
})
// hot reloading , so need to restart the server then again run it\


app.get('/youtube',(res,req)=>{
    res.send('<h1>Hello Youtube ,welcome to my youtube channel</h1>')
})
app.get('/github',(res,req)=>{
    res.json(githubdata)
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${port}`)
})

