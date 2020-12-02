const { Client,Location } = require('whatsapp-web.js');
const client = new Client();
const qrcode = require('qrcode-terminal');
const fetch = require('node-fetch');
const querystring = require('querystring');

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {
    names = "";
    msgEncode = encodeURIComponent(msg.body);
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${msgEncode}&language=iw&key=AIzaSyCsIHF_gDTEL03aDYG4nygQxwsKgpbep1Y`);
    const data = await response.json();
    const places = data.results;
    var i = 0;
    for (const key in places) {
        if(i == 3) break;

        if (places.hasOwnProperty(key)) {
            latitude = places[key].latitude;
            longitude = places[key].longitude;
            name = places[key].name;
            var responseBu = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${places[key].place_id}&language=iw&key=AIzaSyCsIHF_gDTEL03aDYG4nygQxwsKgpbep1Y&fields=formatted_phone_number`);
            var buDate = await responseBu.json();
            console.log(buDate);
            client.sendMessage(msg.from, "-----------------------------------------------------");
            client.sendMessage(msg.from, name);
            client.sendMessage(msg.from, `טלפון: ${buDate.result.formatted_phone_number}`);
            client.sendMessage(msg.from, new Location(latitude, longitude, name));
            

            
        }
        i++;
        
    }
    

    
});

client.initialize();