const request = require('request');
require('dotenv').config();
const API_KEY = 'NmI1NjgwODEtYzA4Mi00ZWU0LWJiN2ItZGU5NDJmNTVlNDQy';
const ONESIGNAL_APP_ID = "45dfaeb6-0e9b-4e60-9323-10a0337a4734";
const BASE_URL = "https://onesignal.com/api/v1";

/**
 * OPTIONS BUILDER
 * @param {string} method
 * @param {string} path
 * @param {object} body
 * @returns {object} options
 */
export const optionsBuilder = (method, path, body) => {
    return {
        method,
        'url': `${BASE_URL}/${path}`,
        'headers': {
            'Content-Type': 'application/json',   
            'Authorization': `Basic ${API_KEY}`,
        },
        body: body ? JSON.stringify(body) : null,
    };
}

/**
 * CREATE A PUSH NOTIFICATION
 * method: POST
 * Postman: https://www.postman.com/onesignaldevs/workspace/onesignal-api/request/16845437-c4f3498f-fd80-4304-a6c1-a3234b923f2c
 * API Reference: https://documentation.onesignal.com/reference#create-notification
 * path: /notifications
 * @param {object} body
 */

export const createNotication = (body) => {
    const options = optionsBuilder("POST","notifications", body);
    request(options, (error, response) => {
        if (error) throw new Error(error);
        console.log(response.body);
        viewNotifcation(JSON.parse(response.body).id);
    });
}

/**
 * VIEW NOTIFICATION
 * method: GET
 * Postman: https://www.postman.com/onesignaldevs/workspace/onesignal-api/request/16845437-6c96ecf0-5882-4eac-a386-0d0cabc8ecd2
 * API Reference: https://documentation.onesignal.com/reference#view-notification
 * path: /notifications/{notification_id}?app_id=${ONE_SIGNAL_APP_ID}
 * @param {string} notificationId
 */
export const viewNotifcation = (notificationId) => {

    const path = `notifications/${notificationId}?app_id=${ONESIGNAL_APP_ID}`;
    const options = optionsBuilder("GET", path);
    request(options, (error, response)=> {
        if (error) throw new Error(error);
    });
}

/**
 * RUN THE NODE JS APP
 */
export const body = {
    app_id: ONESIGNAL_APP_ID,
    included_segments: ['Subscribed Users'],
    data: {
      foo: 'bar',
    },
    contents: {
      en: 'OK quoc dz',
    },
};

createNotication(body);