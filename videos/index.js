
$(document).ready(function() {
  var database = firebase.database();
  var cities = database.ref().child('cities');
  var videos = database.ref().child('videos');
  var storage = firebase.storage().ref().child('videos');
  var user = firebase.auth().currentUser;
  //pagination and search
  var searchInput = $('#inputSearch');
  var searchBtn = $('#btnSearch');
  searchBtn.click(function(){
    var searchkey = searchInput.val();
    loaddata(searchkey);
  });
  var currentpage=1;
  var perpagenum = 10;
  var totaldata=[];
  loaddata();
  function loaddata(searchkey){
    $("#loading_gif").show();
    var searchfor = $('#selectForSearch').val();
    videos.orderByChild(searchfor).startAt(searchkey).endAt(searchkey+'\uf8ff').once('value').then(function(snapshot){
        //console.log(snapshot.val());
        if (searchkey){
          var searchfor = $('#selectForSearch').val();
              videos.orderByChild(searchfor).startAt(searchkey).endAt(searchkey+'\uf8ff')
              .once('value').then(function(snapshot){
                  totaldata_object = snapshot.val();
                  totaldata = [];
                  for (var variable in totaldata_object) {
                    var temp = {};
                    temp[variable] = totaldata_object[variable];
                    totaldata.push(temp);
                  }
                  currentpage=1;
                  renderpagination();
              });
          }
          else{
            videos//.startAt(searchkey).endAt(searchkey+'\uf8ff')
            .once('value').then(function(snapshot){
                totaldata_object = snapshot.val();
                totaldata = [];
                for (var variable in totaldata_object) {
                  var temp = {};
                  temp[variable] = totaldata_object[variable];
                  totaldata.push(temp);
                }
                currentpage=1;
                renderpagination();
            });
          }
    });


  }
  function renderpagination(){
     $('#next').prop('disabled', islastpage());
     $('#prev').prop('disabled', isfirstpage());
     var paginationdata = {};
     if (totaldata){
       var start_pos =(currentpage-1)*perpagenum;
       for (var i = start_pos;i<start_pos+perpagenum;i++){
         for (var variable in totaldata[i]) {
           paginationdata[variable]=totaldata[i][variable];
         }

       }
     }
     viewBuild(paginationdata);
  }
  function islastpage(){
    if (!totaldata) return true;
    if (totaldata.length<=currentpage*perpagenum){
     return true;
    }
    else {
      return false;
    }
  }
  function isfirstpage(){
    if (currentpage!=1){
     return false;
    }
    else {
      return true;
    }
  }
  $('#prev').click(moveBackward);
  $('#next').click(moveForward);
  function moveForward() {

      currentpage++;
      renderpagination();
  }

  function moveBackward() {

    currentpage--;
    renderpagination();
  }
  // load city data

  function viewBuild(videos_data){
    var videos_tbody = $('#videos_tbody');
    videos_tbody.empty();
    if (videos_data){
      $.each( videos_data, function( key, value ) {

        var one_video ="<tr>"+
         "<td>"+"<video width='320' height='240' controls>"+
         "<source src="+value.download_url+" type='video/mp4'>"+
         "Your browser does not support the video tag."+
"</video>"+
         "</td>"+
         "<td width=100% style='vertical-align:middle'>"+
           "<h3> Event Name: "+value.eventName+"</h3>"+
           "<span>City: "+value.city+"</span>&emsp;"+
           "<span>Date: "+value.date+"</span>"+
         "</td>"+
         "<td style='vertical-align:middle'><a href=edit.html?id="+key+" class='btn btn-link'>edit</a></td>"+
       "</tr>";
        videos_tbody.prepend(one_video);
      });
    }
    $("#loading_gif").hide();
  }
});
