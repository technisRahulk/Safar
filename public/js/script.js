const {MongoClient,ObjectID}=require('mongodb')
const connectURL='mongodb://127.0.0.1:27017'
const dbname='safar-api'

function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 3,
      center: {lat: -28.024, lng: 140.887}
    });

    // Create an array of alphabetical characters used to label the markers.
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Add some markers to the map.
    // Note: The code uses the JavaScript Array.prototype.map() method to
    // create an array of markers based on a given "locations" array.
    // The map() method here has nothing to do with the Google Maps API.
    var markers = locations.map(function(location, i) {
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
  //   {lat: -37.759859, lng: 145.128708},
  //   {lat: -37.765015, lng: 145.133858},
  //   {lat: -37.770104, lng: 145.143299},
  //   {lat: -37.773700, lng: 145.145187},
  //   {lat: -37.774785, lng: 145.137978},
  //   {lat: -37.819616, lng: 144.968119},
  //   {lat: -38.330766, lng: 144.695692},
  //   {lat: -39.927193, lng: 175.053218},
  //   {lat: -41.330162, lng: 174.865694},
  //   {lat: -42.734358, lng: 147.439506},
  //   {lat: -42.734358, lng: 147.501315},
  //   {lat: -42.735258, lng: 147.438000},
  //   {lat: -43.999792, lng: 170.463352}
  // ]

  MongoClient.connect(connectURL,{useNewUrlParser:true},(error,client) => {
    if(error){
      return res.send('Cannot connect to database')
    }
    const db=client.db(dbname)
    var locations = []
    db.collection('locations').find().forEach((loc)=>{
      if(loc.temperature>25){
        var m = {
          lat: loc.latitude,
          long: loc.longitude
        }
        locations.push(m)
      }
    })
  })

