
  $(document).ready(function() {
    var database = firebase.database();
    var users = database.ref().child('users');
    var email = $('#inputEmail');
    var pass = $('#inputPass');
    var btnAdd = $('.btnAdd');
    btnAdd.click(function(){
      if (!validateForm()){
        toastr.error('please fill all required fields');
        return;
      }
      var updatedata={};
      updatedata.email = email.val();
      updatedata.password = pass.val();
      users.push(updatedata).then(function(){
        $("#loading_gif").hide();
        toastr.options.timeOut = 3500;
        toastr.success('Success!');
        location.href = 'index.html';
      },function(error){
        var errorCode = error.code;
        var errorMessage = error.message;
        toastr.error(errorMessage);
      });
      // Display an error toast, with a title
      //toastr.error('Error found.');
    })
  });
