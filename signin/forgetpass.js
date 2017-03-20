
  // Initialize Firebase
  (function(){
    var textEmail = document.getElementById('inputEmail');
    var btnSendEmail = document.getElementById('btnSendEmail');
    btnSendEmail.addEventListener('click', function() {
        const email = textEmail.value;
        const auth = firebase.auth();
        auth.sendPasswordResetEmail(email).then(function(){
          location.href = "confirmpass.html";
        },function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          toastr.options.timeOut = 3500;
          toastr.error(errorMessage);
        });
    }, false);


  }());
