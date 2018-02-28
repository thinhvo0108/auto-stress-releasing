var jsonfile = require('jsonfile');
var file = 'settings.json';

// Load native UI library
var ngui = require('nw.gui');

// Get the current window
var nwin = ngui.Window.get();

var settings = {
    duration: 10000,
    waiting: 2000,
    image: 'sample.jpg',
    background: '#00ff00',
}

var timeoutId;

startLoading = () => {  
    var progression = 0,
    progress = setInterval(function() 
    {
        if(progression >= 100) {
            clearInterval(progress);
        } else {
            progression += 100/((settings.waiting - 1000)/100) ;
            document.getElementById("loading-bar").value = progression;
        }
    }, 100);    
}

showUp = (settings) => {
    nwin.show();
    nwin.maximize();
    // nwin.enterFullscreen();
    setTimeout(()=>{
        nwin.enterFullscreen();
        document.body.style.backgroundColor = settings.background; 
        document.getElementById("exercise-screen").style.height = nwin.height + 'px';    
        document.getElementById("exercise-screen").style.display = 'block';
        startLoading();
    }, 500);
    timeoutId = setTimeout(showDown.bind(this, settings), settings.waiting);
    console.log(timeoutId);
}

showDown = (settings, stop) => {
    nwin.leaveFullscreen();
    setTimeout(()=>{
        nwin.minimize();
        nwin.hide();
        document.getElementById("exercise-screen").style.display = 'none'; 
        document.body.style.backgroundColor = 'white';  
    }, 500);  
    if (!stop) timeoutId = setTimeout(showUp.bind(this, settings), settings.duration);
}

startFunc = (settings) => {
    timeoutId = setTimeout(showUp.bind(this, settings), settings.duration);
}

applyFunc = () => {
    settings.duration = document.getElementById("duration").value;
    settings.waiting = document.getElementById("waiting").value;
    settings.background = document.getElementById("background").value;
    settings.image = 'custom.jpg';
    jsonfile.writeFileSync(file, settings);
    readFile(true);
}

stopTimeouts = () => {
    timeoutId++;
    while (timeoutId--) {
        clearTimeout(timeoutId);
    }    
}

stopFunc = () => {
    stopTimeouts();
    showDown(settings, true);
    nwin.show();
    // document.getElementById("apply").removeEventListener("click", applyFunc);
    // document.getElementById("start").removeEventListener("click", startFunc);
    // document.getElementById("stop").removeEventListener("click", stopFunc);    
}

chooseFile = (name) => {
    var chooser = document.querySelector(name);
    chooser.addEventListener("change", function(evt) {
        settings.image = this.value;
        document.getElementById("curFile").value = this.value;
        document.getElementById("guide-image").src = "../assets/" + settings.image;
    }, false);

    chooser.click();  
  }

readFile = (autoStart) => {
    jsonfile.readFile(file, (err, newData) => {
        if (err) {
          console.log(err);
          return;
        }
        settings = newData;
        document.getElementById("guide-image").src = "../assets/" + settings.image;        
        document.getElementById("duration").value = settings.duration;
        document.getElementById("waiting").value = settings.waiting;
        document.getElementById("curFile").value = settings.image;
        document.getElementById("background").value = settings.background;

        document.getElementById("exercise-screen").style.backgroundColor = settings.background;

        document.getElementById("apply").removeEventListener("click", applyFunc);
        document.getElementById("apply").onclick = applyFunc;
        // document.getElementById("start").removeEventListener("click", startFunc);
        // document.getElementById("start").onclick = startFunc.bind(this, settings);   
        document.getElementById("stop").removeEventListener("click", stopFunc);
        document.getElementById("stop").onclick = stopFunc;   

        document.getElementById("curFile").removeEventListener("click", chooseFunc);
        document.getElementById("curFile").onclick = chooseFunc;   
        
        document.getElementById("upload").removeEventListener("click", uploadFunc);
        document.getElementById("upload").onclick = uploadFunc;        
        
        // auto start
        if (autoStart) startFunc(settings);
    });
}

chooseFunc = () => {
    chooseFile('#fileDialog');
}

uploadFunc = () => {
    var fs = require('fs');
    var image = fs.readFileSync(settings.image);
    fs.writeFile('assets/custom.jpg', image, function(err) {
        if(err) {
            console.log("error writing img", err);
        }
        document.getElementById("curFile").value = 'custom.jpg';
    });    
}

onload = () => {
    document.getElementById("duration").value = settings.duration;
    document.getElementById("waiting").value = settings.waiting;
    document.getElementById("curFile").value = settings.image;
    document.getElementById("background").value = settings.background;
    readFile(false);
}    
