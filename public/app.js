// Whenever someone clicks a save article button
$(document).on("click", "#saveArticle", function() {
 
  // Save the id from the button tag
  var thisId = $(this).attr("data-id");
  alert(thisId);
  var button=$(this);

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articleSaved/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
     //after success remove the panel 
     button.parent().parent().remove();
         
    });
});

// Whenever someone clicks a delete article button
$(document).on("click", "#delArticle", function() {
 
  // Save the id from the button tag
  var thisId = $(this).attr("data-id");
  alert(thisId);
  var button=$(this);

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/removeSaved/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
     //after success remove the panel 
     button.parent().parent().remove();
         
    });
});

//This is for modal showing message id
$(document).on('show.bs.modal', '#exampleModal', function(event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var recipient = button.data('id') // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)
  modal.find('.modal-title').text('New message to ' + recipient)
  modal.find('.modal-body input').val(recipient)
})
