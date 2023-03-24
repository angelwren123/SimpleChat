import axios from "axios";
const sendSingleDeviceNotification = data => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    'key=AAAACX7PrW4:APA91bFEQcVB4Znw4unjgJEOrSa2wMf8wnon2em7p3vrkJ8sWumxTHo-zi5mCSR7yIohmHJdoX5Wy6AC-eVfXfSZe-3YpY76t2KcjzYa8azMARxy0by4TM-vWUCnS_hOtOQDxo4wtrEg',
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
    'key=AAAACX7PrW4:APA91bFEQcVB4Znw4unjgJEOrSa2wMf8wnon2em7p3vrkJ8sWumxTHo-zi5mCSR7yIohmHJdoX5Wy6AC-eVfXfSZe-3YpY76t2KcjzYa8azMARxy0by4TM-vWUCnS_hOtOQDxo4wtrEg',
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