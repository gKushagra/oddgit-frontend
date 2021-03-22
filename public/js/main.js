function logout() {
    localStorage.removeItem('token');
    setTimeout(() => {
        // change page without reflecting browser back history
        window.location.replace('http://localhost:3112/home/');
    }, 2000);
}

function saveToken(token) {
    localStorage.setItem('token', token);
}