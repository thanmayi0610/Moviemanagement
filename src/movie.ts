import fs from "fs";
import readlineSync from "readline-sync";

const FILE_PATH = "movies.json";

interface Movie {
    id: number;
    title: string;
    director: string;
    releaseYear: number;
    genre: string;
    ratings: number[];
}

// Load movies from JSON file
function loadMovies(): Movie[] {
    try {
        const data = fs.readFileSync(FILE_PATH, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return []; // Return empty if file doesn't exist
    }
}

// Save movies to JSON file
function saveMovies(movies: Movie[]): void {
    fs.writeFileSync(FILE_PATH, JSON.stringify(movies, null, 2), "utf-8");
}

let movies: Movie[] = loadMovies(); // Load movies on startup

function addMovie(): void {
    const title = readlineSync.question("Enter movie title: ").trim().toLowerCase();

    // Check if movie already exists
    const existingMovie = movies.find(m => m.title.toLowerCase() === title);
    if (existingMovie) {
        console.log("Movie already exists in the database!");
        return;
    }

    const director = readlineSync.question("Enter director: ");
    const releaseYear = parseInt(readlineSync.question("Enter release year: "), 10);
    const genre = readlineSync.question("Enter genre: ");

    const id = Math.floor(Math.random() * 1000);
    movies.push({ id, title, director, releaseYear, genre, ratings: [] });

    saveMovies(movies);
    console.log(`Movie Added Successfully! (ID: ${id})\n`);
}

function rateMovie() {
    const id = parseInt(readlineSync.question("Enter movie ID to rate: "), 10);
    const movie = movies.find(m => m.id === id);

    if (!movie) {
        console.log("Movie not found! Use option 10 to list movies with IDs.");
        return;
    }

    const rating = parseFloat(readlineSync.question("Enter rating (1-5): "));

    if (isNaN(rating) || rating < 1 || rating > 5) {
        console.log("Invalid rating! Please enter a number between 1 and 5.");
        return;
    }

    movie.ratings.push(rating);
    console.log(`Rating added successfully! Current average: ${(movie.ratings.reduce((a, b) => a + b, 0) / movie.ratings.length).toFixed(2)}`);
}

function getAverageRating(): void {
    const id = parseInt(readlineSync.question("Enter movie ID: "), 10);
    const movie = movies.find(m => m.id === id);

    if (!movie) {
        console.log("Movie not found! Use option 10 to list movies with IDs.");
        return;
    }

    const avgRating = movie.ratings.length ? (movie.ratings.reduce((a, b) => a + b, 0) / movie.ratings.length).toFixed(2) : "No Ratings";
    console.log(`Average Rating: ${avgRating}\n`);
}

function getTopRatedMovies(): void {
    const topMovies = [...movies].sort((a, b) => {
        const avgA = a.ratings.length ? a.ratings.reduce((x, y) => x + y, 0) / a.ratings.length : 0;
        const avgB = b.ratings.length ? b.ratings.reduce((x, y) => x + y, 0) / b.ratings.length : 0;
        return avgB - avgA;
    });

    console.table(topMovies);
}

function getMoviesByGenre(): void {
    const genre = readlineSync.question("Enter genre: ").toLowerCase();
    const filteredMovies = movies.filter(m => m.genre.toLowerCase() === genre);

    if (filteredMovies.length) console.table(filteredMovies);
    else console.log("No movies found!");
}

function getMoviesByDirector(): void {
    const director = readlineSync.question("Enter director: ").toLowerCase();
    const filteredMovies = movies.filter(m => m.director.toLowerCase() === director);

    if (filteredMovies.length) console.table(filteredMovies);
    else console.log("No movies found!");
}

function searchMoviesBasedOnKeyword(): void {
    const keyword = readlineSync.question("Enter keyword: ").toLowerCase();
    const filteredMovies = movies.filter(m => m.title.toLowerCase().includes(keyword));

    if (filteredMovies.length) console.table(filteredMovies);
    else console.log("No movies found!");
}

function getMovie(): void {
    const id = parseInt(readlineSync.question("Enter movie ID: "), 10);
    const movie = movies.find(m => m.id === id);

    if (movie) console.table([movie]);
    else console.log("Movie not found! Use option 10 to list movies with IDs.");
}

function removeMovie(): void {
    const id = parseInt(readlineSync.question("Enter movie ID: "), 10);
    const index = movies.findIndex(m => m.id === id);

    if (index === -1) {
        console.log("Movie not found! Use option 10 to list movies with IDs.");
        return;
    }

    movies.splice(index, 1);
    saveMovies(movies);
    console.log("Movie removed successfully!\n");
}

function listMoviesWithIDs(): void {
    if (movies.length === 0) {
        console.log("No movies found!");
        return;
    }

    console.log("\nList of Movies with IDs:");
    console.table(movies.map(({ id, title }) => ({ ID: id, Title: title })));
}

function main(): void {
    while (true) {
        console.log("\nMovies Management System");
        console.log("1. Add Movie");
        console.log("2. Rate a Movie");
        console.log("3. Get Average Rating");
        console.log("4. Get Top Rated Movies");
        console.log("5. Get Movies by Genre");
        console.log("6. Get Movies by Director");
        console.log("7. Search Movies by Title");
        console.log("8. Get Movie Details");
        console.log("9. Remove Movie");
        console.log("10. List Movies with IDs");
        console.log("11. Exit");

        const choice = parseInt(readlineSync.question("Enter your choice: "), 10);

        switch (choice) {
            case 1: addMovie(); break;
            case 2: rateMovie(); break;
            case 3: getAverageRating(); break;
            case 4: getTopRatedMovies(); break;
            case 5: getMoviesByGenre(); break;
            case 6: getMoviesByDirector(); break;
            case 7: searchMoviesBasedOnKeyword(); break;
            case 8: getMovie(); break;
            case 9: removeMovie(); break;
            case 10: listMoviesWithIDs(); break;
            case 11: console.log("Goodbye!"); return;
            default: console.log("Invalid choice! Try again.");
        }
    }
}

main();