export const fetchCountries = name => {
  return fetch(`https://restcountries.com/v2/name/${name}`)
    .then(x => x.json())
    .then(data => {
      console.log(data);
    });
};
