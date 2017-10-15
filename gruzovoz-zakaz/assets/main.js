setTimeout(function () {
  document.querySelector(".main-header .c-hamburger").addEventListener("mousedown", function () {
    document.querySelector(".main-header .navbar-nav").classList.toggle("collapsed");
    document.querySelector(".main-header .c-hamburger").classList.toggle("is-active");
  });
  var menuElements = Array.from(document.querySelectorAll(".main-header .navbar-nav li"));
  menuElements.forEach(function (e) {
    e.addEventListener("click", function () {
      document.querySelector(".main-header .navbar-nav").classList.add("collapsed");
      document.querySelector(".main-header .c-hamburger").classList.remove("is-active");
    })
  });

}, 1500);
