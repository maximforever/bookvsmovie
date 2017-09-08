$(document).ready(function() {

    /* onload */
        var results = {}
        var bookIndex = 0
        var movieIndex = 0

    /* search */
        $("#search_form").on("submit",function() {
            console.log("here")
            var query = $("#search_name").val()

             $.ajax({
                type: "post",
                url: "/",
                data: {
                    name: query
                },
                success: function(result) {
                    if (result) {
                        results = result
                        console.log(results)
                        displayBook(bookIndex)
                        displayMovie(movieIndex)
                    }
                    else {
                        console.log("no results")
                    }
                }
            })
        })

    /* displayBook */
        function displayBook(index) {
            var book = results.books[index]

            $("#book")
            $("#book .rating").text(book.rating)
            $("#book .ratingCount").text(book.rating_count)
            $("#book .title").text(book.title).attr("href", book.url)
            $("#book .year").text(book.year)
            $("#book .author").text(book.author)
            $("#book .image").css("background-image", "url(" + book.image + ")")
            $("#book .resultIndex").text(index + 1)
            $("#book .resultCount").text(results.books.length)
        }

    /* displayMovie */
        function displayMovie(index) {
            var movie = results.movies[index]

            $("#movie .rating").text(movie.rating)
            $("#movie .ratingCount").text(movie.rating_count)
            $("#movie .title").text(movie.title).attr("href", movie.url)
            $("#movie .year").text(movie.year)
            $("#movie .director").text(movie.director)
            $("#movie .image").css("background-image", "url(" + movie.image + ")")
            $("#movie .resultIndex").text(index + 1)
            $("#movie .resultCount").text(results.movies.length)
        }

    /* listeners */
        $("#book .left").on("click", function () {
            bookIndex--

            if (bookIndex < 0) {
                bookIndex = results.books.length - 1
            }

            displayBook(bookIndex)
        })

        $("#book .right").on("click", function () {
            bookIndex++
            
            if (bookIndex >= results.books.length) {
                bookIndex = 0
            }

            displayBook(bookIndex)
        })

        $("#movie .left").on("click", function () {
            movieIndex--

            if (movieIndex < 0) {
                movieIndex = results.movies.length - 1
            }

            displayMovie(movieIndex)
        })

        $("#movie .right").on("click", function () {
            movieIndex++
            
            if (movieIndex >= results.movies.length) {
                movieIndex = 0
            }

            displayMovie(movieIndex)
        })

})
