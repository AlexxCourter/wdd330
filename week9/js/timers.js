//locations of the plots
const plot1 = document.getElementById('plot1');
const plot2 = document.getElementById('plot2');
const plot3 = document.getElementById('plot3');

const plot4 = document.getElementById('plot4');
const plot5 = document.getElementById('plot5');
const plot6 = document.getElementById('plot6');

const plot7 = document.getElementById('plot7');
const plot8 = document.getElementById('plot8');
const plot9 = document.getElementById('plot9');

const plotArray = [plot1,plot2,plot3,plot4,plot5,plot6,plot7,plot8,plot9];

//set listeners for clicking on the plot, which starts the process of planting a seed.
plotArray.forEach(plot => {
    let item = plot;
    plot.innerHTML = `<img src="./img/plant-0.png">`;
    plot.addEventListener('click', function () {
        startGrowing(item.id);
    })
})

//"animate" the growth of the plant over time using setTimeout
function startGrowing(id, imgNumber=1){
    let location = document.getElementById(id);

    if(imgNumber <= 3){
        location.innerHTML = `<img src="./img/plant-${imgNumber}.png">`;
        window.setTimeout(()=>{startGrowing(id,imgNumber+1)}, 3000);
    }
    
}

function reset() {
    plotArray.forEach(plot => {
        plot.innerHTML = `<img src="./img/plant-0.png">`;
    })
}