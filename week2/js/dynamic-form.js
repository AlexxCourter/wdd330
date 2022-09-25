//get the radio buttons
const selectEmail = document.getElementById("by-email");
const selectPhone = document.getElementById("by-phone");

//experimenting with a function to toggle class. currently unused
function hideElement(element){
    element.classList.toggle("hide");
}

selectEmail.addEventListener("change", function () {
    if (this.checked) {
        // need to make both the email and phone section available so that if one is enabled, it can be turned off 
        const emailSection = document.getElementById("contact_email");
        const phoneSection = document.getElementById("contact_phone");

        //check to see if the email section is hidden. If it is, toggle the hide class
        if (emailSection.classList.contains("hide")){
            emailSection.classList.toggle("hide");
        }
        
        //if the phone section is visible, toggles the hide class to hide it
        if (!phoneSection.classList.contains("hide")){
            phoneSection.classList.toggle("hide");
        }
    } 
});
selectPhone.addEventListener("change", function () {
    if (this.checked) {
        const phoneSection = document.getElementById("contact_phone");
        const emailSection = document.getElementById("contact_email");
        phoneSection.classList.toggle("hide");

        if (!emailSection.classList.contains("hide")){
            emailSection.classList.toggle("hide");
        }

        if (phoneSection.classList.contains("hide")){
            phoneSection.classList.toggle("hide");
        }
    }
});