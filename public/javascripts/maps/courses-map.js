
let mapInstance, userCurrentPosition, geocoder
let courses = []

function initMap() {

  newMap()
  getPlacesAddress()

}

function newMap() {

  mapInstance = new google.maps.Map(
    document.querySelector('#myCoursesMap'),
    { center: { lat: 40.392499, lng: -3.698214 }, zoom: 15, styles: danceApp }
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

  courses.forEach(course => {

    geocoder.geocode({ address: course.address }, (results, status) => {

      if (status === "OK") {

        console.log(results)

        resultsMap.setCenter(results[0].geometry.location);
        new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location,
          icon: './../images/dance_class.png',
          title: course.name
        });

      } else {

        alert("Geocode was not successful for the following reason: " + status);

      }
    });

  })

}

function getPlacesAddress() {

  axios
    .get('/api/courses')
    .then(response => {
      response.data.forEach(elm => {
        courses.push({ address: elm.address, name: elm.name })
      });

      console.log(address)

    })
    .catch(err => console.log(err))
}
