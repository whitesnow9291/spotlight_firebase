
  $(document).ready(function() {

// html input
    var eventName = $('#inputEventName');
    var city = $('#inputCity');
    var date = $('#inputDate');
    var video_input = $('#input-video')[0];

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
    var video = database.ref('videos/' + id);
    var storage = firebase.storage().ref('videos/' + id);
    var video_data;
  //html input build
  var googleaddressinput = document.getElementById('inputAddress');
  var options = {
    componentRestrictions: {country: []}
  };
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

    video.once('value', function(snapshot) {
      video_data = snapshot.val();
      viewBuild(video_data);
      console.log(JSON.stringify(snapshot.val()));
    });
    function viewBuild(video_data){
       eventName.val(video_data.eventName);
       city.val(video_data.city);
       date.val(video_data.date);
       $(".prev_video video").attr('src',video_data.download_url);
      btnEdit.click(edithander);
      $("#loading_gif").hide();
    }


    var edithander = function(){
      if (!validateForm()){
        toastr.error('please fill all required fields');
        return;
      }
      $("#loading_gif").show();

      var video_file = video_input.files[0];
      var file_name = '';
        var updatedata = {
        'eventName':eventName.val(),
        'city':city.find(":selected").val(),
        'date':date.val(),
        'file_name':file_name,
        'download_url':''
      }
      if (video_file){
        file_name = Math.random().toString(36).substring(2);
        updatedata.file_name = file_name;
        firebase.storage().ref('videos/'+file_name).put(video_file).then(function(snapshot) {
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
      if (updatedata.file_name==''){
        updatedata.file_name = video_data.file_name;
        updatedata.download_url = video_data.download_url;
      }else{
        if (video_data.file_name){
          firebase.storage().ref('videos/' + video_data.file_name).delete().then(function(){
            console.log('old file deleted');
          });
        }

      }

      video.set(updatedata).then(function(){
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
        video.remove().then(function(){
          if (video_data.file_name){
            firebase.storage().ref('videos/' + video_data.file_name).delete().then(function(){
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
