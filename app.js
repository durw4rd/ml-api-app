// Importing the axios package
const axios = require('axios');

// Setting request parameters (only authorization in this case)
const OAuthToken = "680d29db876b116c77855e2defb074249efa3ecad04695c62af66ff9e31f7d3e"
const config_get = {
    headers: {
        'Authorization': `Bearer ${OAuthToken}`
    }
};

// Talking to the API using the JS promise
axios.get(`https://api.mavenlink.com/api/v1/time_entries.json`, config_get)
    .then(function (res) {
        let responseBody = res.data;
        console.log(`### RESPONSE FROM THE PROMISE`)
        console.log(`Response status: ${res.status} ${res.statusText}`)
        console.log(`Number of returned time entries: ${responseBody.count}`);
        console.log(responseBody.results);
        console.log(responseBody.meta);
    }).catch(e => {
        console.log(`There has been a problem: ${e}`);
    });

// Talking to the API using async-await function
async function fetchTimeEntries() {
    let responseFull = await axios.get(`https://api.mavenlink.com/api/v1/time_entries.json`, config_get);
    let responseBody = responseFull.data;

    console.log(`### RESPONSE FROM THE AYNC-AWAIT`)
    console.log(`Response status: ${responseFull.status} ${responseFull.statusText}`);
    console.log(`Number of returned time entries: ${responseBody.count}`);
    console.log(responseBody.results);
    console.log(responseBody.meta);
}

fetchTimeEntries()
    .catch(e => {
        console.log(`There has been a problem: ${e}`);
    });