const searchForm = document.forms['search'];
const input = searchForm['searchInput'];

input.value = 'Search here';

//probably better to use a placeholder here so it isn't accidentally submitted as a search query, but good practice.

//practice with the focus and blur event listeners.
input.addEventListener('focus', function(){
    if (input.value === 'Search here') {
        input.value = '';
    }
}, false);

input.addEventListener('blur', function(){
    if (input.value === '') {
        input.value = 'Search here';
    }
}, false);

//practice using an event listener on the submit action. Apply a function at the event.
searchForm.addEventListener('submit', search, false);

function search(event){
    console.log('on this page, the alert is put out from a dummy function that prevents any actual form submission. This is just to show the functionality of being able to alert the user that they successfully completed the form.')
    alert('Form submitted');
    event.preventDefault();
}

//practice creating a javascript object from a form and converting it to JSON

//form element
const userForm = document.forms['userInfo'];
//form inputs of userForm
const fname = userForm['fname'];
const lname = userForm['lname'];
const catchphrase = userForm['catchphrase'];
const color = userForm['color'];

class User{
    constructor(fname, lname, phrase, color){
        this.firstName = fname;
        this.lastName = lname;
        this.catchphrase = phrase;
        this.favColor = color;
    }

    color() {
        return `My favorite color is ${this.color}.`;
    }

    name() {
        return `Hi! My name is ${this.fname} ${this.lname}.`;
    }

    catchphrase() {
        return `"${this.phrase}." - ${this.lname}`;
    }
}

userForm.addEventListener('submit', saveUser, false);

function saveUser(event) {
    let user = new User(fname.value, lname.value, catchphrase.value, color.value);
    let userString = JSON.stringify(user);

    alert(userString);
    console.log('user saved to localstorage as a JSON string with the key "user"');
    localStorage.setItem('user', userString);
    console.log('use case: use a form to easily save data to database that can be used as an object via JSON')
    event.preventDefault();
}

function displayUser() {
    // for a more user friendly display than an alert. future implementation
}