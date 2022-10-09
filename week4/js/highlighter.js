const paragraphs = document.querySelectorAll('p');
console.log(paragraphs)

for(element of paragraphs){element.addEventListener("click", function () {selector(element)}, false);
}

function selector(element) {
    console.log('clicking on a p')
    let textRange = document.createRange();
    let selection = window.getSelection();
    textRange.selectNodeContents(element);
    selection.removeAllRanges(); //resets any selection
    selection.addRange(textRange);
}