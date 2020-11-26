// let mapInstance, userCurrentPosition

// function initMap() {

//   newMap()
//   getPlacesAddress()

// }

// function newMap() {

//   mapInstance = new google.maps.Map(
//     document.querySelector('#myMeetsMap'),
//     {center:  { lat: 40.392499, lng: -3.698214 }, zoom: 15}
//   )

//   if (navigator.geolocation) {
   
//     navigator.geolocation.getCurrentPosition(

//       pos => {
//         userCurrentPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude }
//         mapInstance.setCenter(userCurrentPosition)
//       },
      
//       err => console.log('¡No me has dejado acceder a tu posición!', err))
    
//   } else {

//     console.log('Módulo de geolocalización no disponible')

//   }
    
    
// }

// function getPlacesAddress() {

//     axios
//         .get('/api/meets')
//         .then(response => drawMarkers(response.data))
//         .catch(err => console.log(err))
// }

  
// function drawMarkers(meets) {
  
//     meets.forEach(elm => {
  
//         let position = { lat: elm.location.coordinates[0], lng: elm.location.coordinates[1] }
  
//         new google.maps.Marker({
//             map: mapInstance,
//             position,
//             title: elm.name
//         })
//     })
// }

let mapInstance, userCurrentPosition, geocoder
let meetups = []

function initMap() {

  newMap()
  getPlacesAddress()

}

function newMap() {

  mapInstance = new google.maps.Map(
    document.querySelector('#myMeetsMap'),
    { center: { lat: 40.392499, lng: -3.698214 }, zoom: 15 }
  )

  geocoder = new google.maps.Geocoder();
  window.onload = () => {
    geocodeAddress(geocoder, mapInstance);
  };

  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(

      pos => {
        userCurrentPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        mapInstance.setCenter(userCurrentPosition)
      },

      err => console.log('¡No me has dejado acceder a tu posición!', err))

  } else {

    console.log('Módulo de geolocalización no disponible')

  }
}

function geocodeAddress(geocoder, resultsMap) {

  meetups.forEach(meetup => {

    geocoder.geocode({ address: meetup.address }, (results, status) => {

      if (status === "OK") {

        console.log(results)

        resultsMap.setCenter(results[0].geometry.location);
        new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location,
          icon: './../images/dancinghall.png',
          title: meetup.name
        });

      } else {

        alert("Geocode was not successful for the following reason: " + status);

      }
    });

  })

}

function getPlacesAddress() {

  axios
    .get('/api/meets')
    .then(response => {
      response.data.forEach(elm => {
        meetups.push({ address: elm.address, name: elm.name })
      });
    })
    .catch(err => console.log(err))
}