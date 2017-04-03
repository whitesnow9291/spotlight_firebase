window.onload = function(){
    firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
      // No user is signed in.
      //alert('you are not loged in');
      var localuser = localStorage.getItem("user");
      if (!localuser){
        location.href = '../signin/index.html';
      }
      $('nav ul li:nth-child(5)').hide();
      $('nav ul li:nth-child(6)').hide();
    }
  });
  $('.logout_button ').click(function(){
      firebase.auth().onAuthStateChanged(function(user) {
          if (!user) {
            // No user is signed in.
            //alert('you are not loged in');
            localStorage.removeItem("user");
              location.href = '../signin/index.html';
          }else{
            firebase.auth().signOut().them(function() {
              location.href = '../signin/index.html';
            });
          }
      });
  });

}
