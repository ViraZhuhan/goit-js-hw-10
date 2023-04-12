import './css/styles.css';
import API from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import getRefs from './get-refs';

const refs = getRefs();
const DEBOUNCE_DELAY = 300;
let name = '';

refs.inputEl.addEventListener(
  'input',
  debounce(onInputCountries, DEBOUNCE_DELAY)
);

function onInputCountries(e) {
  e.preventDefault();

  name = e.target.value.trim();

  if (!name) {
    clearTemplate();
    return;
  }

  API.fetchCountries(name)
    .then(data => {
      if (data.length > 10) {
        specificNameError();
        clearTemplate();
        return;
      } else {
        makeCountriesGallery(data);
      }
    })
    .catch(error => {
      onFetchError();
      clearTemplate();
    });
}

function makeCountriesGallery(data) {
  if (data.length) {
    if (data.length === 1) {
      return (refs.countryInfo.innerHTML = markup(data));
    } else {
      return (refs.countryInfo.innerHTML = listMarkup(data));
    }
  }
}

function listMarkup(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<div class="countries">
        <img src="${flags.png}" alt="${name.official}" width="50" height="30">
        <h2>${name.official}</h2>
        </div>`
    )
    .join('');
}

function markup(data) {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<div class="country">
        <img src="${flags.png}" alt="${flags.alt}" width="200" height="100">
        <h1>${name.official}</h1>
        <p><b>Capital:</b> ${capital}</p>
        <p><b>Population:</b> ${population}</p>
        <p><b>Languages:</b> ${Object.values(languages)}</p>
        </div>`
  );
}

function clearTemplate() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function onFetchError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function specificNameError() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
