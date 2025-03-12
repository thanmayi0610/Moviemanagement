import fs from "fs";
import readlineSync from "readline-sync";

const FILE_PATH = "movies.json";
const GENRES = ["Action", "Drama", "Comedy", "Thriller", "Horror", "Sci-Fi", "Romance", "Adventure"];

interface Movie {
    id: number;
    title: string;
    director: string;
    releaseYear: number;
    genreVotes: Record<string, number>;
    ratings: number[];
}

function loadMovies(): Movie[] {
    try {
        const data = fs.readFileSync(FILE_PATH, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveMovies(movies: Movie[]): void {
    fs.writeFileSync(FILE_PATH, JSON.stringify(movies, null, 2), "utf-8");
}

let movies: Movie[] = loadMovies();

function addMovie(): void {
    const title = readlineSync.question("Enter movie title: ").trim().toLowerCase();

    if (movies.some(m => m.title.toLowerCase() === title)) {
        console.log("Movie already exists.");
        return;
    }

    const director = readlineSync.question("Enter director: ");
    const releaseYear = parseInt(readlineSync.question("Enter release year: "), 10);

    const genreVotes: Record<string, number> = {};
    GENRES.forEach(genre => genreVotes[genre] = 0);

    const id = Math.floor(Math.random() * 1000);
    movies.push({ id, title, director, releaseYear, genreVotes, ratings: [] });

    saveMovies(movies);
    console.log("Movie added.");
}

function voteGenre(): void {
    const title = readlineSync.question("Enter movie title: ").trim();
    const movie = movies.find(m => m.title.toLowerCase() === title.toLowerCase());

    if (!movie) {
        console.log("Movie not found.");
        return;
    }

    console.log("Select a genre:");
    GENRES.forEach((genre, index) => console.log(`${index + 1}. ${genre}`));

    const choice = parseInt(readlineSync.question("Enter your choice: "), 10);
    if (choice < 1 || choice > GENRES.length) {
        console.log("Invalid choice.");
        return;
    }

    const selectedGenre = GENRES[choice - 1];
    movie.genreVotes[selectedGenre]++;

    saveMovies(movies);
    console.log("Vote added.");
}

function getMovieGenre(): void {
    const title = readlineSync.question("Enter movie title: ").trim();
    const movie = movies.find(m => m.title.toLowerCase() === title.toLowerCase());

    if (!movie) {
        console.log("Movie not found.");
        return;
    }

    const sortedGenres = Object.entries(movie.genreVotes)
        .sort(([, votesA], [, votesB]) => votesB - votesA);

    const mostVotedGenre = sortedGenres.length && sortedGenres[0][1] > 0 ? sortedGenres[0][0] : "No votes yet";

    console.log("Most voted genre: " + mostVotedGenre);
}

function rateMovie() {
    const id = parseInt(readlineSync.question("Enter movie ID to rate: "), 10);
    const movie = movies.find(m => m.id === id);

    if (!movie) {
        console.log("Movie not found.");
        return;
    }

    const rating = parseFloat(readlineSync.question("Enter rating (1-5): "));
    if (isNaN(rating) || rating < 1 || rating > 5) {
        console.log("Invalid rating.");
        return;
    }

    movie.ratings.push(rating);
    console.log("Rating added.");

    saveMovies(movies);
}

function getAverageRating(): void {
    const id = parseInt(readlineSync.question("Enter movie ID: "), 10);
    const movie = movies.find(m => m.id === id);

    if (!movie) {
        console.log("Movie not found.");
        return;
    }

    const avgRating = movie.ratings.length ? (movie.ratings.reduce((a, b) => a + b, 0) / movie.ratings.length).toFixed(2) : "No ratings";
    console.log("Average Rating: " + avgRating);
}

function listMoviesWithIDs(): void {
    if (movies.length === 0) {
        console.log("No movies found.");
        return;
    }

    console.log("List of Movies:");
    movies.forEach(movie => console.log(`${movie.id}: ${movie.title}`));
}

function main(): void {
    while (true) {
        console.log("\nMovie Management System");
        console.log("1. Add Movie");
        console.log("2. Vote for Movie Genre");
        console.log("3. Get Most Voted Genre");
        console.log("4. Rate a Movie");
        console.log("5. Get Average Rating");
        console.log("6. List Movies with IDs");
        console.log("7. Exit");

        const choice = parseInt(readlineSync.question("Enter your choice: "), 10);

        switch (choice) {
            case 1: addMovie(); break;
            case 2: voteGenre(); break;
            case 3: getMovieGenre(); break;
            case 4: rateMovie(); break;
            case 5: getAverageRating(); break;
            case 6: listMoviesWithIDs(); break;
            case 7: return;
            default: console.log("Invalid choice.");
        }
    }
}

main();
