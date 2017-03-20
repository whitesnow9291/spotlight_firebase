
  $(document).ready(function() {
    var googleaddressinput = document.getElementById('inputCity');
    var options = {
      types: ['(cities)'],
      
    };
    autocomplete = new google.maps.places.Autocomplete(googleaddressinput, options);
    var btnAdd = $('.btnAdd');
    btnAdd.click(function(){
      if (!validateForm()){
        toastr.error('please fill all required fields');
        return;
      }
      var database = firebase.database();
      var cities = database.ref().child('cities');
      var inputCity = $("#inputCity").val();
      cities.push(inputCity).then(function(){
        toastr.options.timeOut = 3500;
        toastr.success('Success!');
        window.location.href = 'index.html';
      },function(error) {
        // An error happened.
        var errorCode = error.code;
        var errorMessage = error.message;
        toastr.error(errorMessage);
      });

      // Display an error toast, with a title
      //toastr.error('Error found.');
    })
  });
