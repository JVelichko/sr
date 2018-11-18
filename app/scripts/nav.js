const nav = document.querySelectorAll('.nav li a');
nav.forEach(function(el) {
  const current = window.location.href;
  if ( current.includes(el.getAttribute('href'))) {
    el.classList.add('active');
  }
})
/* const back = document.querySelector('#back');
back.addEventListener("click", goBack, false);

function goBack(e) {
    e.preventDefault();
    window.history.back();
} */
