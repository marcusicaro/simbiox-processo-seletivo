const API_KEY = 'api_key=b0ff0a64099e470410a2faf2a068f56a';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?' + API_KEY + '&query=';
const main = document.getElementById('main');
const form = document.getElementById('form');
const searchBar = document.getElementById('search');
const logo = document.getElementById('logo');

// get movies info from TMDB url
function getMovies(url) {
    fetch(url).then(response => response.json()).then(data => {
        console.log(data.results);
        displayMovies(data.results);
    });
};

// display movies from list
function displayMovies (data){
    main.innerHTML = '';
    data.forEach(movie => {
        const {title, poster_path, vote_average, overview, id} = movie;
        const movieCard = document.createElement('div');
        movieCard.classList = 'movie-card';
        movieCard.innerHTML = `
        <img src="${IMG_URL + poster_path}" alt="${title}" srcset="">
        
        <div class="movie-info"></div>
      
        <div class="movie-info">
          <h3>${title}</h3>
          <span class="${getScoreColor(vote_average)}">${vote_average}</span>
        </div>

        <div class="movie-id">
        <p>ID: ${id}</p>
        </div>
        `
        main.appendChild(movieCard);
        
        // return a page containing only the clicked movie
        movieCard.addEventListener('click', (e) => {
            e.preventDefault();
            main.innerHTML = '';
            movieCard.innerHTML = `
            <img src="${IMG_URL + poster_path}" alt="${title}" srcset="">
            
            <div class="movie-info"></div>
          
            <div class="movie-info">
              <h3>${title}</h3>
              <span class="${getScoreColor(vote_average)}">${vote_average}</span>
            </div>
    
            <div class="overview">
              <p>${overview}</p>
            </div>
    
            <div class="movie-id">
            <p>ID: ${id}</p>
            </div>
            `
            main.appendChild(movieCard);
        });
    })
};

// change the color of the score text of each movie
function getScoreColor(score) {
    if (score > 8) {
        return 'green';
    } else if (score < 8 && score > 6) {
        return 'orange';
    } 
    return 'red';
};

// search based on movies titles
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const searchTerm = search.value;

    if(searchTerm){
        return getMovies(searchURL + searchTerm);
    } getMovies(API_URL);
});

// return to the homepage
logo.addEventListener('click', () => {
    getMovies(API_URL);
});

getMovies(API_URL);