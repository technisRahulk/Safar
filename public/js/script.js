//want to recieve this locations array from either app.js or index.hs have a look 
function initMap(locations) {

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 3,
      center: {lat: 34.0479, lng: 100.6197}
    });

    // Create an array of alphabetical characters used to label the markers.
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var markers = locations.map(function(location, i){
      return new google.maps.Marker({
        position: location,
        label: labels[i % labels.length]
      });
    });

    // Add a marker clusterer to manage the markers.
    var markerCluster = new MarkerClusterer(map, markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  }
  // var locations = [
  //   {lat: 25.86, lng: 78.96},
  //   {lat: 23.718234, lng: 80.363181},
  //   {lat: 51.5, lng: 0.1278},
  //   {lat: -33.848588, lng: 151.209834},
  //   {lat: -33.851702, lng: 151.216968},
  //   {lat: -34.671264, lng: 150.863657},
  //   {lat: -35.304724, lng: 148.662905},
  //   {lat: -36.817685, lng: 175.699196},
  //   {lat: -36.828611, lng: 175.790222},
  //   {lat: -37.750000, lng: 145.116667},
  // ]
