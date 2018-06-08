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