
var preload = document.getElementById("loader");
setTimeout(function load() {
  preload.style.opacity = "0";
  preload.style.transform = "translate3d(-1520px, 0, 0)";
},2000);

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

// don't forget to register it!
// gsap.registerPlugin(DrawSVGPlugin);

// show the SVG - hidden by default in CSS to prevent FOUC
// gsap.set("#svg", {
//   opacity: 1
// });

// // and then draw in your stroke!
// gsap.from(".svg-logo", {
//   duration: 3,
//   ease: "sine.out",
//   drawSVG: 0,
//   repeat: -1,
//   repeatDelay: 2
// });
// gsap.from(".svg-logo", {duration:1,});
gsap.to(".animated-img", { opacity: 1, delay: 2.2,duration:3 });
gsap.to(".svg-logo", { opacity: 0, delay: 2.2, duration: 15 });

// for $i from 1 through 50({
//    span img:nth-child(#{$i}n) {
//       animation-delay: #{$i /10}s;
//   }
// });