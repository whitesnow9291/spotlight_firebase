
  $(document).ready(function() {

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


    var btnEdit = $('.btnEdit');

//get place id
    // var urlParams = new URLSearchParams(window.location.search);
    // console.log(urlParams.has('id')); // true
    // console.log(urlParams.get('id')); // "edit"
    // var id = urlParams.get('id');

    var id = getParameterByName('id');
// firebase variables
    var database = firebase.database();
    var cities = database.ref().child('cities');
    var place = database.ref('places/' + id);
    var storage = firebase.storage().ref('places/' + id);
    var place_data;
  //html input build
  $('#tokenfield').tokenfield({
    autocomplete: {
      source: [],
      delay: 100
    },
    showAutocompleteOnFocus: true
  });
  var $imageupload = $('.imageupload');
  $imageupload.imageupload();
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
      console.log(JSON.stringify(snapshot.val()));
    });

    place.once('value', function(snapshot) {
      place_data = snapshot.val();
      viewBuild(place_data);
      console.log(JSON.stringify(snapshot.val()));
    });
    function viewBuild(place_data){
      inputPlaceName.val(place_data.placeName);
      inputAddress.val(place_data.address);
      locationtype.val(place_data.locationtype);
      inputAbout.val(place_data.about);
      inputCover.val(place_data.cover);
      inputCity.val(place_data.city);
      inputDresscode.val(place_data.dresscode);
      if (place_data.placeday){
        $.each(place_data.placeday,function(key,val){
          var selector = "#input"+key;
          $(selector).val(val);
        });
      }

      btnEdit.click(edithander);
      $("#loading_gif").hide();
    }


    var edithander = function(){
      if (!validateForm()){
        toastr.error('please fill all required fields');
        return;
      }
      $("#loading_gif").show();

      var place_image = image.files[0];
      var file_name = '';

      var updatedata = {
        "placeName" : inputPlaceName.val(),
        "address" : inputAddress.val(),
        'locationtype':locationtype.val(),
        "about" : inputAbout.val(),
        "cover" : inputCover.val(),
        "city" : inputCity.val(),
        "dresscode" : inputDresscode.val(),
        "image" : '',
        'download_url':'',
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
        file_name = Math.random().toString(36).substring(16);
        updatedata.image = file_name;
        firebase.storage().ref('places/'+file_name).put(place_image).then(function(snapshot) {
          console.log('Uploaded a blob or file!');
          updatedata.download_url = snapshot.downloadURL;
          updatedatabase(updatedata);
        });
      }else{
        console.log(updatedata);
        updatedatabase(updatedata);
      }
    }
    function updatedatabase(updatedata){
      if (updatedata.image==''){
        updatedata.image = place_data.image;
        updatedata.download_url = place_data.download_url;
      }else{
        if (place_data.image){
          firebase.storage().ref('places/' + place_data.image).delete().then(function(){
            console.log('old file deleted');
          });
        }

      }
      place.set(updatedata).then(function(){
          $("#loading_gif").hide();
          toastr.options.timeOut = 3500;
          toastr.success('Success!');
        });
    }
    var btnDelete = $('.btnDelete');
    $('[data-toggle=confirmation]').confirmation({
      rootSelector: '[data-toggle=confirmation]',
      // other options
      onConfirm: function() {
        place.remove().then(function(){
          if (place_data.image){
            firebase.storage().ref('places/' + place_data.image).delete().then(function(){
              console.log('old file deleted');
              window.location.href = 'index.html';
            });
          }else{
            console.log('old file deleted');
            window.location.href = 'index.html';
          }
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
