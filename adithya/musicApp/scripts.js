const apiUrl = 'https://your-api-url.com'; // Replace with your Render API URL

async function createPlaylist() {
    const name = document.getElementById('playlist-name').value;
    if (!name) return alert('Please enter a playlist name.');

    const response = await fetch(`${apiUrl}/playlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });

    if (response.ok) {
        alert('Playlist created successfully.');
        loadPlaylists();
    } else {
        alert('Failed to create playlist.');
    }
}

async function loadPlaylists() {
    const response = await fetch(`${apiUrl}/playlists`);
    const playlists = await response.json();
    const playlistsDiv = document.getElementById('playlists');
    playlistsDiv.innerHTML = '';

    playlists.forEach(playlist => {
        const div = document.createElement('div');
        div.textContent = playlist.name;
        div.onclick = () => selectPlaylist(playlist.id);
        playlistsDiv.appendChild(div);
    });
}

function selectPlaylist(playlistId) {
    // Redirect to player page with selected playlist
    window.location.href = `player.html?playlist=${playlistId}`;
}

async function loadPlaylistSongs() {
    const urlParams = new URLSearchParams(window.location.search);
    const playlistId = urlParams.get('playlist');
    if (!playlistId) return alert('No playlist selected.');

    const response = await fetch(`${apiUrl}/playlists/${playlistId}/songs`);
    const songs = await response.json();
    const playlistDiv = document.getElementById('playlist');
    playlistDiv.innerHTML = '';

    songs.forEach(song => {
        const div = document.createElement('div');
        div.textContent = `${song.title} by ${song.artist}`;
        div.onclick = () => playSong(song.url);
        playlistDiv.appendChild(div);
    });
}

function playSong(url) {
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.src = url;
    audioPlayer.play();
}

function playPause() {
    const audioPlayer = document.getElementById('audio-player');
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
}

// Initialize playlists on index page
if (document.getElementById('playlists')) {
    loadPlaylists();
}

// Initialize songs on player page
if (document.getElementById('playlist')) {
    loadPlaylistSongs();
}
