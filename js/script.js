/* Treehouse FSJS Techdegree
 * Project 5 - Public API Request
*/

const galleryDiv = document.querySelector('#gallery');
const body = document.querySelector('body');
let employees = [];

//-----------------------------------
// Fetching employee data
//-----------------------------------

/** fetchData function
 * function from Treehouse Fetch API workshop
 * @param {*} url 
 * @returns Promise object 
 */
function fetchData(url) {
    return fetch(url)
            .then(checkStatus)
            .then(res => res.json())
            .catch(e => console.log('Problem', e))
}

// fetching 12 random users from the Random User API and displaying their information on the page with the displayCard() function
fetchData('https://randomuser.me/api/?nat=us&results=12')
    .then(data => {
        employees = data.results
        employees.forEach(employee => {
            const picture = `${employee.picture.large}`
            const name = `${employee.name.first} ${employee.name.last}`
            const email = `${employee.email}`
            const location = `${employee.location.city}, ${employee.location.state}`
            
            displayCard(name, email, location, picture)
        })
    })

//-----------------------------------
// Helper Functions
//-----------------------------------

/** checkStatus function
 * function from Treehouse Fetch API workshop
 * checks if the promise was rejected or resolved and throws an error if it was rejected
 * @param {*} response 
 * @returns Promise object
 */
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
/** displayCard function
 * creates the html string to be added to the div element which will display the employee information
 * @param {*} name 
 * @param {*} email 
 * @param {*} location 
 * @param {*} picture 
 */
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

/** displayModal function
 * creates the html string to for the modal that appears when an employee is clicked and adds it to the body element 
 * @param {*} picture 
 * @param {*} name 
 * @param {*} email 
 * @param {*} city 
 * @param {*} number 
 * @param {*} address 
 * @param {*} birthday 
 */
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

/** formatBirthday function
 * takes the birthdate given by the Random User API and formats it to MM/DD/YYYY
 * @param {*} dob 
 * @returns formatted birthday
 */
function formatBirthday(dob) {
    let birthday = dob.date.substr(0,10);
    const regex = /(\d{4})-(\d{2})-(\d{2})/;
    return birthday.replace(regex, '$2/$3/$1')
}

/** formatNumber function
 * takes the phone number from the Random User API and formats it to (XXX) XXX-XXXX
 * @param {*} phone 
 * @returns formatted phone number
 */
function formatNumber(phone) {
    const regex = /^\D*(\d{3})\D*(\d{3})-\D*(\d{4})\D*$/;
    return phone.replace(regex, '($1) $2-$3')
}

/** formatAddress function
 * takes the location information from the Random User API and formats it into a detailed address
 * @param {*} location 
 * @returns formatted address
 */
function formatAddress(location) {
    return `${location.street.number} ${location.street.name}, ${location.city}, ${location.state} ${location.postcode}`
}

/** checkClickedEmployee function
 * checks if the name of the employee clicked matches one of the names in the 'employees' variable
 * @param {*} path 
 * @param {*} name 
 * @returns boolean true or false
 */
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

//-----------------------------------
// Event Listeners
//-----------------------------------

/** Event listener for when an employee name is clicked
 * loops through the 'employees' array and calls the checkClickedEmployee() function to check if the employee name matches the employee that was clicked
 * then calls the displayModal() with the employee information if the name matches
*/
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

/** Event listener for the close button
 * removes the div element for the modal window when clicked
*/
body.addEventListener('click', (e) => {
    if (e.target.textContent === 'X') {
        var modalDiv = document.querySelector('.modal-container');
        modalDiv.parentNode.removeChild(modalDiv);
    }
})