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

setTimeout(() => {
    loadAddNewRepositoryBtn();
}, 1000);

function loadAddNewRepositoryBtn() {
    const page = document.getElementById("active-page").dataset.test;

    var addNewRepositoryBtn;
    if (page === "repositories" || page === "no-results") {
        addNewRepositoryBtn = document.getElementById('add-repository');
        addNewRepositoryBtn.addEventListener('click', () => {
            const modalEl = document.getElementById('add-repo-modal');

            var addNewRepositoryModal = new bootstrap.Modal(modalEl, {
                keyboard: false,
                backdrop: 'static',
            });

            addNewRepositoryModal.show();

            const repoName = modalEl.querySelector('#repository-name');
            const createRepoBtn = modalEl.querySelector('#create-repo');
            const spinner = modalEl.querySelector('#check-name');
            const message = modalEl.querySelector('#msg');
            const closeModalBtn = modalEl.querySelector('#close-modal');

            createRepoBtn.disabled = true;

            // listen to repo name change
            repoName.addEventListener('input', () => {
                if (!repoName.value || repoName.value === "")
                    createRepoBtn.disabled = true;
                else
                    createRepoBtn.disabled = false;
            });

            repoName.addEventListener('keydown', (event) => {
                if (event.which == '13') {
                    event.preventDefault();
                }
            });

            // create new repository
            createRepoBtn.addEventListener('click', () => {
                message.classList.remove('alert-danger');
                message.classList.remove('alert-success');
                message.classList.add('visually-hidden');

                spinner.classList.remove('visually-hidden');
                createRepoBtn.classList.add('visually-hidden');

                console.log(repoName.value);

                const token = document.getElementById('token').dataset.test;

                let url = `http://localhost:3112/repos/repositories?token=${token}`

                POST(url, { name: repoName.value }, null)
                    .then((response) => {
                        spinner.classList.add('visually-hidden');
                        if (response.message === "repository name taken") {
                            message.innerHTML = response.message;
                            message.classList.add('alert-danger');
                            message.classList.remove('visually-hidden');
                            createRepoBtn.classList.remove('visually-hidden');
                        } else if (response.message === "created repository successfully") {
                            message.innerHTML = response.message;
                            message.classList.add('alert-success');
                            message.classList.remove('visually-hidden');
                        }
                    })
                    .catch((err) => {
                        spinner.classList.add('visually-hidden');
                        message.innerHTML = err;
                        message.classList.add('alert-danger');
                        message.classList.remove('visually-hidden');
                        createRepoBtn.classList.remove('visually-hidden');
                        spinner.classList.add('visually-hidden');
                    });

                closeModalBtn.addEventListener('click', () => {
                    addNewRepositoryModal.hide();
                    setTimeout(() => {
                        window.location.href = `http://localhost:3112/repos/repositories?page=0&token=${token}`;
                    }, 1000);
                });
            });
        });
    }
}