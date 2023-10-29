const mobileNavBtnElement = document.getElementById("mobile-nav-btn");
const mobileMenuDropdownElement = document.getElementById("mobile-menu");

function openToggleMenu(){
    mobileMenuDropdownElement.classList.toggle("open");
}

mobileNavBtnElement.addEventListener("click", openToggleMenu);