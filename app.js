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
/*
axios.get(`https://api.mavenlink.com/api/v1/time_entries.json`, config_get)
    .then(function (res) {
        let responseBody = res.data;
        console.log(`### RESPONSE FROM THE PROMISE`)
        console.log(`Response status: ${res.status} ${res.statusText}`)
        console.log(`Number of returned time entries: ${responseBody.count}`);
        //console.log(responseBody.results);
        console.log(responseBody.meta);
    }).catch(e => {
        console.log(`There has been a problem: ${e}`);
    });
*/

let fullTeamEMEA = [
    "jason.gsell@optimizely.com",
    "david.sertillange@optimizely.com",
    "hiltsje.smilde@optimizely.com",
    "jil.maassen@optimizely.com",
    "isabel.meijaard@optimizely.com",
    "liam.miner@optimizely.com",
    "lisa.pourier@optimizely.com"
]

// Fetch entries from ML
// Creates array of arrays with email addresses of ppl who didn't log any time where each nested array refers to a single day
async function fetchTimeEntries() {
    // set generic filters
    let includeParam = 'include=user';
    let paginationParam = `per_page=200`

    // define team members

    let thuSlackers = [];
    let wedSlackers = [];
    let tueSlackers = [];
    let monSlackers = [];

    let weeklySlackers = [
        thuSlackers,
        wedSlackers,
        tueSlackers,
        monSlackers
    ];

    /* 
      - get today's date + four preceding days
      - check entries for each of the days separately
      - log the returned values in the console
    */
    for (i=0; i<4; i++) {
        let day_raw = new Date();
        day_raw.setDate(day_raw.getDate() - i);
        let export_date_formatted = day_raw.toISOString().split('T')[0];
        
        let actionPerformedFilter = `date_performed_between=${export_date_formatted}:${export_date_formatted}`
        let responseFull = await axios.get(`https://api.mavenlink.com/api/v1/time_entries.json?${includeParam}&${paginationParam}&${actionPerformedFilter}`, config_get);
        let responseBody = responseFull.data;

        // console.log(`### RESPONSE FROM THE AYNC-AWAIT`)

        /* 
        Printing out different pieces of the response - helps to get sense of what data is available 
        and what's their structure. (At the same time, this is probably easier done in Postman.)
        */
        // console.log(`Response status: ${responseFull.status} ${responseFull.statusText}`);
        // console.log(`Number of returned time entries: ${responseBody.count}`);
        // console.log(responseBody.results);
        // console.log(responseBody.time_entries);
        // console.log(responseBody.users);
        // console.log(responseBody.meta);

        // Create array with users who added an entry yesterday (the date is controlled by request parameters)
        const userObjectValues = Object.values(responseBody.users)
        let usersWithEntry = [];
        userObjectValues.forEach((user) => {
            let userObject = {
                'name': user.full_name,
                'email': user.email_address
            };
            usersWithEntry.push(userObject);
        });
        // console.log(`### PRINTING USERS WHOS TIME ENTRY HAS TIMESTAMP: ${export_date_formatted}`);
        // console.log(usersWithEntry);
        let usersWithEntryEmailsOnly = usersWithEntry.map(user => user.email);

        // filtering users who didn't submit anything for given day
        // console.log(`### SLACKERS FOR THE DAY ${export_date_formatted} BELOW`);

        let noSubmissionOnTheDayEmailOnly = fullTeamEMEA.filter((e) => {
            return !usersWithEntryEmailsOnly.includes(e)
        });

        switch(i) {
            case 0:
                noSubmissionOnTheDayEmailOnly.forEach((email) => {
                    thuSlackers.push(email);
                });
                break
            case 1:
                noSubmissionOnTheDayEmailOnly.forEach((email) => {
                    wedSlackers.push(email);
                });
                break
            case 2:
                noSubmissionOnTheDayEmailOnly.forEach((email) => {
                    tueSlackers.push(email);
                });
                break
            case 3:
                noSubmissionOnTheDayEmailOnly.forEach((email) => {
                    monSlackers.push(email);
                });
                break
        }
    }
    // console.log(weeklySlackers);
    return weeklySlackers
}

// Create an array of 'slacker' objects icluding user/slacker name, email, and array of slacked days
// Function expects array of arrays as input
let createSlackerObjects = (arg) => {
    pplWhoSlackedEmails = [...new Set(arg.flat(1))];
    pplWhoSlackedObjects = [];
    pplWhoSlackedEmails.forEach(weeklySlackerEmail => {
        let firstName = weeklySlackerEmail.split('.')[0];
        let firstNameCap = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        
        slackerObject = {
            email: weeklySlackerEmail,
            firstName: firstNameCap,
            daysSlacked: []
        };

        for (i=0; i<arg.length; i++) {
            let day = '';
            switch(i) {
                case 0:
                    day = 'Thursday'
                    break
                case 1:
                    day = 'Wednesday'
                    break
                case 2:
                    day = 'Tuesday'
                    break
                case 3:
                    day = 'Monday'
                    break
            }
            let dailySlackers = arg[i];
            if (dailySlackers.includes(weeklySlackerEmail)) {
                slackerObject.daysSlacked.push(day);
            }
            slackerObject.daysSlacked.reverse();
        }
        pplWhoSlackedObjects.push(slackerObject);
    });
    // console.log(pplWhoSlackedObjects);
    return pplWhoSlackedObjects
}

// Call the two functions above, in order
fetchTimeEntries()
    .then( result => createSlackerObjects(result) )
    .catch(e => {
        console.log(`There has been a problem fetching data from ML: ${e}`);
    });