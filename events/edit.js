
  $(document).ready(function() {

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

    var btnEdit = $('.btnEdit');

//get event id
    // var urlParams = new URLSearchParams(window.location.search);
    // console.log(urlParams.has('id')); // true
    // console.log(urlParams.get('id')); // "edit"
    // var id = urlParams.get('id');
    var id = getParameterByName('id');
// firebase variables
    var database = firebase.database();
    var cities = database.ref().child('cities');
    var event = database.ref('events/' + id);
    var storage = firebase.storage().ref('events/' + id);
    var event_data;
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

    event.once('value', function(snapshot) {
      event_data = snapshot.val();
      viewBuild(event_data);
      console.log(JSON.stringify(snapshot.val()));
    });
    function viewBuild(event_data){
       eventName.val(event_data.eventName);
       location.val(event_data.location);
       locationtype.val(event_data.locationtype);
       city.val(event_data.city);
       date.val(event_data.date);
       starttime.val(event_data.starttime);
       endtime.val(event_data.endtime);
       tags.tokenfield('setTokens',event_data.tags);
       //image.val(event_data.image);
       description.val(event_data.description);
       address.val(event_data.address);
       ticketlink.val(event_data.ticketlink);
       $(".prev_image img").attr('src',event_data.download_url);
      btnEdit.click(edithander);
      $("#loading_gif").hide();
    }


    var edithander = function(){
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
        'image':'',
        'download_url':'',
        'description':description.val(),
        'address':address.val(),
        'ticketlink':ticketlink.val(),
        'expired':expired,
      }
      if (event_image){
        file_name = Math.random().toString(36).substring(2);
        updatedata.image = file_name;
        firebase.storage().ref('events/'+file_name).put(event_image).then(function(snapshot) {
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
        updatedata.image = event_data.image;
        updatedata.download_url = event_data.download_url;
      }else{
        if (event_data.image){
          firebase.storage().ref('events/' + event_data.image).delete().then(function(){
            console.log('old file deleted');
          });
        }

      }

      event.set(updatedata).then(function(){
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
        event.remove().then(function(){
          if (event_data.image){
            firebase.storage().ref('events/' + event_data.image).delete().then(function(){
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
