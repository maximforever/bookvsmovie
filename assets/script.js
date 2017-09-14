$(document).ready(function() {

    /* onload */
        var results = {}
        var bookIndex = 0
        var movieIndex = 0

        if($(window).width() < 980){
            $("#search_name").attr("placeholder", "search");
        }

    /* search */
        $("#search_form").on("submit",function() {
            var query = $("#search_name").val().trim()

            if (query) {
                $("#search_form, #search_name, #search_submit").prop("disabled", true)
                $("#search_name").css("background-color", "lightgray")
                $("#search_submit").addClass("hidden");
                $("#loading-container").removeClass("hidden");

                $.ajax({
                    type: "post",
                    url: "/",
                    data: {
                        name: query
                    },
                    success: function(result) {

                        $("#movie-column, #book-column").removeClass("hidden");

                        console.log("result");
                        console.log(result);

                        if (result) {
                            results = result
                            bookIndex = movieIndex = 0
                            displayBook(bookIndex)
                            displayMovie(movieIndex);

                        } else {
                            console.log("no results")
                        }

                        $("#search_form, #search_name, #search_submit").prop("disabled", false)
                        $("#search_name").css("background-color", "white")
                        $("#search_submit").removeClass("hidden");
                        $("#loading-container").addClass("hidden");

                    }
                })
            }
        })


        function getFontSize(titleText){

            var titleFontSize;

            var textLength = titleText.length;


            if($(window).width() < 980){
                titleFontSize = 3 - 0.038 * textLength;

                if(titleFontSize < 1) { 
                    titleFontSize = 1
                }

            } else {
                console.log("desktop");
                if(textLength < 20){
                    console.log("short text: " + textLength);
                    titleFontSize = 3.6 - 0.065 * textLength;
                } else {
                    console.log("long text: " + textLength);
                    titleFontSize = 2.2 - 0.029*textLength;  
                }

                if(titleFontSize < 1.2) { 
                    titleFontSize = 1.2
                }     
            }

            /*
            var titleArray = titleText.split(" ");
            var longestWord = "";
            for(var i = 0; i <  titleArray.length; i++){
                if(titleArray[i].length > longestWord.length){
                    longestWord = titleArray[i];
                }
            }

            

            if($(window).width()< 980){
                titleFontSize = 3 - 0.16 * longestWord.length;
            } else {
                titleFontSize = 3.6 - 0.16 * longestWord.length;
            }
            
            console.log("titleFontSize " + titleFontSize);
*/
            return titleFontSize;
        }

    /* displayBook */
        function displayBook(index) {

            if(!results.booksFound) {
                console.log("No books to display")

                $("#book").addClass("hidden");;
                $("#book-error").removeClass("hidden");
                // error
            } else {
                $("#book").removeClass("hidden");
                $("#book-error").addClass("hidden");;

                var book = results.books[index]

                if(!book.rating){
                    $("#book .rating").text("N/A")
                } else {
                    $("#book .rating").text(book.rating.toFixed(1))
                }
                $("#book .ratingCount").text(book.rating_count || 0)
                var bookTitleSize = getFontSize(book.title);
                $("#book .title").text(book.title).attr("href", book.url).css("font-size", bookTitleSize + "em");
                $("#book .year").text(book.year)
                $("#book .author").text(book.author)
                $("#book .resultIndex").text(index + 1)
                $("#book .resultCount").text(results.books.length)

                /* highlight the winning title */
                if(results.moviesFound){
                    if(book.rating > results.movies[movieIndex].rating){
                        $("#movie").css("box-shadow", "none");
                        $("#movie-column .result-header").css("background-color", "#dedeaf");
                        $("#book").css("box-shadow", "inset 0px 0px 25px #fbfb61");
                        $("#book-column .result-header").css("background-color", "#fbfb61");
                    } else if (book.rating < results.movies[movieIndex].rating) {
                        $("#book").css("box-shadow", "none");
                        $("#book-column .result-header").css("background-color", "#dedeaf");
                        $("#movie").css("box-shadow", "inset 0px 0px 25p #fbfb61");
                        $("#movie-column .result-header").css("background-color", "#fbfb61");
                    } else {
                        $("#movie-column .result-header").css("background-color", "#dedeaf");
                        $("#book-column .result-header").css("background-color", "#dedeaf");
                        $("#movie").css("box-shadow", "none");
                        $("#book").css("box-shadow", "none");
                    }
                }
                
                if (book.image.length) {
                    $("#book.image").css("background-image", "url(" + book.image + ")")
                } else {
                    $("#book.image").css("background-image", "").css("background-color", "lightgray")
                }
            }
        }

    /* displayMovie */
        function displayMovie(index) {

            if(!results.moviesFound) {
                console.log("No movies to display")

                $("#movie").addClass("hidden");;
                $("#movie-error").removeClass("hidden");

                // error
            } else {

                $("#movie").removeClass("hidden");
                $("#movie-error").addClass("hidden");;

                var movie = results.movies[index]

                if(!movie.rating){
                    $("#movie .rating").text("N/A")
                } else {
                    $("#movie .rating").text(movie.rating.toFixed(1))
                }
                $("#movie .ratingCount").text(movie.rating_count || 0)
                var movieTitleSize = getFontSize(movie.title);
                $("#movie .title").text(movie.title).attr("href", movie.url).css("font-size", movieTitleSize + "em");
                $("#movie .year").text(movie.year)
                $("#movie .director").text(movie.director)
                $("#movie .resultIndex").text(index + 1)
                $("#movie .resultCount").text(results.movies.length)

                /* highlight the winning title */
                if(results.booksFound){
                    if(movie.rating > results.books[bookIndex].rating){
                        $("#book").css("box-shadow", "none");
                        $("#book-column .result-header").css("background-color", "#dedeaf");
                        $("#movie").css("box-shadow", "inset 0px 0px 25px #fbfb61");
                        $("#movie-column .result-header").css("background-color", "#fbfb61");
                    } else if (movie.rating < results.books[bookIndex].rating) {
                        $("#movie").css("box-shadow", "none");
                        $("#movie-column .result-header").css("background-color", "#dedeaf");
                        $("#book").css("box-shadow", "inset 0px 0px 25px #fbfb61");
                        $("#book-column .result-header").css("background-color", "#fbfb61");
                    } else {
                        $("#movie-column .result-header").css("background-color", "#dedeaf");
                        $("#book-column .result-header").css("background-color", "#dedeaf");
                        $("#movie").css("box-shadow", "none");
                        $("#book").css("box-shadow", "none");
                    }
                }

                if (movie.image.length) {
                    $("#movie.image").css("background-image", "url(" + movie.image + ")")
                } else {
                    $("#movie.image").css("background-image", "").css("background-color", "lightgray")
                }
            }
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
