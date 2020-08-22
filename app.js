const axios = require('axios');

const OAuthToken = "680d29db876b116c77855e2defb074249efa3ecad04695c62af66ff9e31f7d3e"

const config_get = {
    headers: {
        'Authorization': `Bearer ${OAuthToken}`
    }
};

axios.get(`https://api.mavenlink.com/api/v1/time_entries.json`, config_get)
    .then(function (res) {
        let responseBody = res.data;
        console.log(responseBody);
    });

