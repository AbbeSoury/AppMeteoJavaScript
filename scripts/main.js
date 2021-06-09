import tabJoursEnOrdre from "./Utilitaire/gestionTemps.js";

const CLEFAPI = '59e69651fc51857ecad3510909796350';
const CLEFAPIGEOLOC = 'c80b945a7d0eb5eae7fc665313c53246';

let resultatsAPI;
let resultatsAPIPos;

const temps = document.querySelector('.temps');
const temperature = document.querySelector('.temperature');
const localisation = document.querySelector('.localisation');
const heure = document.querySelectorAll('.heure-nom-prevision');
const tempPourH = document.querySelectorAll('.heure-prevision-valeur');
const joursDiv = document.querySelectorAll('.jour-prevision-nom');
const tempJoursDiv = document.querySelectorAll('.jour-prevision-temp');
const imgIcone = document.querySelector('.logo-meteo');
// const chargementContainer = document.querySelector('.overlay-choix-ville');


// if(navigator.geolocation){
//     navigator.geolocation.getCurrentPosition(position => {

//         //console.log(position);
//         let long = position.coords.longitude
//         let lat = position.coords.latitude
//         AppelAPI(long,lat)

//     }, ()=> {
//         alert(`Vous avez refusé la géolocalisation, l'application ne peut pas fonctionner, veuillez l'activer.!`)
//     })
// }
var  name =  window.prompt('Veuillez choisir une ville')

if(name != null ) {
    GetCityPos(name)
}

function GetCityPos(name){

    fetch(`api.positionstack.com/v1/forward?access_key=${CLEFAPIGEOLOC}&query=${name}`)
    .then((reponse) => {
        return reponse.json();
    })
    .then((data2) => {
        //console.log(data2);
        resultatsAPIPos = data2 ;

        let long = resultatsAPIPos.data[0].longitude
        let lat = resultatsAPIPos.data[0].latitude

        AppelAPI(long,lat)
})
}

function AppelAPI(long,lat){

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEFAPI}`)
    .then((reponse) => {
        return reponse.json();
    })
    .then((data) => {
        //console.log(data);

        resultatsAPI=data;

        temps.innerText = resultatsAPI.current.weather[0].description;
        temperature.innerText = `${Math.trunc(resultatsAPI.current.temp)}°`;
        localisation.innerText = resultatsAPIPos.data[0].label;


        // les heures, par tranche de trois, avec leur température.

        let heureActuelle = new Date().getHours();

        for(let i=0; i < heure.length; i++) {

            let heureIncr = heureActuelle + i * 3;

            if(heureIncr > 24) {
                heure[i].innerText = `${heureIncr - 24} h`;
            } else if(heureIncr === 24) {
                heure[i].innerText = '00h';
            } else {
                heure[i].innerText =`${heureIncr} h`;
            }
        }

        // temps pour 3h
        for(let j=0; j < tempPourH.length; j++){
            tempPourH[j].innerText = `${Math.trunc(resultatsAPI.hourly[j * 3].temp)}°`
        }

        // trois premières lettres des jours

        for(let k = 0; k <tabJoursEnOrdre.length; k++) {
            joursDiv[k].innerText = tabJoursEnOrdre[k].slice(0,3);
        }

        // temp par jour

        for(let m = 0; m < 7; m++) {
            tempJoursDiv[m].innerText = `${Math.trunc(resultatsAPI.daily[m + 1].temp.day)}°`
        }

        // Icone dynamique

        if(heureActuelle >= 6 && heureActuelle <21){
            imgIcone.src = `ressources/jour/${resultatsAPI.current.weather[0].icon}.svg`
        } else {
            imgIcone.src = `ressources/nuit/${resultatsAPI.current.weather[0].icon}.svg`
        }


    })
}