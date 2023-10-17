// random user api url results
const url = 'https://randomuser.me/api/?nat=us&results=12'

// grab search bar div
const searchBar = document.querySelector('.search-container');

// grab gallery div
const gallery = document.getElementById('gallery');

// users list
let usersList = []

let currentUserIndex = 0;

// add search bar elements
searchBar.insertAdjacentHTML('beforeend', ` <form action="#" method="get">
<input type="search" id="search-input" class="search-input" placeholder="Search...">
<input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>`);

// add search functionality
const searchForm = document.querySelector('form');
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchUsers();
});


function searchUsers(){
    const searchInput = document.querySelector('#search-input');
    const searchValue = searchInput.value.toLowerCase();
    const filterList = [];

    // iterate over user list and check if search value is found in list
    for(let i = 0; i < usersList.length; i++){
        const fullName = `${usersList[i].name.first.toLowerCase()} ${usersList[i].name.last.toLowerCase()}`
        if(fullName.includes(searchValue)){
            filterList.push(usersList[i])
        }
    }
    // reset html 
    gallery.innerHTML = '';
    if(filterList.length > 0){
        displayUsers(filterList);
    } else {
        gallery.insertAdjacentHTML('beforeend', '<p>No Results Found.</p>')
    }
}

// get random users data
async function getRandUsers(){
    try {
        const response = await fetch(url)
        const usersJson = await response.json()
    
        usersList = usersJson.results
        displayUsers(usersJson.results)
    } catch(e) {
        throw e
    }
}

// iterate over users array and display random users
function displayUsers(users){
    users.forEach(user => {
        gallery.insertAdjacentHTML("beforeend", createUserHtml(user))
    })
};

// create html for each user in list
function createUserHtml(user){
    return `<div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${user.picture.thumbnail}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
        </div>
    </div>`
}

getRandUsers();

// create birthday("1981-08-27T13:31:26.063Z");
function birthday(dob){
    const birthdayParts = dob.split(/[-T]/)
    const year = birthdayParts[0].substring(2)
    const month = birthdayParts[1]
    const day = birthdayParts[2].split('T')[0]
    
    const formatedBirthday = month + "/" + day + "/" + year
    return formatedBirthday
}


// create address
function address(user){
    return `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}`
}

// create modal element 
function createModalElement(user){
    return `
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="modal-text">${user.email}</p>
                <p class="modal-text cap">${user.location.city}</p>
                <hr>
                <p class="modal-text">${user.cell}</p>
                <p class="modal-text">${address(user)}</p>
                <p class="modal-text">Birthday: ${birthday(user.dob.date)}</p>
            </div>
        </div>

        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>`
}

// display user modal
function displayModalElement(user){
    // remove last modal that was created
    const existingModal = document.querySelector('.modal-container');
    if(existingModal) {
        existingModal.remove();
    }
    currentUserIndex = currentIndex(user)
    const displayModal = createModalElement(user)
    gallery.insertAdjacentHTML('beforeend', displayModal)

    // event listener to close modal
    const closeButton = document.querySelector('.modal-close-btn');
        closeButton.addEventListener('click', () => {
        gallery.lastElementChild.remove()
    })

    // Event listener for the "modal-prev btn"
    const prevButton = document.querySelector('.modal-prev.btn');
    prevButton.addEventListener('click', () => {
        if (currentUserIndex - 1 >= 0) {
            currentUserIndex--;
            displayCurrentModal();
        }
    });

    // Event listener for the "modal-next btn"
    const nextButton = document.querySelector('.modal-next.btn');
    nextButton.addEventListener('click', () => {
        if (currentUserIndex + 1 < usersList.length) {
            currentUserIndex++;
            displayCurrentModal();
        }
    });
}

// event listener for gallery 
gallery.addEventListener("click", (e) =>{
    const cardPicked = e.target.closest('.card')
    // return so no null error
    if(!cardPicked){
        return 
    }

    const userSelected = cardPicked.querySelector("#name").textContent
    const matchedUser = usersList.find(user => {
        if(userSelected.includes(user.name.first) && userSelected.includes(user.name.last)){
            return user
        }
    })
    
    displayModalElement(matchedUser)
});

// index of current user
function currentIndex(user){
    return usersList.indexOf(user)
}

// function to display the current user in the modal
function displayCurrentModal() {
    const user = usersList[currentUserIndex];
    displayModalElement(user);
}