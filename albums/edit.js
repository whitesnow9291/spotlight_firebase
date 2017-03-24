
  $(document).ready(function() {

// html input
    var eventName = $('#inputEventName');
    var location = $('#inputLocation');
    var city = $('#inputCity');
    var date = $('#inputDate');
    var files = $('#files')[0];

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
    var album = database.ref('albums/' + id);
    var storage = firebase.storage().ref('albums/');
    var album_data;
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

    album.once('value', function(snapshot) {
      album_data = snapshot.val();
      viewBuild(album_data);
      console.log(JSON.stringify(snapshot.val()));
    });
    function viewBuild(album_data){
      eventName.val(album_data.eventName);
      location.val(album_data.location);
      city.val(album_data.city);
      date.val(album_data.date);
      download_urls = album_data.download_urls;
      // if ((typeof download_urls)==array){
      //
      // }
      if (download_urls){
        for (var i=0;i<download_urls.length;i++) {
          if (download_urls[i]){
            // $("<div class='pip'>" +
            //   "<img class='imageThumb' src='" + download_urls[i] + "' title='" + album_data.images[i] + "'/>" +
            //   "<br/><button id ="+i+" class='remove'>Remove</button>" +
            //   "<input class='album_name form-control' id="+i+" value="+album_data.images[i]+" >"+
            //   "</div>").insertAfter("#files");
            $("<span class=\"pip\">" +
              "<img class=\"imageThumb\" src=\"" + download_urls[i] + "\" title=\"" + album_data.images[i] + "\"/>" +
              "<br/><span id ="+i+" class=\"remove\">Remove</span>" +
              "<input class='album_name form-control' id=id"+i+" value="+album_data.images[i]+" >"+
              "</span>").insertAfter("#files");
          }

        }
        $(".remove").click(function(){
          $("#loading_gif").show();
          var del_span = $(this).parent(".pip");
          var del_id = $(this).attr('id');
          Promise.all([firebase.storage().ref('albums/'+album_data.dir_name+"/"+album_data.storage_names[del_id]).delete(),
                      database.ref('albums/'+id+"/images/"+del_id).remove(),
                      database.ref('albums/'+id+"/download_urls/"+del_id).remove(),
                      database.ref('albums/'+id+"/views/"+del_id).remove(),
                    database.ref('albums/'+id+"/storage_names/"+del_id).remove()]
          ).then(function(snapshot){
            //console.log(snapshot[0].downloadURL);
            album_data.download_urls[del_id]=null;
            album_data.images[del_id]=null;
            album_data.storage_names[del_id] = null;
            album_data.views[del_id] = null;
            del_span.remove();
            $("#loading_gif").hide();
          });
        });
      }
      btnEdit.click(edithander);
      $("#loading_gif").hide();
    }


    var edithander = function(){
      console.log(album_data);
      if (!validateForm()){
        toastr.error('please fill all required fields');
        return;
      }


      var event_images = files.files;
      var dir_name = album_data.dir_name?album_data.dir_name:Math.random().toString(36).substring(16);
      var file_names = album_data.images?album_data.images:[];
      for (var i=0;i<file_names.length;i++){
        if (file_names[i])
        file_names[i] = $('.album_name#id'+i)[0].value;
      }
      var download_urls=album_data.download_urls?album_data.download_urls:[];
      var storage_names = album_data.storage_names?album_data.storage_names:[];
      var views = album_data.views?album_data.views:[];
      var updatedata = {
        'albumView':album_data.albumView?album_data.albumView:0,
        'eventName':eventName.val(),
        'location':location.val(),
        'city':city.find(":selected").val(),
        'date':date.val(),
        'dir_name':album_data.dir_name,
        'download_urls':download_urls,
        'images':file_names,
        'storage_names':storage_names,
        'views':views
      }
      if (event_images.length==0){
        if (file_names.length==0){
          toastr.error('please fill all required fields');return;
        }
        var file_number = 0;
        for (var i = 0;i < file_names.length;i++)
        if (file_names[i]) file_number++;
        if (file_number==0){
          toastr.error('please fill all required fields');return;
        }
      }
      $("#loading_gif").show();
      if (event_images.length>0){

        Promise.all(
          $.map( event_images, function(file,i ) {
            //file_name = Math.random().toString(36).substring(16);
            file_name =$('.album_name#'+file.lastModified)[0].value
            file_names.push(file_name);
            var storage_name = Math.random().toString(36).substring(7);
            storage_names.push(storage_name);
            views.push(0);
            return storage.child(dir_name).child(storage_name).put(file);
          })
        ).then(function(snapshot){
          //console.log(snapshot[0].downloadURL);
          $.each(snapshot,function(key,val){
            download_urls.push(val.downloadURL);
          });
          updatedata.download_urls=download_urls;
          console.log(updatedata);
          updatedatabase(updatedata);
        });
      }else{
        console.log(updatedata);
        updatedatabase(updatedata);
      }
    }
    function updatedatabase(updatedata){
      if (false && album_data.dir_name){
        Promise.all(
          $.map( album_data.images, function(file ) {
            return firebase.storage().ref('albums/' + album_data.dir_name+"/"+file).delete();
          })
        ).then(function(){
          console.log('old file deleted');
        });
      }
      if(updatedata.download_urls){
          for (var i = 0;i<updatedata.download_urls.length;i++){
            if (!updatedata.download_urls[i]){
              updatedata.download_urls.splice(i,1);
              updatedata.images.splice(i,1);
              updatedata.storage_names.splice(i,1);
              updatedata.views.splice(i,1);
            }
          }
      }

      album.set(updatedata).then(function(){
          $("#loading_gif").hide();
          window.location.href = 'index.html';
          toastr.options.timeOut = 3500;
          toastr.success('Success!');
        });
    }
    var btnDelete = $('.btnDelete');
    $('[data-toggle=confirmation]').confirmation({
      rootSelector: '[data-toggle=confirmation]',
      // other options
      onConfirm: function() {
        album.remove().then(function(){
          if (album_data.dir_name){
            Promise.all(
              $.map( album_data.storage_names, function(file ) {
                return firebase.storage().ref('albums/' + album_data.dir_name+"/"+file).delete();
              })
            ).then(function(){
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
