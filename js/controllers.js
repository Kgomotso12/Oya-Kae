angular.module('app.controllers', [])

.controller('loginCtrl', ['$scope', '$stateParams', "$state", // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state) {
    /**
     * Function called when clicking the Login/Logout button.
     */
    // [START buttoncallback]
    function toggleSignIn() {
        if (!firebase.auth().currentUser) {
            // [START createprovider]
            var provider = new firebase.auth.GoogleAuthProvider();
            // [END createprovider]
            // [START addscopes]
            provider.addScope('https://www.googleapis.com/auth/plus.login');
            // [END addscopes]
            // [START signin]
            firebase.auth().signInWithPopup(provider).then(function(result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                // [START_EXCLUDE]
                //document.getElementById('quickstart-oauthtoken').textContent = token;
                // [END_EXCLUDE]
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // [START_EXCLUDE]
                if (errorCode === 'auth/account-exists-with-different-credential') {
                    alert('You have already signed up with a different auth provider for that email.');
                    // If you are using multiple auth providers on your app you should handle linking
                    // the user's accounts here.
                } else {
                    console.error(error);
                }
                // [END_EXCLUDE]
            });
            // [END signin]
        } else {
            // [START signout]
            firebase.auth().signOut();
            // [END signout]
        }
        // [START_EXCLUDE]
        document.getElementById('quickstart-sign-in').disabled = true;
        // [END_EXCLUDE]
    }
    // [END buttoncallback]

    /**
     * initApp handles setting up UI event listeners and registering Firebase auth listeners:
     *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
     *    out, and that is where we update the UI.
     */
    function initApp() {
        // Listening for auth state changes.
        // [START authstatelistener]
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                var displayName = user.displayName;
                var email = user.email;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL;
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                var providerData = user.providerData;

                $state.go("menu.home");

                // [START_EXCLUDE]
                // document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
                 document.getElementById('quickstart-sign-in').textContent = 'Sign out';
                // document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
                // [END_EXCLUDE]
            } else {
                // User is signed out.
                // [START_EXCLUDE]
                // document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
                document.getElementById('quickstart-sign-in').textContent = 'Sign in with Google';
                // document.getElementById('quickstart-account-details').textContent = 'null';
                // document.getElementById('quickstart-oauthtoken').textContent = 'null';
                // [END_EXCLUDE]
            }
            // [START_EXCLUDE]
            document.getElementById('quickstart-sign-in').disabled = false;
            // [END_EXCLUDE]
        });
        // [END authstatelistener]

        document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
    }

    initApp();
}])
.controller('homeCtrl', ['$scope', '$stateParams', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state) {

    function toggleSignOut()
    {
        firebase.auth().signOut();
        $state.go("login");
    }
    document.getElementById('quickstart-sign-out').addEventListener('click', toggleSignOut, false);

    var directionsService = new google.maps.DirectionsService;

    var mapOptions = {
        center: new google.maps.LatLng(51.5, -0.12),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.NORMAL
    }


    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
        panel: document.getElementById('right-panel')
    });
    //google.maps.event.addDomListener(window, 'load', myMap);
    directionsDisplay.setMap(map);

    calculateAndDisplayRoute(directionsService, directionsDisplay);
    document.getElementById('pac-input').addEventListener('change', function() {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    });

    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        directionsService.route({
            origin: {lat: 37.77, lng: -122.447},  // Haight.
            destination: {lat: 37.768, lng: -122.511},  // Ocean Beach.
            // Note that Javascript allows us to access the constant
            // using square brackets and a string value as its
            // "property."
            travelMode: google.maps.TravelMode["DRIVING"]
        }, function (response, status) {
            if (status == 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

    google.maps.event.addListener(map, 'click', function(e) {
        placeMarker(e.latLng, map);
    });

    function placeMarker(position, map) {
        var marker = new google.maps.Marker({
            position: position,
            map: map
        });
        map.panTo(position);
    }
}])

.controller('paymentCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

    function toggleSignOut()
    {
        firebase.auth().signOut();
        $state.go("login");
    }
    document.getElementById('quickstart-sign-out').addEventListener('click', toggleSignOut, false);
}])
   
.controller('tripsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {
    function toggleSignOut()
    {
        firebase.auth().signOut();
        $state.go("login");
    }
    document.getElementById('quickstart-sign-out').addEventListener('click', toggleSignOut, false);

    $('#calendar').fullCalendar({
        dayClick: function() {
            alert('a day has been clicked!');
        }
    });
}])
   
.controller('historyCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
 