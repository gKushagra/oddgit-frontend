const resetPassBtn = document.getElementById('save-new-pass');
const passInput = document.getElementById('pass');
const pass2Input = document.getElementById('pass2');
const errorMsg = document.getElementById('error');
const successMsg = document.getElementById('success');

errorMsg.style.visibility = "hidden";
successMsg.style.visibility = "hidden";

resetPassBtn.addEventListener('click', () => {
    if (passInput.value !== pass2Input.value) {
        errorMsg.innerHTML = "Passwords do not match. Please check and retry!"
        errorMsg.style.visibility = "visible";
    } else {
        errorMsg.style.visibility = "hidden";
        resetPassword(passInput.value);
    }
});

function resetPassword(pass) {
    let url = `http://localhost:3112/auth/reset`;
    POST(url, { pass: pass, token: token }, null)
        .then((data) => {
            successMsg.innerHTML = data.message;
            successMsg.style.visibility = "visible";
            resetPassBtn.disabled = true;

            setTimeout(() => {
                window.location.replace('http://localhost:3112/auth/login');
            }, 10000);
        })
        .catch((err) => {
            console.log(err);
        });
}