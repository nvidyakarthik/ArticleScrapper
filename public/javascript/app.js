// Whenever someone clicks a save article button
$(document).on("click", "#saveArticle", function() {
 
  // Save the id from the button tag
  var thisId = $(this).attr("data-id");
  var button=$(this);
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articleSaved/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
     //after success remove the panel 
     //button.parent().parent().parent().remove();
     button.text("SAVED !!!");
     button.attr('disabled','disabled');
         
    });
});

// Whenever someone clicks a delete article button
$(document).on("click", "#delArticle", function() {
 
  // Save the id from the button tag
  var thisId = $(this).attr("data-id");
  var button=$(this);

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/removeSaved/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
     //after success remove the panel 
     button.parent().parent().parent().remove();
     //console.log(data.message);
      $("#alertModal").modal("show");
    });    
         
});

/* //This function is triggered when modal hides
$(document).on('hidden.bs.modal', '#alertModal', function(event) {
  location.reload();
}) */

//onclick function for scrape new articles
 // $(document).on("click", "#linkId", function() {
  function scrape(link){  
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/scrapeArticles"
  })
    // With that done, add the note information to the page
    .then(function(data) {         
      location.reload(true);   
    });
}

//This is for modal showing with object id
$(document).on('show.bs.modal', '#notesModal', function(event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var articleId = button.data('id'); // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)
  modal.find('.modal-title').text('Article Notes');
  modal.find('.saveNoteBtn').attr('data-id',articleId);
 
// Now make an ajax call for the Article
$.ajax({
  method: "GET",
  url: "/getNotes/" + articleId
})
  // With that done, add the note information to the page
  .then(function(data) {
    console.log(data);
    // checking if the article has notes
    if (data.notes.length!==0) {
      $("#notes-form").find("#noNotes").remove();
      $.each(data.notes, function( index, value ) {
        $("#notes-form").prepend("<div class='well mynotes'><span>" + value.message + "</span><span class='glyphicon glyphicon-remove delNoteBtn' id='"+value._id+"'></span></div>");
      });
    }
    else{
      $("#notes-form").prepend("<div class='well' id='noNotes'>No Notes for this Article yet.</div>");

    }
  });
});

//This function is triggered when modal hides
$(document).on('hidden.bs.modal', '#notesModal', function(event) {
  $(".mynotes").remove();
  $("#notes-form").find("#noNotes").remove();
  $('#notesinput').val('');
});


// Whenever someone clicks a save note button
$(document).on("click", ".saveNoteBtn", function() {
 
  // Save the id from the button tag
  var articleId = $(this).attr("data-id");
  var noteText=$("#notesinput").val().trim();
  if(noteText!==""){
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/saveNote/" + articleId,
    data: {
      // Value taken from notes input
      message: noteText,
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      $('#notesModal').modal('hide');
      
    });
  }

  // Also, remove the values entered in the input and textarea for note entry
  /* /$("#titleinput").val("");*/
  
});

// Whenever someone clicks a save note button
$(document).on("click", ".delNoteBtn", function() {
 
  // Save the id from the button tag
  var noteId = $(this).attr("id");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "GET",
    url: "/deleteNote/" + noteId,
    })
    // With that done
    .then(function(data) {
      // Log the response
      $('#'+noteId).parent().remove();
      // Empty the notes section
     // $("#notesList").value(data.message);
    });

  // Also, remove the values entered in the input and textarea for note entry
  /* /$("#titleinput").val("");*/
  
});

