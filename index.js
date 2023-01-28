var preload = document.getElementById("loader");
setTimeout(function load() {
  preload.style.display = "none";
}, 2000);

var audioElement = false;
$(".sound-div a").click(function () {
  if ($(this).parent().hasClass("activated")) {
    $(this).parent().removeClass("activated");
    audioElement.pause();
  } else {
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

const Texts = [
  "HTML",
  "CSS",
  "ES5/ES6",
  "TypeScript",
  "REST",
  "JSON",
  "GSAP",
  "Data Science",
  "Wordpress",
  "PHP",
  "Python",
  "Node JS ",
  "Bootstrap",
  "SASS",
  "jQuery",
  "BEM",
];

var tagCloud = TagCloud(".sphereContainer", Texts, {
  // Sphere radius in px
  radius: 350,
  // animation speed
  // slow, normal, fast
  maxSpeed: "fast",
  initSpeed: "fast",

  // Rolling direction [0 (top) , 90 (left), 135 (right-bottom)]
  direction: 135,

  // interaction with mouse or not [Default true (decelerate to rolling init speed, and keep rolling with mouse).]
  keep: true,
});

document.querySelector(".sphereContainer").style.color = "#08fdd8";
