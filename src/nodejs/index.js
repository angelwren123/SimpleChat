var admin = require('firebase-admin')

var serviceAccount = require("./chatapp-e9a2d-firebase-adminsdk-b0ukj-34889a999d.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chatapp-e9a2d-default-rtdb.firebaseio.com"
});

const token = 'cCBdYjsgRZGyUj8V3oqzQp:APA91bH3NQoAekhLzw4IBCy_vwYbnJMUZaYC46cSUr4gdqCLo2EbQVy94gtyY0yZNClZSZjAlN1TxkrlPIJQXk9hgKm5k6TMv6JPH5u8P0jrJf_cQ2i_eZbf1hpgjmFg4TgibXw-nRnr'
   

    admin.messaging().send({
        token:token,
        data:{
            customData:"Quoc",
            id:'1',
            ad:'Quocdepzai',
            subTitle:'Quoc always so handsome.'
        },
        android:{
            notification:{
                body:'Message was sent from Nodejs',
                title:'Quoc always so handsome. <3',
                color:'#fff566',
                priority:'high',
                sound:'default',
                vibrateTimingsMillis:[200,500,800],
                imageUrl:'https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/312562537_1431751943897831_1267375779295937985_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=174925&_nc_ohc=j_g86BJddvMAX8UwMu9&_nc_ht=scontent.fsgn2-6.fna&oh=00_AfAa3yaO-YmYKbGGyPiMI2Oe7BI-3N3kbAC0E-ttPHAQYw&oe=640AB97E'
            }
        }
    }).then((msg)=>{
        console.log('success', msg);
    })


