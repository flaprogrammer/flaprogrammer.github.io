window.onload = function () {
    var mobileMenu = document.getElementsByClassName('mobile-menu')[0];
    for (let i in mobileMenu.children) {
        mobileMenu.children[i].onclick = function () {
            mobileMenu.style.display = 'none';
        }
    }
    var layout = this.document.getElementById('layout');
    layout.onclick = closePortfolioModal;
    var modals = document.getElementsByClassName('modal');
    for (var i in modals) {
        modals[i].onclick = function (e) {
            e.stopPropagation();
        }
    }
}

function showMobileMenu() {
    var mobileMenu = document.getElementsByClassName('mobile-menu')[0];
    mobileMenu.style.display = 'flex';
}

function showPortfolioModal(modalId) {
    var layout = document.getElementById('layout');
    layout.classList.remove('hidden');
    var modal = document.getElementById(modalId);
    modal.classList.remove('hidden');
}

function closePortfolioModal(modalId) {
    var layout = document.getElementById('layout');
    layout.classList.add('hidden');
    var modals = document.getElementsByClassName('modal');
    for (var i in modals) {
        modals[i].classList.add('hidden');
    }
}

