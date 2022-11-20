const API_KEY = 'api_key=b0ff0a64099e470410a2faf2a068f56a';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?' + API_KEY + '&query=';

const main = document.getElementById('main');
const form = document.getElementById('form');
const searchBar = document.getElementById('search');
const logo = document.getElementById('logo');

const previous = document.getElementById('previous');
const current = document.getElementById('current');
const next = document.getElementById('next');
const pagination = document.querySelector('.pagination');

var currentPage = 0;
var nextPage = 0;
var previousPage = 0;
var lastUrl = '';
var totalPages = 0;

// get movies info from TMDB url
function getMovies(url) {
    lastUrl = url;
    fetch(url).then(response => response.json()).then(data => {
        displayMovies(data.results);
        currentPage = data.page;
        nextPage = data.page + 1;
        previousPage = data.page - 1;
        totalPages = data.total_pages;
        current.innerText = currentPage;
        if(currentPage <= 1) {
            previous.classList.add('disabled');
            next.classList.remove('disabled');
        } else if(currentPage >= totalPages) {
            previous.classList.remove('disabled');
            next.classList.add('disabled');
        } else {
            previous.classList.remove('disabled');
            next.classList.remove('disabled');
        }
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
            pagination.classList.add('hide');
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
            return main.appendChild(movieCard);
        });
    })
};

// change the color of the score text of each movie
function getScoreColor(score) {
    if (score > 7.5) {
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
    pageCall(currentPage);
    pagination.classList.remove('hide');
});


function pageCall(page){
    let urlSplit = lastUrl.split('?');
    let queryParameters = urlSplit[1].split('&');
    let queryParametersSplit = queryParameters[queryParameters.length - 1].split('=');
    // checks if it's a single page 
    if(queryParametersSplit[0] != 'page') {
        let url = lastUrl + '&page=' + page;
        getMovies(url);
    // keeps going after 'page' becomes current page
    } else {
        queryParametersSplit[1] = page.toString();
        let joinSplitQueryParameters = queryParametersSplit.join('=');
        queryParameters[queryParameters.length - 1] = joinSplitQueryParameters;
        let joinQueryParameters = queryParameters.join('&');
        let url = urlSplit[0] + '?' + joinQueryParameters;
        getMovies(url);
    }
};

next.addEventListener('click', () => {
    if(nextPage <= totalPages){
        pageCall(nextPage);
    }
});

previous.addEventListener('click', () => {
    if(previousPage > 0){
        pageCall(previousPage);
    }
});

getMovies(API_URL);