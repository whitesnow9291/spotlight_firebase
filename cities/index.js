
  $(document).ready(function() {

    var database = firebase.database();
    var cities = database.ref().child('cities');

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
      cities.orderByValue().startAt(searchkey).endAt(searchkey+'\uf8ff')
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

    function viewBuild(cites_data){
      var tbody_el = $('tbody#cities_data');
      tbody_el.empty();
      $.each( cites_data, function( key, value ) {

        var one_city_tr =
        "<tr>"+
         "<td width=100%>"+
           "<h3>"+value+"</h3>"+
         "</td>"+
         "<td style='vertical-align:middle'><a href=edit.html?id="+key+" class='btn btn-link'>edit</a></td>"+
       "</tr>";
       tbody_el.append(one_city_tr);
      });
      $("#loading_gif").hide();
    }



  });
