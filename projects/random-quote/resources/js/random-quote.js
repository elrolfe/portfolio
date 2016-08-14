$(document).ready(function() {
  $("#get-quote").on("click", getNewQuote);
  getNewQuote();
});

function getNewQuote() {
  $.ajax({
    url: 'https://andruxnet-random-famous-quotes.p.mashape.com/?cat=movies',
    type: 'GET',
    dataType: 'json',
    success: function(data) { 
      $(".quote blockquote").text(data["quote"]);
      $(".quote p").text(data["author"]);
      $("#twitter-wrapper iframe").remove();
      var newButton = $("<a>Tweet</a>")
        .addClass("twitter-share-button")
        .attr("href", "https://twitter.com/intent/tweet")
        .attr("data-size", "large")
        .attr("data-url", "http://freecodecamp.com")
        .attr("data-text", '"' + data["quote"] + '" - ' + data["author"]);
      $("#twitter-wrapper").append(newButton);
      twttr.widgets.load();
    },
    beforeSend: function(xhr) {
    xhr.setRequestHeader("X-Mashape-Authorization", "cmVNHIQXmQmshL7kkg9rgUFlGIi4p1TdPCAjsnxt8FXiEk9Gwv");
    }
  });
}