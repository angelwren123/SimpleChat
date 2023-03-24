import axios from "axios";
const sendSingleDeviceNotification = data => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    'key=AAAAgejrq98:APA91bG8iMG_xXdfecSWk_R58eMHHnVYrYgQM3nDXw6CJ2_B0nI-iUv1D7fNxYOsvOEYkCmRZs8gXYplSDPNMrGP8H_p_FTwQsmvUYQ5pNkqUmZrUpeiaG9WIXvyGFQ4fVPs7c9cqm-r',
  );

  var raw = JSON.stringify({
    data: {
      displayName: data?.displayName,
      photoURL: data?.photoURL,
      uid: data.uid,
      token: data?.token
    },
    notification: {
      body: data.body,
      title: data.title,
    },
    to: data.token,
    
  });
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  
  fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
};

const sendMultiDeviceNotification = data => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    'key=AAAAgejrq98:APA91bG8iMG_xXdfecSWk_R58eMHHnVYrYgQM3nDXw6CJ2_B0nI-iUv1D7fNxYOsvOEYkCmRZs8gXYplSDPNMrGP8H_p_FTwQsmvUYQ5pNkqUmZrUpeiaG9WIXvyGFQ4fVPs7c9cqm-r',
  );

  var raw = JSON.stringify({
    data: {},
    notification: {
      body: data.body,
      title: data.title,
    },
    registration_ids: data.token,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
};

export default {
  sendSingleDeviceNotification,
  sendMultiDeviceNotification,
};