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

    const text=new Array(
        "강력한 레이져와 미사일공격, 그리고 비행능력을 가지고 있는 아이언맨!<br>호쾌하고 자신감이 넘치며 잘생기기까지, 어디서나 당당하다.",
        "분노하면 녹색괴물로 변하는 매우 강력한 힘을 가진 헐크!<br>평소에는 포근하고 따뜻하지만 화나면 매우 무섭다.",
        "지구방위단체인 실드의 비밀요원으로 뛰어난 무술을 가지고 있는 블랙 위도우!<br>매력적인 외모와 카리스마로 히어로들 중에서도 돋보인다.",
        "슈퍼솔져 프로젝트로 탄생한 인간의 능력 최대치를 가지고 있는 캡틴 아메리카!<br>융통성은 없지만 자신보다 주변을 챙기고 정의의 사도이다.",
        "뛰어난 궁술을 보여주는 MCU최고의 저격수인 호크아이!<br>유머러스하고 쾌활한 성격으로 허당같은 모습을 보여주지만 옆집 청년처럼 포근하다.",
        "토르의 동생으로 위장과 변신을 자유롭게 할수 있는 능력을 가지고 있는 로키!<br>장난끼가 매우 많아 주변사람들을 괴롭히지만 그마저도 매력적이다.",
        "전투력과 암살력이 매우 뛰어난 슈퍼솔저이자 암살자인 윈터솔져!<br>말이 적어 성격이 매우 묵직해 보이지만 사실 츤데레이다.",
        "뛰어난 조종실력과 전투 센스를 가진 팔콘!<br>진중하고 무거운 성격을 가지고 리더의 자질이 보인다.",
        "전설적인 무법자 스타로드!<br>잔망스럽고 유머러스한 성격을 가지고 음악을 굉장히 좋아하는 분위기 주도자이다.",
        "인간을 초월하는 힘과 내구력을 가진 가모라!<br>우주에서 가장 위험한 여자라고 알려져있지만 소문과 달리 사랑이 많고 감정적이다.",
        "인체실험으로 만들어진 능력을 가진 세계관 최강자 중 하나인 스칼렛 위치!<br>매우 도전적이고 경쟁을 즐기는 열정적인 여자이다.",
        "거미줄로 하늘을 날아다니는 여러매력의 소유자 스파이더맨!<br>여린 마음과 어린아이의 성격을 가져 철이 없어보이지만 불의를 참지 못한다.",
        "신의 아들로 천둥과 번개를 다루는 강력한 능력을 가지고 있는 토르!<br>다혈질 성격에 제멋대로이지만 정의감이 강하고 사랑이 많다.",
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
        showResult(index);
    }
    function showResult(index){
        const classPrediction =arr[index];
        const classResultText =text[index];
        labelContainer.childNodes[0].id="name";
        labelContainer.childNodes[1].id="resultText";

        labelContainer.childNodes[0].innerHTML = classPrediction;
        labelContainer.childNodes[1].innerHTML = classResultText;

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