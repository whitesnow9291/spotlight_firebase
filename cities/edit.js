
  $(document).ready(function() {
    var database = firebase.database();
    // var urlParams = new URLSearchParams(window.location.search);
    //
    // console.log(urlParams.has('id')); // true
    // console.log(urlParams.get('id')); // "edit"
    // var id = urlParams.get('id');
    var googleaddressinput = document.getElementById('inputCity');
    var options = {
      types: ['(cities)'],

    };
    autocomplete = new google.maps.places.Autocomplete(googleaddressinput, options);
    var id = getParameterByName('id');
    var city = database.ref('cities/' + id);
    var city_input = $('#inputCity');
    $("#loading_gif").show();
    city.on('value', function(snapshot) {
      var city_data = snapshot.val();
      viewBuild(city_data);

      console.log(JSON.stringify(snapshot.val()));
    });
    function viewBuild(city_data){

      city_input.val(city_data);
      $("#loading_gif").hide();
    }
    var btnEdit = $('.btnEdit');
    btnEdit.click(function(){
      if (!validateForm()){
        toastr.error('please fill all required fields');
        return;
      }
      var newcity = city_input.val();
      city.set(newcity).then(function(){
          toastr.options.timeOut = 3500;
          toastr.success('Success!');
        });



      // Display an error toast, with a title
      //toastr.error('Error found.');
    })
    var btnDelete = $('.btnDelete');
    $('[data-toggle=confirmation]').confirmation({
      rootSelector: '[data-toggle=confirmation]',
      // other options
      onConfirm: function() {
        city.remove().then(function(){
          location.href = 'index.html'
        })

      },
      onCancel: function() {
        //alert('You didn\'t choose');
      },
    });
    function getParameterByName(name, url) {
        if (!url) {
          url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
  });
