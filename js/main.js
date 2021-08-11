const elMovieList = selectElement(".movies__list");
const elMovieTemplate = selectElement(".movie__template").content;

// modal
const elModalInfo = selectElement(".modal");
const elModalImg = selectElement(".modal__img");
const elModalHeading = selectElement(".modal__heading");
const elModalDescription = selectElement(".modal__paragraph-description");
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

// Form elements
const elForm = selectElement(".movies__form");
const elMoviesInput = selectElement(".movies__form__input", elForm);
const elSelectGenres = selectElement(".movies__form__select", elForm);
const elSelectSort = selectElement(".sort-films", elForm);

// Rendering genres

function renderGenres(filmArr, element) {
  const result = [];
  filmArr.forEach((film) => {
    film.genres.forEach((genre) => {
      if (!result.includes(genre)) {
        result.push(genre);
      }
    });
  });

  result.forEach((genre) => {
    const newOption = createDOM("option");
    newOption.value = genre;
    newOption.textContent = genre;

    element.appendChild(newOption);
  });
}

renderGenres(films, elSelectGenres);

// rendering by genres

// Rendering films
function filmRender(filmArr, element) {
  element.innerHTML = null;
  filmArr.forEach((film) => {
    const movieTemplate = elMovieTemplate.cloneNode(true);

    selectElement(".movies__img", movieTemplate).setAttribute(
      "src",
      film.poster
    );
    selectElement(".movies__img", movieTemplate).setAttribute(
      "alt",
      film.title
    );

    selectElement(".movies__heading", movieTemplate).textContent = film.title;

    const elMoreBtn = selectElement(".movies__more-btn", movieTemplate);
    elMoreBtn.dataset.film_id = film.id;
    elMoreBtn.addEventListener("click", (evt) => {
      elModalInfo.classList.add("modal--active");
      const filmId = evt.target.dataset.film_id;
      const foundFilms = filmArr.find((item) => item.id === filmId);

      elModalImg.setAttribute("src", foundFilms.poster);
      elModalHeading.textContent = foundFilms.title;
      elModalDescription.textContent = foundFilms.overview;
      elModalTime.textContent = normalizeDate(foundFilms.release_date);

      elModalList.innerHTML = null;
      foundFilms.genres.forEach((genre) => {
        const newLi = createDOM("li");
        newLi.textContent = genre;
        elModalList.appendChild(newLi);
      });
    });

    element.appendChild(movieTemplate);
  });
}

filmRender(films, elMovieList);

function sortFilms(filmArr, format) {
  // const sortedAlph = filmArr.sort((a, b) => {
  //   if (a.title > b.title) {
  //     return 1;
  //   } else if (a.title < b.title) {
  //     return -1;
  //   } else {
  //     return 0;
  //   }
  // });

  const sortedDate = filmArr.sort((a, b) => a.release_date - b.release_date);

  //   if (format === "a_z") {
  //     return sortedAlph;
  //   } else if (format === "z_a") {
  //     return sortedAlph.reverse();
  //   } else if (format === "old_new") {
  //     return sortedDate;
  //   } else if (format === "new_old") {
  //     return sortedDate.reverse();
  //   }
  // }

  if (format === "a_z") {
    return filmArr.sort((a, b) => {
      if (a.title > b.title) {
        return 1;
      } else if (a.title < b.title) {
        return -1;
      } else {
        return 0;
      }
    });
  } else if (format === "z_a") {
    return filmArr.sort((a, b) => {
      if (a.title > b.title) {
        return -1;
      } else if (a.title < b.title) {
        return 1;
      } else {
        return 0;
      }
    });
  } else if (format === "old_new") {
    return sortedDate;
  } else if (format === "new_old") {
    return sortedDate.reverse();
  }
}

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const moviesInput = elMoviesInput.value.trim();
  const regex = new RegExp(moviesInput, "gi");
  const searchedFilms = films.filter((film) => film.title.match(regex));
  const selectGenre = elSelectGenres.value.trim();
  const selectSort = elSelectSort.value.trim();

  let genredFilms = [];

  if (selectGenre === "All") {
    genredFilms = searchedFilms;
  } else {
    genredFilms = searchedFilms.filter((film) =>
      film.genres.includes(selectGenre)
    );
  }

  const sortedFilms = sortFilms(genredFilms, selectSort);

  filmRender(sortedFilms, elMovieList);
});
