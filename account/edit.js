
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
    var btnEdit = $('.btnEdit');
    btnEdit.click(function(){
      toastr.options.timeOut = 3500;
      toastr.success('Success!');

      // Display an error toast, with a title
      //toastr.error('Error found.');
    })
    var btnDelete = $('.btnDelete');
    $('[data-toggle=confirmation]').confirmation({
      rootSelector: '[data-toggle=confirmation]',
      // other options
      onConfirm: function() {
        location.href = 'index.html'
      },
      onCancel: function() {
        //alert('You didn\'t choose');
      },
    });
  });
