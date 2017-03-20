
  // Initialize Firebase
  (function(){
    var config = {
      apiKey: "AIzaSyDBa71mRbterPI-0a-2vA1nOFxauD-2Iac",
      authDomain: "spotlight-f42d3.firebaseapp.com",
      databaseURL: "https://spotlight-f42d3.firebaseio.com",
      storageBucket: "spotlight-f42d3.appspot.com",
      messagingSenderId: "658861158175"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    var users = database.ref().child('users');

    var textEmail = document.getElementById('inputEmail');
    var textPass = document.getElementById('inputPassword');
    var btnLogin = document.getElementById('btnLogin');
    btnLogin.addEventListener('click', function() {
        const email = textEmail.value;
        const pass = textPass.value;
        const auth = firebase.auth();
        auth.signInWithEmailAndPassword(email, pass).catch(function(error) {
          // Handle Errors here.
          users
          .once('value').then(function(snapshot){
              totaldata = snapshot.val();
              $.each( totaldata, function( key, value ) {
                if (value.email == email && value.password == pass){
                  localStorage.setItem("user", value);
                  location.href = "../events/index.html"
                  return;
                }
              });
              var errorCode = error.code;
              var errorMessage = error.message;
              toastr.options.timeOut = 3500;
              toastr.error(errorMessage);
          });

        });
        auth.onAuthStateChanged(function(user) {
        if (user) {
          location.href = "../events/index.html"
        }
      });
    }, false);

  }());
