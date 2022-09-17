function loadStory(){
    var storyName = document.getElementById("story-title").value;
    var storyHTML = localStorage.getItem(storyName);
    document.getElementById("story-editor").value = storyHTML;
}

function saveStory(){
    var storyName = document.getElementById("story-title").value;
    var storyHTML = document.getElementById("story-editor").value;
    localStorage.setItem(storyName, storyHTML);
}

function displayStory(){
    var storyHTML = document.getElementById("story-editor").value;
    var storyName = document.getElementById("story-title").value;
    document.getElementById("story-display").innerHTML = storyHTML;
    document.getElementById("display-title").innerHTML = storyName;
}