var preload = document.getElementById("loader");
setTimeout(function load() {
  preload.style.display = "none";
}, 2000);

var audioElement = false;
$(".sound-div a").click(function () {

  if ($(this).parent().hasClass("activated")) {
    $(this).parent().removeClass("activated");
    audioElement.pause();
  }
  else {
    $(this).parent().addClass("activated");

    if (!audioElement) {
      audioElement = new Audio("backmusic.mp3");
      audioElement.addEventListener("ended", function (event) {
        audioElement.play();
      });
    }
    audioElement.play();
  }
});
