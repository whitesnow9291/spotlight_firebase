
  $(document).ready(function() {
    $('#tokenfield').tokenfield({
      autocomplete: {
        source: ['red','blue','green','yellow','violet','brown','purple','black','white'],
        delay: 100
      },
      showAutocompleteOnFocus: true
    });
    var $imageupload = $('.imageupload');
    $imageupload.imageupload();
    var btnAdd = $('.btnAdd');
    btnAdd.click(function(){
      toastr.options.timeOut = 3500;
      toastr.success('Success!');
      location.href = 'index.html';
      // Display an error toast, with a title
      //toastr.error('Error found.');
    })
  });
