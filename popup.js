// Get your free API key from https://www.exchangerate-api.com/
const API_KEY = '16226b13a1688582975a9ceb';
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

document.addEventListener('DOMContentLoaded', () => {
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    const amountInput = document.getElementById('amount');
    const convertButton = document.getElementById('convertButton');
    const resultDiv = document.getElementById('result');

    let exchangeRates = {};

    // Fetch exchange rates from the API
    async function fetchExchangeRates() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            if (data.result === 'success') {
                exchangeRates = data.conversion_rates;
                populateCurrencies();
            } else {
                resultDiv.textContent = 'Error fetching rates.';
            }
        } catch (error) {
            resultDiv.textContent = 'Network error. Please check your connection.';
            console.error(error);
        }
    }

    // Populate the dropdown menus with currency options
    function populateCurrencies() {
        const currencies = Object.keys(exchangeRates).sort();
        currencies.forEach(currency => {
            const option1 = document.createElement('option');
            option1.value = currency;
            option1.textContent = currency;
            fromCurrencySelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = currency;
            option2.textContent = currency;
            toCurrencySelect.appendChild(option2);
        });
        // Set default values
        fromCurrencySelect.value = 'USD';
        toCurrencySelect.value = 'EUR';
    }

    // Perform the currency conversion
    function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        if (isNaN(amount) || amount <= 0) {
            resultDiv.textContent = 'Please enter a valid amount.';
            return;
        }

        if (exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
            // Convert to base currency (USD) first, then to the target currency
            const usdAmount = amount / exchangeRates[fromCurrency];
            const convertedAmount = usdAmount * exchangeRates[toCurrency];
            resultDiv.textContent = convertedAmount.toFixed(2);
        } else {
            resultDiv.textContent = 'Invalid currency selection.';
        }
    }

    convertButton.addEventListener('click', convertCurrency);

    // Initial fetch of currency data
    fetchExchangeRates();
});