var preload = document.getElementById("loader");
setTimeout(function load() {
  preload.style.opacity = "0";
  preload.style.transform = "translate3d(-1520px, 0, 0)";
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
  "C++",
  " C",
  " Git",
  " Javascript",
  " Express JS",
  " React JS",
  " jQuery",
  " MongoDB",
  " EJS",
  " Pandas",
  " REST ",
  " MySQL",
  " EmailJs",
  " LeafFleatJs",
  "HTML",
  "CSS",
  "REST",
  "JSON",
  "GSAP",
  "Python",
  "Node JS ",
  "Bootstrap",
  "SCSS",
  "jQuery",
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
gsap.to(".animated-img", { opacity: 1, delay: 2.2, duration: 3 });
gsap.to(".svg-logo", { opacity: 0, delay: 2.2, duration: 15 });

// for $i from 1 through 50({
//    span img:nth-child(#{$i}n) {
//       animation-delay: #{$i /10}s;
//   }
// });

function SendMail() {
  const nameInput = document.querySelector(".name");
  const emailInput = document.querySelector(".email");
  const subjectInput = document.querySelector(".subject");
  const textareaInput = document.querySelector(".textarea");

  const contactForm = document.querySelector("#contact-form");
  let email = document.querySelector(".email").value;
  let textarea = document.querySelector(".textarea").value;

  if (!email && !textarea) {
    alert("Please fill in the required inputs");
  } else if (!email && textarea) {
    alert("Oops Email can't be empty");
  } else if (!textarea && email) {
    alert("Please provide a message");
  } else if (email && textarea) {
    var p = {
      from_name: nameInput.value,
      from_email: email,
      message: textarea,
    };
    emailjs.send("service_k94trc3", "template_blmp8rw", p).then((res) => {
      alert("Email successfully sent!");
    });
    //
    textareaInput.value = "";
    emailInput.value = "";
    nameInput.value = "";
    subjectInput.value = "";
  }
}
document.querySelector(".bt").addEventListener ("click", SendMail);
const setError = (input) => {
  if (input.classList.contains("success")) {
    input.classList.remove("success");
  } else {
    input.classList.add("error");
  }
};
const setSuccess = (input) => {
  if (input.classList.contains("error")) {
    input.classList.remove("error");
  } else {
    input.classList.add("success");
  }
};

const messageDiv = document.querySelector(".message");
const showMessage = (message, updateColor) => {
  const divContent = document.createElement("div");
  divContent.textContent = message;
  divContent.classList.add("message-content");
  divContent.style.backgroundColor = updateColor;
  messageDiv.prepend(divContent);

  messageDiv.style.transform = `translate(${(0, 0)}%)`;
  setTimeout(() => {
    divContent.classList.add("hide");
    divContent.addEventListener("transitionend", () => {
      divContent.remove();
    });
  }, 5000);
};
