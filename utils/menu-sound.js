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
