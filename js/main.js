const elMovieList = selectElement(".movies__list");
const elBookmarkList = selectElement(".bookmark-list");
const elMovieTemplate = selectElement(".movie__template").content;
const elBookmarkTemplate = selectElement(".bookmark-template").content;

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
const elSelectType = selectElement(".movies__form__select", elForm);

const elNextBtn = selectElement(".next-btn", elForm);
const elPreBtn = selectElement(".pre-btn", elForm);

const APIKey = "2b278381";
let APISearch = "loki";
let APIPage = 1;
let APIType = "";

// async function
async function fetchFilms() {
  elMovieList.innerHTML = "<img src='./images/spinner.svg' alt='Spinner' />";
  const response = await fetch(
    "https://www.omdbapi.com/?apikey=" +
      APIKey +
      "&s=" +
      APISearch +
      "&type=" +
      APIType +
      "&page=" +
      APIPage
  );

  const data = await response.json();
  const filmArr = data.Search;

  if (filmArr.length) {
    filmRender(filmArr, elMovieList);
  }

  if (APIPage <= 1) {
    elPreBtn.disabled = true;
    elPreBtn.classList.add("disabled");
    elNextBtn.classList.remove("movies__btn");
  } else {
    elPreBtn.disabled = false;
    elPreBtn.classList.remove("disabled");
    elNextBtn.classList.add("movies__btn");
  }

  const lastPage = Math.ceil(data.totalResults / 10);

  if (APIPage == lastPage) {
    elNextBtn.disabled = true;
    elNextBtn.classList.add("disabled");
    elNextBtn.classList.remove("movies__btn");
  } else {
    elNextBtn.disabled = false;
    elNextBtn.classList.remove("disabled");
    elNextBtn.classList.add("movies__btn");
  }
}

// pagination function
elPreBtn.addEventListener("click", (evt) => {
  APIPage--;
  fetchFilms();
});

elNextBtn.addEventListener("click", (evt) => {
  APIPage++;
  fetchFilms();
});

// input change
elMoviesInput.addEventListener("change", (evt) => {
  const moviesInput = elMoviesInput.value.trim();
  if (moviesInput === "") {
    APISearch = "loki";
    fetchFilms();
  } else {
    APISearch = moviesInput;
    fetchFilms();
  }
});

// type select
elSelectType.addEventListener("change", (evt) => {
  const selectType = elSelectType.value.trim();
  if (selectType === "all") {
    APIType = "";
    fetchFilms();
  } else {
    APIType = selectType;
    fetchFilms();
  }
});

// Rendering films
function filmRender(filmArr, element) {
  element.innerHTML = null;

  const elFragment = document.createDocumentFragment();

  filmArr.forEach((film) => {
    const movieTemplate = elMovieTemplate.cloneNode(true);

    selectElement(".movies__img", movieTemplate).setAttribute(
      "src",
      film.Poster
    );

    selectElement(".movies__img", movieTemplate).setAttribute(
      "src",
      film.Poster
    );

    selectElement(".movies__img", movieTemplate).setAttribute(
      "alt",
      film.Title
    );

    selectElement(".movies__img", movieTemplate).onerror = (evt) => {
      evt.target.src = "./images/imovie.jpg";
    };
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

    const elBookmarBtn = selectElement(".movies__bookmark-btn", movieTemplate);
    elBookmarBtn.dataset.film_id = film.imdbID;

    elFragment.appendChild(movieTemplate);
  });
  element.appendChild(elFragment);

  // bookmark Arr
  let bookmarkArr = [];

  // bookmark
  elMovieList.addEventListener("click", (evt) => {
    if (evt.target.matches(".movies__bookmark-btn")) {
      const filmId = evt.target.dataset.film_id;
      const foundFilms = filmArr.find((film) => film.imdbID == filmId);

      let doesExist = false;

      bookmarkArr.forEach((row) => {
        if (row.imdbID == filmId) {
          doesExist = true;
        }
      });

      if (!doesExist) {
        bookmarkArr.push(foundFilms);
        renderBookmark(bookmarkArr, elBookmarkList);
      }
    }
  });
}

// render bookmarks

function renderBookmark(bookmarkArr, element) {
  element.innerHTML = null;

  const bookmarkFragment = document.createDocumentFragment();

  bookmarkArr.forEach((bookmark) => {
    const bookmarkTemplate = elBookmarkTemplate.cloneNode(true);

    const bookmarkDeleteBtn = selectElement(
      ".bookmark-delete-btn",
      bookmarkTemplate
    );

    selectElement(".bookmark-title", bookmarkTemplate).textContent =
      bookmark.Title;
    bookmarkDeleteBtn.dataset.film_id = bookmark.imdbID;
    bookmarkFragment.appendChild(bookmarkTemplate);
  });
  element.appendChild(bookmarkFragment);
}

elBookmarkList.addEventListener("click", (evt) => {
  if (evt.target.matches(".bookmark-delete-btn")) {
    evt.target.parentNode.remove();
  }
});

fetchFilms();

// slider
const slider = tns({
  container: ".slider-list",
  items: 1,
  slideBy: 1,
  swipeAngle: false,
  autoplay: true,
  mouseDrag: true,
  controls: false,
  nav: false,
  gutter: 20,
  autoplayButtonOutput: false,
  speed: 600,
  autoplayTimeout: 5000,
});
