
  $(document).ready(function() {
    //get event id
        // var urlParams = new URLSearchParams(window.location.search);
        // console.log(urlParams.has('id')); // true
        // console.log(urlParams.get('id')); // "edit"
        // var id = urlParams.get('id');
        // var emailparam = urlParams.get('email');
    var id = getParameterByName('id');
    var emailparam = getParameterByName('email');
    // firebase variables
        var database = firebase.database();

        var user = database.ref('users/' + id);


    var email = $('#inputEmail');
    email.val(emailparam);
    var pass = $('#inputPass');

    var btnEdit = $('.btnEdit');
    $("#loading_gif").hide();
    btnEdit.click(function(){
      if (!validateForm()){
        toastr.error('please fill all required fields');
        return;
      }
      $("#loading_gif").show();
      var updatedata={};
      updatedata.email = email.val();
      updatedata.password = pass.val();
      user.set(updatedata).then(function(){
          $("#loading_gif").hide();
          toastr.options.timeOut = 3500;
          toastr.success('Success!');
        });
      $("#loading_gif").hide();
    })
    var btnDelete = $('.btnDelete');
    $('[data-toggle=confirmation]').confirmation({
      rootSelector: '[data-toggle=confirmation]',
      // other options
      onConfirm: function() {
        user.remove().then(function(){
            console.log('old file deleted');
            window.location.href = 'index.html';
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
