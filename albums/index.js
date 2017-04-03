
$(document).ready(function() {
  var database = firebase.database();
  var cities = database.ref().child('cities');
  var albums = database.ref().child('albums');
  var storage = firebase.storage().ref().child('albums');
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
    if (searchkey){
      var searchfor = $('#selectForSearch').val();
          albums.orderByChild(searchfor).startAt(searchkey).endAt(searchkey+'\uf8ff')
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
        albums//.startAt(searchkey).endAt(searchkey+'\uf8ff')
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

  function viewBuild(albums_data){
    var albums_tbody = $('#albums_tbody');
    albums_tbody.empty();
    $.each( albums_data, function( key, value ) {
      album_src = value.download_urls?value.download_urls[0]:'';
      console.log(album_src);
      var one_album ="<tr>"+
       "<td><img class='imgPlace' src=" + album_src + "></td>"+
       "<td width=100%>"+
         "<h3>"+value.eventName+"</h3>"+
         "<span>"+value.city+"</span>&emsp;"+
         "<span>"+value.date+"</span>&emsp;"+
         "<span>"+value.location+"</span>&emsp;"+
       "</td>"+
       "<td style='vertical-align:middle'><a href=edit.html?id="+key +" class='btn btn-link'>edit</a></td>"+
     "</tr>";
      albums_tbody.prepend(one_album);
    });
    $("#loading_gif").hide();
  }
});
