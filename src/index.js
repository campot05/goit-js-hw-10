import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

const clearItem = item => (item.innerHTML = '');

input.addEventListener('input', Debounce(findCountries, DEBOUNCE_DELAY));

function findCountries() {
  const value = input.value.trim();
  if (!value) {
    clearItem(listEl);
    clearItem(infoEl);
    return;
  }

  fetchCountries(value)
    .then(data => {
      if (data.length > 10) {
        clearItem(listEl);
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      markupRender(data);
    })
    .catch(err => {
      Notify.failure('Oops, there is no country with that name');
      return;
    });
}

function markupRender(data) {
  if (data.length === 1) {
    clearItem(listEl);
    clearItem(infoEl);
    const item = createItem(data);
    infoEl.insertAdjacentHTML('beforeend', item);
  } else {
    clearItem(listEl);
    clearItem(infoEl);
    const list = createList(data);
    listEl.insertAdjacentHTML('beforeend', list);
  }
}

function createItem(data) {
  return data.map(({ name, capital, population, flags, languages }) => {
    return `<h1 class='country-info__title'><img src="${flags.svg}" alt="${
      name.official
    }" width='50' heigth='50' > ${name.common}</h1>
		<p class='country-info__name'>Capital: <span>${capital[0]}</span></p>
		<p class='country-info__name'>Population: <span>${population}</span></p>
		<p class='country-info__name'>Languages: 	<span>${Object.values(
      languages
    )}</span></p>`;
  });
}

function createList(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<li class='country-list__item'><img src="${flags.png}" alt="${name.common}" width='45'>${name.common}</li>`
    )
    .join('');
}


