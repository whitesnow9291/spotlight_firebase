
$(document).ready(function() {
  var database = firebase.database();
  var cities = database.ref().child('cities');
  var events = database.ref().child('events');
  var storage = firebase.storage().ref().child('events');
  // html input
  var eventName = $('#inputEventName');
  var location = $('#inputLocation');
  var locationtype = $('#inputLocationType');
  var city = $('#inputCity');
  var date = $('#inputDate');
  var starttime = $('#inputStartTime');
  var endtime = $('#inputEndTime');
  var tags = $('#tokenfield');
  var image = $('#inputImage')[0];
  var description = $('#inputDescription');
  var address = $('#inputAddress');
  var ticketlink = $('#inputTicketLink');

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
    componentRestrictions: {country: []}
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

    var event_image = image.files[0];
    var file_name = '';
    var expired = new Date(date.val().replace(/-/g,'/')+" "+endtime.val());
    expired = 2*3600*1000 + expired.getTime();

    var updatedata = {
      'eventName':eventName.val(),
      'location':location.val(),
      'locationtype':locationtype.val(),
      'city':city.find(":selected").val(),
      'date':date.val(),
      'starttime':starttime.val(),
      'endtime':endtime.val(),
      'tags':tags.val(),
      'image':file_name,
      'download_url':'',
      'description':description.val(),
      'address':address.val(),
      'ticketlink':ticketlink.val(),
      'expired':expired,
    }
    if (event_image){
      file_name = Math.random().toString(36).substring(16);
      updatedata.image = file_name;
      storage.child(file_name).put(event_image).then(function(snapshot) {
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
    events.push(updatedata).then(function(){
      $("#loading_gif").hide();
      window.location.href = 'index.html';
      toastr.options.timeOut = 3500;
      toastr.success('Success!');

    });
  }
});
