function numReader () {
    let x = document.getElementById("number").value;
    document.getElementById("output").innerHTML = x;
}


let displayTextButton;

window.onload = function() {
  console.log("window.onload");

  displayTextButton = document.getElementById("text-button");
  displayTextButton.onclick = validateInput;
};

function validateInput(){
  let inputHTML = document.getElementById("number").value;
  if (isFinite(inputHTML) === true) {
    sumNumbers(inputHTML);
  } else {
    displayResult("ERROR");
  }
};

function sumNumbers(numberParam) {
  let sumResult = 0;
  for (let index = 1; index < numberParam; index++) {
    sumResult += (sumResult + 1);
  }
  displayResult(sumResult);
};

function displayResult(resultParam){
  document.getElementById("output").innerHTML = "Sum = " + resultParam;
};


function sumNumbers(numberParam1, numberParam2, callbackParam) {
    let sumResult = 0;
    sumResult = parseInt(numberParam1) + parseInt(numberParam2);
    callbackParam(sumResult);
  };
  
  function displayResult(resultParam){
    document.getElementById("second-output").innerHTML = resultParam;
  };
  


function getAddInputs() {
    let x = document.getElementById("number").value;
    let y = document.getElementById("number2").value;

    sumNumbers(x,y, displayResult);
}
