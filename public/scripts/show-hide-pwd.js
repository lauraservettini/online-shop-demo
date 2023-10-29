const showHidePwdInputButtonElement = document.getElementById("show-hide-pwd");

function showHidePwd() {
    var input = document.getElementById('password');
    console.log(showHidePwdInputButtonElement.value)
        if (input.type === "password") {
          input.type = "text";
         showHidePwdInputButtonElement.value = String.fromCodePoint(0x1F513);
        } else {
          input.type = "password";
          showHidePwdInputButtonElement.value = String.fromCodePoint(0x1f512);
        }
}

showHidePwdInputButtonElement.addEventListener("click", showHidePwd);