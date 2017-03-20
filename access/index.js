
  $(document).ready(function() {
    var database = firebase.database();
    var users = database.ref().child('users');
    var searchInput = $('#inputSearch');
    var searchBtn = $('#btnSearch');
    searchBtn.click(function(){
      var searchkey = searchInput.val();
      loaddata(searchkey);
    });
    var totaldata;
    loaddata();
    function loaddata(searchkey){
      $("#loading_gif").show();
      if (searchkey){
        var searchfor = $('#selectForSearch').val();
            users.orderByChild('email').startAt(searchkey).endAt(searchkey+'\uf8ff')
            .once('value').then(function(snapshot){
                totaldata = snapshot.val();

                renderpagination();
            });
        }
        else{
          users//.startAt(searchkey).endAt(searchkey+'\uf8ff')
          .once('value').then(function(snapshot){
              totaldata = snapshot.val();

              renderpagination();
          });
        }
    }
    function renderpagination(){
       viewBuild(totaldata);
    }
    function viewBuild(totaldata){
      var userTbody = $('#userTbody');
      userTbody.empty();
      if (totaldata){
        $.each( totaldata, function( key, value ) {

          var one_event ="<tr>"+
           "<td width=100%>"+
             "<p>"+value.email+"</p>"+
           "</td>"+
           "<td style='vertical-align:middle'><a href=edit.html?id="+ key +"&email="+value.email+" class='btn btn-link'>edit</a></td>"+
         "</tr>";
          userTbody.append(one_event);
        });
      }
      $("#loading_gif").hide();
    }
  });
