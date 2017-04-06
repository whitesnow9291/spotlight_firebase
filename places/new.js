
$(document).ready(function() {
  var database = firebase.database();
  var cities = database.ref().child('cities');
  var places = database.ref().child('places');
  var storage = firebase.storage().ref().child('places');
  // html input
  var inputPlaceName = $('#inputPlaceName');
  var inputAddress = $('#inputAddress');
  var locationtype = $('#inputLocationType');
  var inputAbout = $('#inputAbout');
  var inputCover = $('#inputCover');
  var inputCity = $('#inputCity');
  var inputDresscode = $('#inputDresscode');
  var image = $('#inputImage')[0];
  var inputMonday = $('#inputMonday');
  var inputTuesday = $('#inputTuesday');
  var inputWednesday = $('#inputWednesday');
  var inputThursday = $('#inputThursday');
  var inputFriday = $('#inputFriday');
  var inputSaturday = $('#inputSaturday');
  var inputSunday = $('#inputSunday');
  var inputday = $('.inputday');

  var btnAdd = $('.btnAdd');

  // load city data
  $("#loading_gif").show();
  cities.on('value', function(snapshot) {
    var cities_data = snapshot.val();
    var city_sel = $('#inputCity');
    city_sel.html("<option value='-1'>Select City</option>");
    if (cities_data){
      $.each( cities_data, function( key, value ) {

        var one_city_option ="<option>"+value+"</option>";
        city_sel.append(one_city_option);
      });
    }

    $("#loading_gif").hide();
    btnAdd.click(addhander);
    console.log(JSON.stringify(snapshot.val()));
  });
  //html input build
  var googleaddressinput = document.getElementById('inputAddress');
  var options = {
    types: ['(cities)'],

  };
  autocomplete = new google.maps.places.Autocomplete(googleaddressinput, options);
  $('#tokenfield').tokenfield({
    autocomplete: {
      source: [],
      delay: 100
    },
    showAutocompleteOnFocus: true
  });
  var $imageupload = $('.imageupload');
  $imageupload.imageupload();
  //event handle
  var addhander = function(){
    if (!validateForm()){
      toastr.error('please fill all required fields');
      return;
    }
    $("#loading_gif").show();

    var place_image = image.files[0];
    var file_name = '';

    var updatedata = {
      "placeName" : inputPlaceName.val(),
      "address":inputAddress.val(),
      'locationtype':locationtype.val(),
      "about" : inputAbout.val(),
      "cover" : inputCover.val(),
      "city" : inputCity.val(),
      "dresscode" : inputDresscode.val(),
      "image" : file_name,
      "placeday" : {}
    }
    $.each(inputday,function(key,inputE){

        if ($(inputE).val()!=''){
          var id = $(inputE).attr('id').slice(5);
          var val = $(inputE).val();
          updatedata.placeday[id]=val;
        }
    });
    if (place_image){
      file_name = Math.random().toString(36).substring(2);
      updatedata.image = file_name;
      storage.child(file_name).put(place_image).then(function(snapshot) {
        console.log('Uploaded a blob or file!');
        updatedata.download_url = snapshot.downloadURL;
        savedatabase(updatedata);
      });
    }else{
      console.log(updatedata);
      savedatabase(updatedata);
    }
  }
  function savedatabase(updatedata){
    places.push(updatedata).then(function(){
      $("#loading_gif").hide();
      toastr.options.timeOut = 3500;
      toastr.success('Success!');
      location.href = 'index.html';
    });
  }
});
