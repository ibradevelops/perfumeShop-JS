"use strict";
//Home
const homeFirstSection = document.querySelector(".first__section");
const homeSecondSection = document.querySelector(".second__section");
const homeGalleryImages = document.querySelectorAll(".home-gallery-img");
const nav = document.querySelector(".nav__bar");
const heroHome = document.querySelector(".hero");
const navLink = document.querySelectorAll(".nav-link");
const body = document.querySelector("body");
const navList = document.querySelectorAll("li a");
const faqSection = document.querySelector(".faq__section");
const closeIcon = document.querySelectorAll(".icon");
const actualInfo = document.querySelectorAll(".actual-info");
const testimonialSection = document.querySelector(".testimonials__section");
const testimonial = document.querySelectorAll(".testimonial");
const iconLeft = document.querySelector("#icon-left");
const iconRight = document.querySelector("#icon-right");
const dots = document.querySelectorAll(".dot");
const homeBtn = document.querySelector(".home-top");
const hamburgerMenu = document.querySelector(".hamburger-menu");
const navIcon = document.querySelector(".nav-icon");

homeBtn.addEventListener("click", () => {
  window.scrollTo(0, 0);
});

const observer = new IntersectionObserver(
  (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      nav.classList.remove("sticky-nav");
      hamburgerMenu.style.color = "#b3d1b3";
      navList.forEach((val) => {
        val.removeEventListener("mouseover", hover);
        val.removeEventListener("mouseout", noHover);
        val.removeAttribute("style");
      });
    } else {
      nav.classList.add("sticky-nav");
      hamburgerMenu.style.color = "#002800";
      navList.forEach((val) => {
        val.style.color = "#002800";
        val.addEventListener("mouseover", hover);
        val.addEventListener("mouseout", noHover);
      });
    }
  },
  { root: null, threshold: 0, rootMargin: `-101px` }
);
observer.observe(heroHome);
//
const observeIt = function (part, className, thresholdNumber, classNameRemove) {
  part.style.opacity = 0;
  const observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (!entry.isIntersecting) return;

      part.classList.remove(classNameRemove);
      part.style.opacity = 1;
      part.classList.add(className);
      observer.unobserve(part);
    },
    {
      root: null,
      threshold: thresholdNumber,
    }
  );
  observer.observe(part);
};
//
homeGalleryImages.forEach(function (img) {
  img.classList.add("blured");
  observeIt(img, "bluredAnimation", 0.8, "blured");
  const imgLoop = function (opacityNum) {
    for (let i = 0; i < homeGalleryImages.length; i++) {
      homeGalleryImages[i].style.opacity = opacityNum;
    }
  };
  img.addEventListener("mouseover", function (e) {
    imgLoop(0.2);
    const curImg = e.target;
    curImg.style.opacity = 1;
  });
  img.addEventListener("mouseout", function () {
    imgLoop(1);
  });
});
observeIt(homeFirstSection, "fromRight", 0.2);
observeIt(homeSecondSection, "fromLeft", 0.1);
observeIt(faqSection, "fromBottom", 0.9);
observeIt(testimonialSection, "testimonialSectionAnimation", 0.8);

//
function hover() {
  for (let i = 0; i < navList.length; i++) {
    navList[i].style.color = "white";
  }
  this.style.color = "#002800";
}
function noHover() {
  for (let i = 0; i < navList.length; i++) {
    navList[i].style.color = "#002800";
  }
  this.style.color = "#002800";
}

for (let i = 0; i < closeIcon.length; i++) {
  closeIcon[i].addEventListener("click", function () {
    if (actualInfo[i].classList.contains("hide")) {
      this.style.transform = "rotate(180deg)";
      actualInfo[i].classList.remove("hide");
    } else {
      actualInfo[i].classList.add("hide");
      this.style.transform = "rotate(360deg)";
    }
  });
}
//
testimonial.forEach((val) => {
  let i = 0;
  const switchingTestimonials = function (parametar) {
    val.classList.add("hide");
    val.classList.remove("testimonial-anime-right");
    val.classList.remove("testimonial-anime-left");
    testimonial[i].classList.remove("hide");
    testimonial[i].classList.add(parametar);
  };
  const dotsSynch = function () {
    for (const d of dots) {
      dots.forEach((val) => {
        val.style.backgroundColor = "#e1e1e1";
        dots[i].style.backgroundColor = "#7d7d7d";
      });
    }
  };
  dotsSynch();
  iconRight.addEventListener("click", () => {
    if (i === 2) return;
    i++;
    dotsSynch();
    switchingTestimonials("testimonial-anime-left");
  });
  iconLeft.addEventListener("click", () => {
    if (i === 0) return;
    i--;
    dotsSynch();
    switchingTestimonials("testimonial-anime-right");
  });
});

hamburgerMenu.addEventListener("click", function () {
  const body = document.querySelector("body");
  nav.classList.add("hide");
  const html = ` 
  <ul class="overlay">
  <img src="images/close-icon.png" class="close-icon"/>
  <div class="list">
  <li> <a href="#hero" class="home-top">Home</a></li>
  <li><a href="shop.html" target="_blank">Shop</a></li>
  <li><a href="cart.html" target="_blank">Cart</a></li>
  <li><a href="contact.html" target="_blank">Contact</a></li>
  </div>
    </ul>
  `;
  body.insertAdjacentHTML("afterbegin", html);
  body.style.position = "fixed";
  const closeMenuIcon = document.querySelector(".close-icon");
  closeMenuIcon.addEventListener("click", () => {
    document.querySelector(".overlay").remove();
    body.style.position = "relative";
    nav.classList.remove("hide");
  });
});
