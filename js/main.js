const elMovieList = selectElement(".movies__list");
const elMovieTemplate = selectElement(".movie__template").content;

// // modal
const elModalInfo = selectElement(".modal");
const elModalImg = selectElement(".modal__img");
const elModalHeading = selectElement(".modal__heading");
const elModalTime = selectElement(".modal__time");
const elModalList = selectElement(".modal__genres-list");
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
const elSelectSort = selectElement(".sort-films", elForm);

// form submit
elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  async function fetchFilms() {
    const APIKey = "2b278381";
    const APISearch = elMoviesInput.value;
    const response = await fetch(
      "http://www.omdbapi.com/?apikey=" + APIKey + "&s=" + APISearch
    );

    const data = await response.json();
    const filmArr = data.Search;

    const moviesInput = elMoviesInput.value.trim();
    const regex = new RegExp(moviesInput, "gi");
    const searchedFilms = filmArr.filter((film) => film.Title.match(regex));

    filmRender(searchedFilms, elMovieList);
  }

  fetchFilms();
});

// Rendering genres

function renderGenres(filmArr, element) {
  const result = [];
  filmArr.forEach((film) => {
    if (!result.includes(film.Type)) {
      result.push(film.Type);
    }
  });

  // element.innerHTML = null;
  result.forEach((type) => {
    const newOption = createDOM("option");
    newOption.value = type;
    newOption.textContent = type;

    element.appendChild(newOption);
  });
}

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

      elModalList.innerHTML = null;
      const newLi = createDOM("li");
      newLi.classList.add("modal__genres-item");
      newLi.textContent = "Type: " + foundFilms.Type;
      elModalList.appendChild(newLi);
    });

    element.appendChild(movieTemplate);
  });
}

// renderGenres(searchedFilms, elSelectGenres);

// function sortFilms(filmArr, format) {
//   // const sortedAlph = filmArr.sort((a, b) => {
//   //   if (a.title > b.title) {
//   //     return 1;
//   //   } else if (a.title < b.title) {
//   //     return -1;
//   //   } else {
//   //     return 0;
//   //   }
//   // });

//   const sortedDate = filmArr.sort((a, b) => a.Year - b.Year);

//   //   if (format === "a_z") {
//   //     return sortedAlph;
//   //   } else if (format === "z_a") {
//   //     return sortedAlph.reverse();
//   //   } else if (format === "old_new") {
//   //     return sortedDate;
//   //   } else if (format === "new_old") {
//   //     return sortedDate.reverse();
//   //   }
//   // }

//   if (format === "a_z") {
//     return filmArr.sort((a, b) => {
//       if (a.Title > b.Title) {
//         return 1;
//       } else if (a.Title < b.Title) {
//         return -1;
//       } else {
//         return 0;
//       }
//     });
//   } else if (format === "z_a") {
//     return filmArr.sort((a, b) => {
//       if (a.Title > b.Title) {
//         return -1;
//       } else if (a.Title < b.Title) {
//         return 1;
//       } else {
//         return 0;
//       }
//     });
//   } else if (format === "old_new") {
//     return sortedDate;
//   } else if (format === "new_old") {
//     return sortedDate.reverse();
//   }
// }

// const selectGenre = elSelectGenres.value.trim();
//     const selectSort = elSelectSort.value.trim();

//     let genredFilms = [];

//     if (selectGenre === "All") {
//       genredFilms = searchedFilms;
//     } else {
//       genredFilms = searchedFilms.filter((film) =>
//         film.Type.includes(selectGenre)
//       );
//     }

// const sortedFilms = sortFilms(searchedFilms, selectSort);

// filmRender(filmArr, elMovieList);
