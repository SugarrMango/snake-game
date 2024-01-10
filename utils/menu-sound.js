let audio = document.createElement("audio");
// src="/assets/sounds/Menu.mp3"
audio.src = "/assets/sounds/Menu.mp3";
audio.muted = true;
audio.autoplay = true;
audio.loop = true;

audio.currentTime = localStorage.getItem("audioProgress") ?? 0;
audio.volume = 0.1;

window.addEventListener("beforeunload", function () {
  const audioProgress = audio.currentTime;
  console.log(audioProgress);
  localStorage.setItem("audioProgress", audioProgress);
});

let muteButtonElement = document.createElement("button");

muteButtonElement.style.position = "sticky";
muteButtonElement.style.left = "20px";
muteButtonElement.style.bottom = "20px";

muteButtonElement.style.width = "50px";
muteButtonElement.style.height = "50px";
muteButtonElement.style.borderRadius = "100%";
muteButtonElement.style.border = "solid 3px #45372b";
muteButtonElement.style.backgroundColor = "#967950";

muteButtonElement.style.display = "flex";
muteButtonElement.style.justifyContent = "center";
muteButtonElement.style.alignItems = "center";
muteButtonElement.style.fontSize = "24px";
muteButtonElement.style.padding = "2px 0px 0px 4px";
muteButtonElement.style.color = "#45372b";

muteButtonElement.style.cursor = "pointer";

let div = document.createElement("div");
div.style.position = "relative";
let play = document.createElement("span");
play.textContent = "\u25B6";
let mute = document.createElement("span");
mute.textContent = "/";
mute.style.position = "absolute";
mute.style.fontSize = "40px";
mute.style.left = "-3px";
mute.style.top = "-11px";
mute.style.transform = "rotate(15deg)";

div.append(play, mute);
muteButtonElement.append(div);

document.body.appendChild(muteButtonElement);
document.body.appendChild(audio);

function handleClick() {
  if (audio.muted === true) {
    audio.muted = false;
    mute.style.display = "none";
    muteButtonElement.style.color = "#45372b";
  } else {
    audio.muted = true;
    mute.style.display = "block";
    muteButtonElement.style.color = "rgb(135, 18, 18)";
  }
}

muteButtonElement.addEventListener("click", handleClick);
