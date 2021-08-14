const elMovieList = selectElement(".movies__list");
const elMovieTemplate = selectElement(".movie__template").content;

// // modal
const elModalInfo = selectElement(".modal");
const elModalImg = selectElement(".modal__img");
const elModalHeading = selectElement(".modal__heading");
const elModalTime = selectElement(".modal__time");
const elModalType = selectElement(".modal__type");
const elModalImdb = selectElement(".modal__imdb");
const elModalCloseBtn = selectElement(".modal__close-btn");

elModalInfo.addEventListener("click", (evt) => {
  if (evt.target.dataset.modalOrigin === "1") {
    elModalInfo.classList.remove("modal--active");
  }
});

elModalCloseBtn.addEventListener("click", (evt) => {
  elModalInfo.classList.remove("modal--active");
});

// // Form elements
const elForm = selectElement(".movies__form");
const elMoviesInput = selectElement(".movies__form__input", elForm);
const elSelectGenres = selectElement(".movies__form__select", elForm);

const elNextBtn = selectElement(".next-btn", elForm);
const elPreBtn = selectElement(".pre-btn", elForm);

// form submit
elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  async function fetchFilms() {
    const APIKey = "2b278381";
    const APISearch = elMoviesInput.value;
    let APIPage = 1;
    const response = await fetch(
      "http://www.omdbapi.com/?apikey=" +
        APIKey +
        "&s=" +
        APISearch +
        "&page=" +
        APIPage
    );

    const data = await response.json();
    const filmArr = data.Search;

    console.log(data);
    const moviesInput = elMoviesInput.value.trim();
    const regex = new RegExp(moviesInput, "gi");
    const searchedFilms = filmArr.filter((film) => film.Title.match(regex));

    filmRender(searchedFilms, elMovieList);
  }

  fetchFilms();
});

// // Rendering films
function filmRender(filmArr, element) {
  element.innerHTML = null;
  filmArr.forEach((film) => {
    const movieTemplate = elMovieTemplate.cloneNode(true);

    selectElement(".movies__img", movieTemplate).setAttribute(
      "src",
      film.Poster
    );
    selectElement(".movies__img", movieTemplate).setAttribute(
      "alt",
      film.Title
    );

    selectElement(".movies__heading", movieTemplate).textContent = film.Title;

    const elMoreBtn = selectElement(".movies__more-btn", movieTemplate);
    elMoreBtn.dataset.film_id = film.imdbID;
    elMoreBtn.addEventListener("click", (evt) => {
      elModalInfo.classList.add("modal--active");
      const filmId = evt.target.dataset.film_id;
      const foundFilms = filmArr.find((item) => item.imdbID === filmId);

      elModalImg.setAttribute("src", foundFilms.Poster);
      elModalHeading.textContent = foundFilms.Title;
      elModalTime.textContent = "Year: " + foundFilms.Year;
      elModalType.textContent = "Type: " + foundFilms.Type.toUpperCase();
      elModalImdb.textContent = "IMDB: " + foundFilms.imdbID;
    });

    element.appendChild(movieTemplate);
  });
}
