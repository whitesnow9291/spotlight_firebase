
  // Initialize Firebase
  (function(){

    var btnConfirmPass = document.getElementById('btnConfirmPass');
    var textPass = document.getElementById('inputPass');
    var textPassc = document.getElementById('inputPassc');
    var textCode = document.getElementById('inputCode');
    btnConfirmPass.addEventListener('click', function() {
        const pass = textPass.value;
        const passc = textPassc.value;
        const code = textCode.value;
        const auth = firebase.auth();
        if (pass=='' || pass!=passc){
          toastr.error("Password confirmation dismatch!");
          return;
        }

        auth.verifyPasswordResetCode(code).then(function(email) {
         var accountEmail = email;

         // TODO: Show the reset screen with the user's email and ask the user for
         // the new password.

         // Save the new password.
         auth.confirmPasswordReset(code, pass).then(function(resp) {
           // Password reset has been confirmed and new password updated.
           // TODO: Display a link back to the app, or sign-in the user directly
           // if the page belongs to the same domain as the app:
           auth.signInWithEmailAndPassword(accountEmail, pass).then(function(){
             location.href = "../events/index.html"
           },function(error) {
             // Handle Errors here.
             var errorCode = error.code;
             var errorMessage = error.message;
             toastr.options.timeOut = 3500;
             toastr.error(errorMessage);
           });
         }).catch(function(error) {
           // Error occurred during confirmation. The code might have expired or the
           // password is too weak.
           var errorCode = error.code;
           var errorMessage = error.message;
           toastr.error(errorMessage);
         });
       }).catch(function(error) {
         // Invalid or expired action code. Ask user to try to reset the password
         // again.
         var errorCode = error.code;
         var errorMessage = error.message;
         toastr.error(errorMessage);
       });


    }, false);


  }());
