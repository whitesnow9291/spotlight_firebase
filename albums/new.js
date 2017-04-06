
$(document).ready(function() {
  var database = firebase.database();
  var cities = database.ref().child('cities');
  var albums = database.ref().child('albums');
  var storage = firebase.storage().ref().child('albums');
  // html input
  var eventName = $('#inputEventName');
  var location = $('#inputLocation');
  var city = $('#inputCity');
  var date = $('#inputDate');
  var files = $('#files')[0];


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
  //event handle
  var addhander = function(){
    if (!validateForm()){
      toastr.error('please fill all required fields');
      return;
    }
    $("#loading_gif").show();

    var event_images = files.files;
    var dir_name = '';
    var file_names = [];
    var download_urls=[];
    var storage_names=[];
    var updatedata = {
      'albumView':0,
      'eventName':eventName.val(),
      'location':location.val(),
      'city':city.find(":selected").val(),
      'date':date.val(),
      'dir_name':dir_name,
      'download_urls':[],
      'images':file_names,
      'storage_names':storage_names
    }
    if (event_images.length>0){
      dir_name = Math.random().toString(36).substring(2);
      var album_names = $('.album_name');
      updatedata.dir_name = dir_name;
      Promise.all(
        $.map( event_images, function(file,i ) {
          //file_name = Math.random().toString(36).substring(16);

          file_name =$('.album_name#'+file.lastModified)[0].value; //file.name;
          file_names.push(file_name);
          var storage_name = Math.random().toString(36).substring(2);
          storage_names.push(storage_name);
          return storage.child(dir_name).child(storage_name).put(file);
        })
      ).then(function(snapshot){
        //console.log(snapshot[0].downloadURL);
        $.each(snapshot,function(key,val){
          download_urls.push(val.downloadURL);
        });
        updatedata.download_urls=download_urls;
        console.log(updatedata);
        savedatabase(updatedata);
      });
    }else{
      console.log(updatedata);
      savedatabase(updatedata);
    }
  }
  function savedatabase(updatedata){
    var views=[];
    if(updatedata.download_urls){
        for (var i = 0;i<updatedata.download_urls.length;i++){
          views.push(0);
        }
    }
    updatedata.views=views;
    albums.push(updatedata).then(function(){
      $("#loading_gif").hide();
      window.location.href = 'index.html';
      toastr.options.timeOut = 3500;
      toastr.success('Success!');

    });
  }
});
