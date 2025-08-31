console.log('strating js');

let currentSong = new Audio();

let songs;

function secToMinSec(seconds){
    if(isNaN(seconds) || seconds < 0){
        return "00:00"
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds= Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2 ,'0');
    return `${formattedMinutes}:${formattedSeconds}`
}

async function getSongs(){
    let a = await fetch("./songs/");
    let response=await a.text();
    await fetch("./songs/")
    let div = document.createElement("div")
    div.innerHTML =response;
    let as = div.getElementsByTagName("a")
    let songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}



const playMusic = (track, pause=false)=>{
    currentSong.src = "/Spotiify/songs/" + encodeURIComponent(track)
    if(!pause){
        currentSong.play()
        play.src ="pauses.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 | 00:00"
} 

async function main(){

    
    //Get all songs list
    songs= await getSongs()
    
    playMusic(songs[0] ,true)

   let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML =songUL.innerHTML + `
        <li>
              <img class="invert music" src="music.svg" alt="">
              <div class="info">
                <div>${song.replaceAll("%20" ," ")}</div>
                <div>Farooq</div>
              </div>
              <span class="playnow">Play Now</span>
              <img class="playnowimg" src="play.svg" alt="">
        </li>`;
    }

    //Attach an event listner to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click" ,element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            
        })
    })

    //Attach event listner to play , next and prevoius

    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src ="pauses.svg"
        }
        else{
            currentSong.pause()
            play.src ="playsong.svg"
        }
    })

    //listen to time update event duration
    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${secToMinSec(currentSong.currentTime)} | ${secToMinSec(currentSong.duration)}`

        document.querySelector(".circle").style.left=
        (currentSong.currentTime / currentSong.duration) * 100+"%"
    })

    //Add event listner to seekbar

    document.querySelector(".seekbar").addEventListener("click" , e=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width)*100; 
        document.querySelector(".circle").style.left = percent +"%"
        currentSong.currentTime = ((currentSong.duration)*percent)/100;
    })

    //Add event listner for hamburger 
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0%"
    })

    //Add event listner for close btn 
    document.querySelector(".closebtn").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-150%"
    })



//     previous.addEventListener("click", () => {
//     currentSong.pause();
//     console.log('previous click');
    
//     let currentFile = currentSong.src.split("/").pop(); // get file name only
//     let index = songs.indexOf(currentFile);

//     if ((index - 1) >= 0) {
//         playMusic(songs[index - 1]);
//         currentSong.src = `songs/${songs[index - 1]}`; // ✅ update currentSong src
//         currentSong.play(); // ✅ actually play the new song
//     }
// });

// next.addEventListener("click", () => {
//     currentSong.pause();
//     console.log('next click');

//     let currentFile = currentSong.src.split("/").pop(); // get file name only
//     let index = songs.indexOf(currentFile);

//     if ((index + 1) < songs.length) {
//         playMusic(songs[index + 1]);
//         currentSong.src = `songs/${songs[index + 1]}`; // ✅ update currentSong src
//         currentSong.play(); // ✅ actually play the new song
//     }
// });



    //Add event listner to Previous button
    previous.addEventListener("click" ,()=>{
        currentSong.pause();
        console.log('previous click');
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]);

        if((index-1) > 0){
            playMusic(songs[index-1]);
            currentSong.src = `songs/${songs[index - 1]}`; // update currentSong src
            currentSong.play(); // actually play the new song
            console.log(index , index.target);
        }
        else{
            playMusic(songs.length-1);
        }
    })
    

    //Add Event listner to Next button
    next.addEventListener("click" ,()=>{
        currentSong.pause();
        console.log('next click');
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]);

        if((index+1) < songs.length){
            playMusic(songs[index+1]);
            currentSong.src = `songs/${songs[index + 1]}`; // update currentSong src
            currentSong.play(); //actually play the new song
        }
        else{
            playMusic(0);
        }
    })

    //Add an event to volume in range
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log(e , e.target , e.target.value + " / 100")
        currentSong.volume = parseInt(e.target.value)/100
        
    })
}


main()
