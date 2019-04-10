(function () {
    var mobileMenu = document.getElementsByClassName('mobile-menu')[0];
    mobileMenu.onclick = closeMobileMenu;
    for (let i in mobileMenu.children) {
        mobileMenu.children[i].onclick = closeMobileMenu;
    }
    var layout = document.getElementById('layout');
    layout.onclick = closeModal;
    var modals = document.getElementsByClassName('modal');
    for (var i in modals) {
        modals[i].onclick = function (e) {
            e.stopPropagation();
        }
    }
    layout.onscroll = function(e) {
        e.preventDefault();
    }
})();


function showMobileMenu() {
    var burgerMenuIcon = document.getElementById('burger-menu-icon');
    if (burgerMenuIcon.classList.contains('active')) {
        closeMobileMenu();
        return;
    }
    burgerMenuIcon.classList.add('active');
    var mobileMenu = document.getElementsByClassName('mobile-menu')[0];
    mobileMenu.classList.remove('hidden');
}

function closeMobileMenu() {
    var mobileMenu = document.getElementsByClassName('mobile-menu')[0];
    mobileMenu.classList.add('hidden');
    var burgerMenuIcon = document.getElementById('burger-menu-icon');
    burgerMenuIcon.classList.remove('active');
}

function showModal(modalId) {
    var layout = document.getElementById('layout');
    layout.classList.remove('hidden');
    var modal = document.getElementById(modalId);
    modal.classList.remove('hidden');
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('modal-open');
}

function closeModal() {
    var layout = document.getElementById('layout');
    layout.classList.add('hidden');
    var modals = document.getElementsByClassName('modal');
    for (var i = 0; i < modals.length; i++) {
        modals[i].scrollTop = 0;
        modals[i].classList.add('hidden');
    }
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('modal-open');
}

function submitContactForm() {
    let name = document.querySelector('#contact_form [name="name"]').value;
    let email = document.querySelector('#contact_form [name="email"]').value;
    let message = document.querySelector('#contact_form [name="message"]').value;

    let submit = document.querySelector('#contact_form button');

    submit.setAttribute('disabled', true);

    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.post('https://www.enformed.io/uzkhhsdh/', {name, email, message})
      .then(response => showSuccessContactModal(response))
      .catch(error => console.log(error));
    return false;
}

function showSuccessContactModal(response) {
    let submit = document.querySelector('#contact_form button');

    submit.setAttribute('disabled', false);
    showModal('modal-success-contact');
    
    document.querySelector('#contact_form [name="name"]').value = '';
    document.querySelector('#contact_form [name="email"]').value = '';
    document.querySelector('#contact_form [name="message"]').value = '';
}

