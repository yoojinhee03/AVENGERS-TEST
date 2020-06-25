    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // the link to your model provided by Teachable Machine export panel
    const URL = "./my_model/";
    const arr = new Array();
    let model, webcam, labelContainer,imageContainer, maxPredictions;
    const images= new Array(
        "ironman.jpg",
        "Hulk.jpg",
        "BlackWidow.jpg",
        "Captain.jpg",
        "Hawkeye.jpg",
        "Rocky.jpg",
        "WinterSoldier.jpg",
        "Falcon.jpg",
        "StarRoad.jpg",
        "Gamora.jpg",
        "Scarlet.jpg",
        "SpiderMan.jpg",
        "Thor.jpg",
    );
    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        labelContainer.appendChild(document.createElement("div"));
        // for (let i = 0; i < maxPredictions; i++) { // and class labels
        //     // labelContainer.appendChild(document.createElement("div"));
        // }
    }
    async function stop(){
        await webcam.pause(); // update the webcam frame
        document.getElementById("label-container").style.display="block";
        await predict();
        changeButton("stop","replay");
    }

    async function replay(){
        await webcam.play(); // request access to the webcam
        document.getElementById("label-container").style.display="none";
        window.requestAnimationFrame(loop);
        changeButton("replay","stop");
    }

    async function loop() {
        webcam.update(); // update the webcam frame
        // await predict();
        window.requestAnimationFrame(loop);
    }
    // run the webcam image through the image model
    async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            arr.push(prediction[i].className);
        }
        let max=prediction[0].probability.toFixed(2);
        let index=0;
        for (let i = 0; i < maxPredictions; i++){
            if(max<prediction[i].probability.toFixed(2)){
                max=prediction[i].probability.toFixed(2);
                index=i;
            }
            console.log(arr[i]+":"+prediction[i].probability.toFixed(2));
        }
        const classPrediction =arr[index] + ": " + max;
        labelContainer.childNodes[0].innerHTML = classPrediction;
        imageContainer = document.getElementById("image-container");
        imageContainer.style.display="inline-block";
        imageContainer.appendChild(document.createElement("img"));
        document.getElementById("wrapper").style.width="850px";
        imageContainer.childNodes[0].src="./images/"+images[index];
    }

    function over(){
        document.getElementById("over").style.display="none";
    }
    function changeButton(id,changeId){
        document.getElementById(id).id=changeId;
        if(changeId=="replay"){
            document.getElementById(changeId).value="다시하기";
            document.getElementById(changeId).setAttribute("onClick", "replay()");
        }else{
            document.getElementById(changeId).value="멈추기";
            document.getElementById(changeId).setAttribute("onClick","stop()");
        }
    }