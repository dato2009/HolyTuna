const songsContainer = document.getElementById("songsContainer");
const searchInput = document.getElementById("songSearch");

let songs = [];

async function loadSongs() {
    try {
        const response = await fetch("./chords-db.json");
        songs = await response.json();

        renderSongs(songs);
    }
    catch(err) {
        console.error(err);
    }
}

function renderSongs(songList) {

    songsContainer.innerHTML = "";

    songList.forEach(song => {

        const card = document.createElement("article");

        card.classList.add("song-card");

        card.innerHTML = `
            <div class="song-header">
                <h2>${song.title}</h2>
                <span class="difficulty ${song.difficulty.toLowerCase()}">
                    ${song.difficulty}
                </span>
            </div>

            <div class="song-meta">
                <span>${song.artist}</span>
                <span>Capo: ${song.capo}</span>
            </div>

            <div class="chord-list">
                ${song.chords.map(chord =>
                    `<span>${chord}</span>`
                ).join("")}
            </div>

            <pre class="lyrics">${song.lyrics}</pre>
        `;

        songsContainer.appendChild(card);
    });
}

searchInput.addEventListener("input", () => {

    const search = searchInput.value.toLowerCase();

    const filtered = songs.filter(song =>
        song.title.toLowerCase().includes(search) ||
        song.artist.toLowerCase().includes(search)
    );

    renderSongs(filtered);
});

loadSongs();