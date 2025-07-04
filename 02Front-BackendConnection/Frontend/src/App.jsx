import { useState,useEffect } from 'react'
import axios from 'axios'

function App() {
  const [jokes, setJokes] = useState([])
  useEffect(()=>{
    axios.get('/api/jokes')
    .then((res)=>{
      setJokes(res.data)
    }).catch((err)=>{
      console.log(err);      
    })
  }, [])
  return (
    <>
      <h1>Hello Developers!!!</h1>
      <h2>JOKES:{jokes.length}</h2>

      {
        jokes.map((jokes)=>(
          <div key={jokes.id}>
            <h3>{jokes.title}</h3>
            <p>{jokes.Content}</p>
          </div>
        ))
      }
    </>
  )
}
export default App