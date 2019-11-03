require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./moviedex.json')

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

// const validGenres = [`adventure`, `comedy`, `drama`, `thriller`, `documentary`, `crime`, `spy`, `romantic`, `animation`, `western`, `biography`, `musical`, `history`, `war`]

app.use(function validateBearerToken(req,res,next){
    const apiToken = process.env.API_TOKEN
    console.log(apiToken)
    const authToken = req.get('Authorization')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: "Unauthorized request" })
    }
    next()
})

app.get('/movie', function handleGetMovie(req, res){
    let response=MOVIES;
    
    if(req.query.genre) {
        response= response.filter(movie=>
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }
    if (req.query.country){
        response = response.filter(movie =>
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())
            )
    }
    if(req.query.avg_vote){
        response = response.filter(movie=>
            Number(movie.avg_vote)>= Number(req.query.avg_vote))
    }
    res.json(response)
})



// app.get('/movies', function handleGetMovies(req, res) {
// let response = MOVIEDEX.movies;
// if (req.query.film_title) {
//     response = response.filter(movies =>
//       // case insensitive searching
//       movies.film_title.toLowerCase().includes(req.query.film_title.toLowerCase())
//     )
//   }

//   if (req.query.genre) {
//     response = response.filter(movies =>
//       movies.genre.includes(req.query.genre)
//     )
//   }


//   // filter our pokemon by type if type query param is present
  

//   res.json(response)
// })


const PORT = 9000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})