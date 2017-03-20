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
}
