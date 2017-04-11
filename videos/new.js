
$(document).ready(function() {
  var database = firebase.database();
  var cities = database.ref().child('cities');
  var videos = database.ref().child('videos');
  var storage = firebase.storage().ref().child('videos');
  // html input
  var eventName = $('#inputEventName');
  var city = $('#inputCity');
  var date = $('#inputDate');

  var video_input = $('#input-video')[0];

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

  //event handle
  var addhander = function(){
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
      'download_url':'',
      'file_name':''
    }
    if (video_file){
      file_name = Math.random().toString(36).substring(2);
      updatedata.file_name = file_name;
      storage.child(file_name).put(video_file).then(function(snapshot) {
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
    videos.push(updatedata).then(function(){
      $("#loading_gif").hide();
      window.location.href = 'index.html';
      toastr.options.timeOut = 3500;
      toastr.success('Success!');

    });
  }
});
