//helps get timestamps, etc
/*
do a querySelector lookup @param {string} selector The selector passed to querySelector
@return {element} The matching element or null if not found */
export function qs(selector) { 
   return document.querySelector(selector);
}
/*
add a touchend event listener to an element for mobile with a click event fallback for desktops @param {string} elementSelector The selector for the element to attach the listener to
* @param {function} callback The callback function to run
*/
export function onTouch(elementSelector, callback) { 
    qs(elementSelector).addEventListener('touchend', callback);
    //causing click event issues. 
    //qs(elementSelector).addEventListener('click', callback);
}