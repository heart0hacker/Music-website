console.log("we are starting to write JS")
let currentSong = new Audio();
let songs;
let currFolder;

const playButton = document.getElementById("play");
const previous = document.getElementById("previous");
const next = document.getElementById("next");

function secondsTominutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`
}

async function getsongs(folder) {
    currFolder = folder
    try {
        let a = await fetch(`/${folder}/`)
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response
        let as = div.getElementsByTagName("a")
        songs = [];
        for (let index = 0; index < as.length; index++) {
            const e = as[index];
            if (e.href.endsWith(".mp3")) {
                songs.push(decodeURI(e.href.split(`/${folder}/`)[1]))
            }
        }
    } catch (error) {
        console.error("Error fetching songs:", error);
        alert("Could not fetch songs. Please try again later.");
    }
    // Show all the songs in the playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    let htmlContent = "";
    for (const song of songs) {
        htmlContent += `<li>
                      <div class="beforeplay">
                        <img class="invert" src="Images/music.svg" alt="music">
                        <div class="info">
                          <h3>${song.replaceAll("%20", " ")}</h3>
                          <p>response.listname</p>
                        </div>
                      </div>
                      <div class="playnow">
                        <img class="invert" src="Images/play.svg" alt="play">
                      </div>
                    </li>`;
    }
    songul.innerHTML = htmlContent;

    // Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    // Add scroll effect for song titles
    // document.querySelectorAll('.info > h3').forEach(songNameElement => {
    //     songNameElement.addEventListener('mouseenter', () => {
    //         let songWidth = songNameElement.scrollWidth;
    //         let containerWidth = songNameElement.offsetWidth;

    //         if (songWidth > containerWidth) {
    //             songNameElement.style.transform = `translateX(-${songWidth - containerWidth}px)`;
    //         }
    //     });

    //     songNameElement.addEventListener('mouseleave', () => {
    //         songNameElement.style.transform = 'translateX(0)';
    //     });

    // });

    return songs;
}


const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        playButton.src = "Images/pause.svg"
        // Remove "playing" class from any currently playing item
        document.querySelectorAll(".songlist ul li.playing").forEach(item => {
            item.classList.remove("playing")
        })
        // Add the "playing" class to the corresponding list item
        const listItem = Array.from(document.querySelectorAll(".songlist ul li"))
        const playingItem = listItem.find(li => {
            const h3 = li.querySelector("h3")
            return h3 && h3.textContent.trim() === track.replaceAll("%20", " ")
        })
        if (playingItem) {
            playingItem.classList.add("playing")
        }
        else {
            currentSong.pause()
            playButton.src = "Images/play.svg"
        }
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}

async function displayAlbums() {
    console.log("displaying albums");
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".container")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes(`/songs`) && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]

            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            let htmlContent = "";
            htmlContent += `<div data-folder="${folder}" class="card">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                stroke-linejoin="round" />
                        </svg>
                        <img src="songs/${folder}/cover.jpg" alt="Cover">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`
            cardcontainer.innerHTML += htmlContent;
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })
}



async function getsongs2(folder) {
    currFolder = folder
    try {
        let a = await fetch(`/${folder}/`)
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response
        let as = div.getElementsByTagName("a")
        songs = [];
        for (let index = 0; index < as.length; index++) {
            const e = as[index];
            if (e.href.endsWith(".mp3")) {
                songs.push(decodeURI(e.href.split(`/${folder}/`)[1]))
            }
        }
    } catch (error) {
        console.error("Error fetching songs:", error);
        alert("Could not fetch songs. Please try again later.");
    }
    // Show all the songs in the playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    let htmlContent = "";
    for (const song of songs) {
        htmlContent += `<li>
                      <div class="beforeplay">
                        <img class="invert" src="Images/music.svg" alt="music">
                        <div class="info">
                          <h3>${song.replaceAll("%20", " ")}</h3>
                          <p>song artist</p>
                        </div>
                      </div>
                      <div class="playnow">
                        <img class="invert" src="Images/play.svg" alt="play">
                      </div>
                    </li>`;
    }
    songul.innerHTML = htmlContent;

    // Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    return songs;
}

async function displayArtist() {
    console.log("Displaying songs")
    let a = await fetch(`/artist/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let container = document.querySelector(".container2")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element.href.includes("/artist")) {
            let folder = element.href.split("/").slice(-2)[0]

            // Get the metadata of the folder
            let a = await fetch(`/artist/${folder}/info2.json`)
            let response = await a.json();
            container.innerHTML = container.innerHTML + `<div data-folder="${folder}" class="card2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                stroke-linejoin="round" />
                        </svg>
                        <img src="artist/${folder}/cover.jpg" alt="Cover">
                        <h3>${response.Name}</h3>
                        <p>${response.Work}</p>
                    </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card2")).forEach(e => {
        e.addEventListener("click", async item => {
            artist = await getsongs2(`artist/${item.currentTarget.dataset.folder}`)
            playMusic(artist[0])
        })
    })
}

async function main() {
    // Get the list of all the songs
    await getsongs("songs/a")
    playMusic(songs[0], true)

    // Display all the albums on the page
    await displayAlbums()

    // Display all the albums on the page
    await displayArtist()


    //defaultVolume:
    let volumeSlider = document.querySelector(".range").getElementsByTagName("input")[0]
    currentSong.volume = 0.5
    volumeSlider.value = currentSong.volume * 100

    // Attach an event listener to play, next and previous
    play.addEventListener("click", e => {
        if (currentSong.paused) {
            currentSong.play()
            playButton.src = "images/pause.svg"
        } else {
            currentSong.pause()
            playButton.src = "images/play.svg"
        }
    })


    // Add an event listener to seekbar
    const updateSeekBar = () => {
        const progressBar = document.querySelector(".progress");
        const circle = document.querySelector(".circle");

        const duration = currentSong.duration;
        const currentTime = currentSong.currentTime;

        const progressPercentage = (currentTime / duration) * 100;

        // Update the played part of the seek bar
        progressBar.style.width = `${progressPercentage}%`;

        // Move the circle
        circle.style.left = `calc(${progressPercentage}% - 10px)`; // Adjust with half of circle width for positioning

    };

    currentSong.addEventListener("timeupdate", updateSeekBar);
    const seekBarContainer = document.querySelector(".seekbar");
    seekBarContainer.addEventListener("click", (e) => {
        const rect = seekBarContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const seekBarWidth = rect.width;
        const clickPercentage = clickX / seekBarWidth;
        currentSong.currentTime = clickPercentage * currentSong.duration;
        updateSeekBar();
    });




    // Add an event listener for hamburger
    document.querySelector(".hamburger>img").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    // Add an event listener for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-130%"
    })

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause();
        console.log("previous clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    //add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("next clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //add an even listener for timeUpdate
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsTominutesSeconds(currentSong.currentTime)} / ${secondsTominutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    //add an event listener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    //add an event listener for mute
    document.querySelector(".volume > img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10
        }
    })

    //add an event listener to search:
    let textInput = document.querySelector(".search input")
    textInput.addEventListener("click", e => {
        e.target.classList.add("text");
    })
    textInput.addEventListener("blur", e => {
        e.target.classList.remove("text")
    })

    let searchIcon = document.querySelector(".search")
    searchIcon.addEventListener("click", e=>{
        e.target.classList.add("active")
    })
    searchIcon.addEventListener("blur", e=>{
        e.target.classList.remove("active")
    })

    function handleKeyPress(event) {
        const volumeSlider = document.querySelector(".volume input");
        const seekbar = document.querySelector(".seekbar");
        const circle = document.querySelector(".circle");
        event.preventDefault();

        switch (event.key) {
            case "ArrowDown":
                if (currentSong.volume > 0) {
                    currentSong.volume = Math.max(0, currentSong.volume - 0.05);
                    volumeSlider.value = currentSong.volume * 100;
                    if (currentSong.volume === 0) {
                        document.querySelector(".volume>img").src = "Images/mute.svg";
                    }
                }
                break;

            case "ArrowUp":
                if (currentSong.volume < 1) {
                    currentSong.volume = Math.min(1, currentSong.volume + 0.05);
                    volumeSlider.value = currentSong.volume * 100;
                    if (currentSong.volume > 0) {
                        document.querySelector(".volume>img").src = "Images/volume.svg";
                    }
                }
                break;

            case " ":
                if (currentSong.paused) {
                    currentSong.play();
                    play.src = "Images/pause.svg";
                } else {
                    currentSong.pause();
                    play.src = "Images/play.svg";
                }
                break;

            case "m":
                let volumeIcon = document.querySelector(".volume>img");
                volumeIcon.click();
                break;

            case "ArrowRight":
                // Increase the current time by 5 seconds
                currentSong.currentTime = Math.min(currentSong.duration, currentSong.currentTime + 5);
                updateSeekbar();
                break;

            case "ArrowLeft":
                // Decrease the current time by 5 seconds
                currentSong.currentTime = Math.max(0, currentSong.currentTime - 5);
                updateSeekbar();
                break;

            default:
                console.log(`Key Pressed: ${event.key}`);
                break;
        }

        // Function to update the seekbar and circle position
        function updateSeekbar() {
            const progress = (currentSong.currentTime / currentSong.duration) * 100;
            seekbar.value = progress; // Assuming seekbar is a range input

            // Update the circle position based on the progress
            const circlePosition = progress + "%";
            circle.style.left = circlePosition;
        }
    }

    window.addEventListener("keydown", handleKeyPress);


}

main()
