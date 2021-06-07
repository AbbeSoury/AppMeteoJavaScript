
const CLEFAPI = '59e69651fc51857ecad3510909796350';
let resultatsAPI;

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position => {

        console.log(position);

    }, ()=> {
        alert(`Vous avez refusé la géolocalisation, l'application ne peut pas fonctionner, veuillez l'activer.!`)
    })
}