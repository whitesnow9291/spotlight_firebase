
$(document).ready(function() {
  var database = firebase.database();
  var cities = database.ref().child('cities');
  var places = database.ref().child('places');
  var storage = firebase.storage().ref().child('places');
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
          places.orderByChild(searchfor).startAt(searchkey).endAt(searchkey+'\uf8ff')
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
        places//.startAt(searchkey).endAt(searchkey+'\uf8ff')
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
  function viewBuild(places_data){

    var places_tbody = $('#places_tbody');
    places_tbody.empty();
    if (places_data){
      $.each( places_data, function( key, value ) {
        var one_place ="<tr>"+
         "<td><img class='imgPlace' src='"+value.download_url+"'></td>"+
         "<td width=100%>"+
           "<h3>"+value.placeName+"</h3>"+
           "<span>"+value.cover+"</span>&emsp;"+
           "<span>"+value.city+"</span>&emsp;"+
           "<span>"+value.dresscode+"</span>&emsp;"+
         "</td>"+
         "<td style='vertical-align:middle'><a href=edit.html?id="+key+" class='btn btn-link'>edit</a></td>"+
       "</tr>";
        places_tbody.prepend(one_place);
      });
    }

    $("#loading_gif").hide();
    $("#loading_gif").hide();
  }
  $("#loading_gif").show();
});
