let audio = document.querySelector("#audio");
audio.currentTime = localStorage.getItem("audioProgress") ?? 0;
audio.volume = 0.1;
// audio.loop = true;
audio.play();

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

// &#9654;
muteButtonElement.textContent = "\u25B6";

document.body.appendChild(muteButtonElement);
