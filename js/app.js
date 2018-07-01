//variable initialization
const apiUrl = 'https://free.currencyconverterapi.com';
const countries = '/api/v5/countries';
const convertUrl = `/api/v5/convert?q=`;

let dropdownCountryFrom = document.getElementById('from__country');
let dropdownCurrencyFrom = document.getElementById('from__currency');
let dropdownCountryTo = document.getElementById('to__country');
let dropdownCurrencyTo = document.getElementById('to__currency');
let from__amount = document.getElementById('from__amount');



if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function (registration) {
        console.log('ServiceWorker registration successful');
    }).catch(function (err) {
        console.log('ServiceWorker registration failed');
    });
} else {
    console.log('No service worker here');
}

//popuate dropdown with countries 
const url = `${apiUrl}${countries}`;
fetch(url)
    .then(
        function (response) {
            if (response.status !== 200) {
                console.warn('Something went wrong. Status Code: ' + response.status);
                return;
            }

            // Examine the text in the response  
            response.json().then(function (data) {
                const countries = data.results;
                for (var key in countries) {
                    if (countries.hasOwnProperty(key)) {
                        let k = countries[key];
                        populateCountries(k, dropdownCountryFrom);
                        populateCurrencies(k, dropdownCurrencyFrom);
                        populateCountries(k, dropdownCountryTo);
                        populateCurrencies(k, dropdownCurrencyTo);
                    }
                }

            });
        }).catch(function (err) {
            console.error('Fetch Error -', err);
        });

const populateCountries = (item, dd) => {
    let option;
    option = document.createElement("option");
    option.text = item.name;
    option.value = item.alpha3;
    dd.add(option);
};

const populateCurrencies = (item, dd) => {
    let curr;
    curr = document.createElement("option");
    curr.text = item.currencyName;
    curr.value = item.currencyId;
    dd.add(curr);
};

function convertCurrency() {
    const fromAmount = document.getElementById('from__amount').value;
    const fromCurrency = document.getElementById('from__currency').value;
    const toCurrency = document.getElementById('to__currency').value;
    const query = `${fromCurrency}_${toCurrency}`;
    const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=y&callback=?`;

    fetch(url)
        .then(function (response) {
            return response.text();
        })
        .then(function (responseText) {

            let data = responseText.toString();
            data = data.substr(data.lastIndexOf('('));
            data = data.replace('(', '').replace(')', '').replace(';', '');

            const jsonData = JSON.parse(data);

            try {
                const result = parseFloat(fromAmount) * jsonData[query].val;
                // document.getElementById('resultCurrency').innerHTML = parseFloat(result.toFixed(4));
                document.getElementById('to__amount').value = parseFloat(result.toFixed(4));
                console.log(parseFloat(result.toFixed(4)));
            } catch (e) {
                alert("Please enter a number in the Amount field.");
            }
        });

}

const changeValues = (ele, eleVal) => {
    fetch(url)
        .then(
            function (response) {
                response.json().then(function (data) {
                    const countries = data.results;
                    for (var key in countries) {
                        let k = countries[key];
                        if (eleVal == k.alpha3 && ele == "dropdownCountryFrom") {
                            dropdownCurrencyFrom.value = k.currencyId;
                        }
                        if (eleVal == k.alpha3 && ele == "dropdownCountryTo") {
                            dropdownCurrencyTo.value = k.currencyId;
                        }
                        if (eleVal == k.currencyId && ele == "dropdownCurrencyFrom") {
                            dropdownCountryFrom.value = k.alpha3;
                        }
                        if (eleVal == k.currencyId && ele == "dropdownCurrencyTo") {
                            dropdownCountryTo.value = k.alpha3;
                        }
                    }

                });
            }).catch(function (err) {
                console.error('Fetch Error -', err);
            });
};

dropdownCountryFrom.addEventListener('change', () => { changeValues("dropdownCountryFrom", dropdownCountryFrom.value); });
dropdownCountryTo.addEventListener('change', () => { changeValues("dropdownCountryTo", dropdownCountryTo.value); });
dropdownCurrencyFrom.addEventListener('change', () => { changeValues("dropdownCurrencyFrom", dropdownCurrencyFrom.value); });
dropdownCurrencyTo.addEventListener('change', () => { changeValues("dropdownCurrencyTo", dropdownCurrencyTo.value); });
from__amount.addEventListener('keyup',convertCurrency);