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
// axios.get(`https://api.mavenlink.com/api/v1/time_entries.json`, config_get)
//     .then(function (res) {
//         let responseBody = res.data;
//         console.log(`### RESPONSE FROM THE PROMISE`)
//         console.log(`Response status: ${res.status} ${res.statusText}`)
//         console.log(`Number of returned time entries: ${responseBody.count}`);
//         console.log(responseBody.results);
//         console.log(responseBody.meta);
//     }).catch(e => {
//         console.log(`There has been a problem: ${e}`);
//     });

// Talking to the API using async-await function
async function fetchTimeEntries() {
    // getting current date/time
    let today = new Date();
    let year = today.getFullYear();
    let month = ('0' + today.getMonth()).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
    let fullDateYesterday = `${year}-${month}-${day - 1}`
    let dayStart = 'T000000';
    let dayEnd = 'T115959';
    let singleDayParam = `${fullDateYesterday}${dayStart}:${fullDateYesterday}${dayEnd}`;
    // console.log(singleDayParam);

    // set filter parameters
    let includeParam = 'include=user';
    let timeFilter = `created_at_between=${singleDayParam}`;

    let responseFull = await axios.get(`https://api.mavenlink.com/api/v1/time_entries.json?${includeParam}&${timeFilter}`, config_get);
    let responseBody = responseFull.data;

    console.log(`### RESPONSE FROM THE AYNC-AWAIT`)

    /* Printing out different pieces of the response - helps to get sense of what data is available 
       and what's their structure. (At the same time, this is probably easier done in Postman.)
    */
    console.log(`Response status: ${responseFull.status} ${responseFull.statusText}`);
    console.log(`Number of returned time entries: ${responseBody.count}`);
    console.log(responseBody.results);
    console.log(responseBody.time_entries);
    console.log(responseBody.users);
    console.log(responseBody.meta);

    // Create array with users who added an entry (yesterday)
    const userObjectValues = Object.values(responseBody.users)
    let userArray = [];
    userObjectValues.forEach((user) => {
        let userObject = {
            'name': user.full_name,
            'email': user.email_address
        };
        userArray.push(userObject);
    });
    console.log(`### PRINTING USERS WHO ENTERED TIME YESTERDAY`);
    console.log(userArray);
}

fetchTimeEntries()
    .catch(e => {
        console.log(`There has been a problem: ${e}`);
    });