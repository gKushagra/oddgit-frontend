const requestLinkBtn = document.getElementById('request-link');
const emailInput = document.getElementById('email');
const alertMessage = document.getElementById('message'); 

alertMessage.style.visibility = "hidden";

requestLinkBtn.addEventListener('click', () => {
    let email = emailInput.value;
    requestLink(email);
});

function requestLink(email) {
    let resetUrl = `${DOMAIN}/auth/reset/${email}`;
    GET(resetUrl, null)
        .then((data) => {
            alertMessage.innerHTML = data.message;
            alertMessage.style.visibility = "visible";
            requestLinkBtn.disabled = true;

            setTimeout(() => {
                window.location.replace(`${DOMAIN}/home/`);
            }, 10000);
        })
        .catch((err) => {
            console.log(err);
        });
}