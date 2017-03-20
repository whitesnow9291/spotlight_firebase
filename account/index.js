
  $(document).ready(function() {
    var btnConfirmation = $('#btnConfirmation');
    btnConfirmation.click(function(){
      if (!validateForm()){
        toastr.error('please fill all required fields');
        return;
      }
      var user = firebase.auth().currentUser;
      var textpass = document.getElementById('inputPassword');
      var newPassword = textpass.value;
      toastr.options.timeOut = 3500;
      user.updatePassword(newPassword).then(function() {
        // Update successful.
        toastr.success('Password changed successfully!');
      }, function(error) {
        // An error happened.
        var errorCode = error.code;
        var errorMessage = error.message;
        toastr.error(errorMessage);
      });


    });
  });
