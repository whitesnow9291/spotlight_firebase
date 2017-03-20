function validateForm(){
  var flag = true;
  $('form input').each(function(){
      if($(this).prop('required')){
      console.log($(this).prop('id')+": "+$(this).val());
          if($.trim($(this).val())=="")
          flag= false;
      }

  });
  $('form select').each(function(){
      if($(this).prop('required')){
      console.log($(this).prop('id')+": "+$(this).val());
          if($.trim($(this).val())=="-1")
          flag = false
      }

  });
  return flag;
}
