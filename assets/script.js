$(document).ready(function() {


    console.log("Page loaded!");

    /* search movie */
        $("#movie_form").on("submit",function() {
            console.log("getting movie data");
            var query = $("#movie_name").val()
            
            $.ajax({
                type: "post",
                url: "/",
                data: {
                    category: "movie",
                    name: query
                },
                success: function(result) {
                    
                    console.log("------")
                    result = JSON.parse(result);
                    console.log(result)
                    console.log("The rating for " + result[0].title + " is " + result[0].rating);
                }
            })

        })

    /* search book */
        $("#book_form").on("submit",function() {
            console.log("getting book data");
            var query = $("#book_name").val()

             $.ajax({
                type: "post",
                url: "/",
                data: {
                    category: "book",
                    name: query
                },
                success: function(result) {
                    console.log(result)
                }
            })
        })




})
