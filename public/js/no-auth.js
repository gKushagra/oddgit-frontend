function checkToken() {
    var token = localStorage.getItem('token');
    if (token) {
        window.location.href = `http://localhost:3112/auth/verify-token/${token}`
    }
}

// function checkToken() {
//     var token = localStorage.getItem('token');
//     if (token) {
//         // send to backend and verify, put token in authorization header
//         GET('http://localhost:3112/auth/verify-token', token)
//             .then(function (html) {
//                 // approach 1
//                 // Convert the HTML string into a document object
//                 // var parser = new DOMParser();
//                 // var doc = parser.parseFromString(html, 'text/html');
//                 // console.log(doc);

//                 // approach 2
//                 // var page = document.open("text/html", "replace");
//                 // page.write(html);
//                 // page.close();

//                 // approach 3
//                 document.getElementsByTagName('body')[0].innerHTML = html;
//             }).catch(function (err) {
//                 // There was an error
//                 console.warn('Something went wrong.', err);
//             });
//     }
// }