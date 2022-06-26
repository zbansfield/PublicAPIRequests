/* Treehouse FSJS Techdegree
 * Project 5 - Public API Request
*/

// Fetching the Data

// function from Treehouse Fetch API workshop
function fetchData(url) {
    return fetch(url)
            .then(checkStatus)
            .then(res => res.json())
            .catch(e => console.log('Problem', e))
}

const employees = [];

for (let i=0; i<12; i++) {
    fetchData('https://randomuser.me/api/?nat=us')
        .then(data => {
            employees.push(data.results[0])
            const picture = `${data.results[0].picture.large}`
            const name = `${data.results[0].name.first} ${data.results[0].name.last}`
            const email = `${data.results[0].email}`
            const location = `${data.results[0].location.city}, ${data.results[0].location.state}`
            
            displayCard(name, email, location, picture)
        })
}


// Helper functions

// function from Treehouse Fetch API workshop
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

const galleryDiv = document.querySelector('#gallery');
const body = document.querySelector('body');

function displayCard(name, email, location, picture) {

    const html = `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src=${picture} alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${name}</h3>
                <p class="card-text">${email}</p>
                <p class="card-text cap">${location}</p>
            </div>
        </div>
    
    `;

    galleryDiv.insertAdjacentHTML('beforeend', html)

}

function displayModal(picture, name, email, city, number, address, birthday) {
    const html = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src=${picture} alt="profile picture">
                    <h3 id="name" class="modal-name cap">${name}</h3>
                    <p class="modal-text">${email}</p>
                    <p class="modal-text cap">${city}</p>
                    <hr>
                    <p class="modal-text">${number}</p>
                    <p class="modal-text">${address}</p>
                    <p class="modal-text">${birthday}</p>
                </div>
            </div>
        </div>
    `;

    body.insertAdjacentHTML('beforeend', html)
}

function formatBirthday(dob) {
    let birthday = dob.date.substr(0,10);
    const regex = /(\d{4})-(\d{2})-(\d{2})/;
    return birthday.replace(regex, '$2/$3/$1')
}

function formatNumber(phone) {
    const regex = /^\D*(\d{3})-\D*(\d{3})-\D*(\d{4})\D*$/;
    return phone.replace(regex, '($1) $2-$3')
}

function formatAddress(location) {
    return `${location.street.number} ${location.street.name}, ${location.city}, ${location.state} ${location.postcode}`
}

function checkClickedEmployee (path, name) {
    let correct = false;

    path.forEach(element => {
        if (element.className === 'card') {
            if(element.childNodes[3].childNodes[1].textContent === name) {
                correct = true;
            }
        } 
    })

    return correct;
}

// Event Listeners 
galleryDiv.addEventListener('click', (e) => {
    
    employees.forEach(employee => {
        const picture = `${employee.picture.large}`
        const name = `${employee.name.first} ${employee.name.last}`
        const email = `${employee.email}`
        const city = `${employee.location.city}`
        const number = formatNumber(employee.phone)
        const address = formatAddress(employee.location)
        const birthday = formatBirthday(employee.dob)

        if (checkClickedEmployee(e.path, name)) {
            displayModal(picture, name, email, city, number, address, birthday)
        }
    })
})

body.addEventListener('click', (e) => {
    if (e.target.textContent === 'X') {
        var modalDiv = document.querySelector('.modal-container');
        modalDiv.parentNode.removeChild(modalDiv);
    }
})