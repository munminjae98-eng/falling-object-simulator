
// ==================================
// 낙하물 안전 시뮬레이터
// 교육용 물리 계산
// ==================================

const floorInput = document.getElementById("floor");
const massInput = document.getElementById("mass");
const heightInput = document.getElementById("height");
const bodyPartInput = document.getElementById("body-part");
const airInput = document.getElementById("air-resistance");
const faceInput = document.getElementById("face-upload");
// 업로드한 얼굴 사진 저장
let selectedFaceImage = "";
const startButton = document.querySelector(".start-button");
const resetButton = document.querySelector(".reset-button");

const resultCards = document.querySelectorAll(".result-card");
const riskStatus = document.querySelector(".risk-status");
const riskDescription = document.querySelector(".risk-section p");

const simulationMessage = document.querySelector(".simulation-message");
const simulationScreen = document.querySelector(".simulation-screen");
const progressFill = document.querySelector(".progress-fill");
const progressText = document.querySelector(".simulation-controls span:last-child");
const liveTag = document.querySelector(".live-tag");
const notice = document.querySelector(".simulation-notice");

const GRAVITY = 9.8;

// 기본 화면의 결과 초기화
function showResult(height, time, speed, energy) {
    resultCards[0].querySelector("strong").innerHTML =
        `${height.toFixed(1)} <small>m</small>`;

    resultCards[1].querySelector("strong").innerHTML =
        `${time.toFixed(2)} <small>s</small>`;

    resultCards[2].querySelector("strong").innerHTML =
        `${speed.toFixed(2)} <small>m/s</small>`;

    resultCards[3].querySelector("strong").innerHTML =
        `${energy.toFixed(2)} <small>J</small>`;
}

// 교육용 부위별 위험 단계
function getRiskLevel(energy, bodyPart) {

    // 충돌 부위별 가중치
    const bodyWeights = {
    head: 1.0,
    shoulder: 0.7,
    foot: 0.5
};

    const adjustedEnergy = energy * bodyWeights[bodyPart];

    if (adjustedEnergy < 20) {
        return {
            title: "쪼매 아픔",
            description: "쪼매 아프다 멍 들수도"
        };
    } else if (adjustedEnergy < 50) {
        return {
            title: "아픔",
            description: "병원 가야할걸?"
        };
    } else if (adjustedEnergy < 200) {
        return {
            title: "골절 위험",
            description: "최소 골절 그래도 살 수는 있을거야"
        };
    } else {
        return {
            title: "사망 예상",
            description: "앞으로 눈 못 뜰거야 조심해"
        };
    }
}

// 시뮬레이션 실행
function startSimulation() {

    const floor = Number(floorInput.value);
    const mass = Number(massInput.value);
    const personHeight = Number(heightInput.value);
    
    const bodyPart = bodyPartInput.value;
    const airResistance = airInput.checked;
    

    // 입력값 확인
    if (!Number.isFinite(mass) || mass < 0.1 || mass > 20) {
        alert("물체 질량은 0.1~20kg 사이로 입력해 주세요.");
        return;
    }

    if (!Number.isFinite(personHeight) ||
        personHeight < 150 || personHeight > 200) {
        alert("사람 키는 150~200cm 사이로 입력해 주세요.");
        return;
    }

    // 층당 3m
    const totalHeight = floor * 3;

    // 사람 키를 고려한 단순화된 낙하 거리
    const bodyHeight = personHeight / 100;
    const collisionHeight = {
        head: bodyHeight,
        shoulder: bodyHeight * 0.78,
        foot: 0
    };

    const fallDistance = Math.max(
        0,
        totalHeight - collisionHeight[bodyPart]
    );

    // 공기 저항을 적용하지 않은 자유 낙하 계산
    let time = Math.sqrt(2 * fallDistance / GRAVITY);
    let speed = GRAVITY * time;

    // 교육용 단순 공기 저항 모델
    if (airResistance) {
        speed *= 0.85;
        time = fallDistance > 0 ? (2 * fallDistance / speed) : 0;
    }

    // 운동에너지 계산
const energy = 0.5 * mass * speed * speed;

// 계산값 확인
console.log("입력된 사람 키:", personHeight);
console.log("충돌 부위:", bodyPart);
console.log("낙하 거리:", fallDistance);
console.log("충돌 속도:", speed);
console.log("운동에너지:", energy);

// 결과 표시
showResult(totalHeight, time, speed, energy);

    // 결과 표시
    showResult(totalHeight, time, speed, energy);

    // 위험 안내 표시
    const risk = getRiskLevel(energy, bodyPart);
    riskStatus.innerHTML = `<span class="risk-indicator"></span>${risk.title}`;
    riskDescription.textContent = risk.description;


// 낙하 물체 애니메이션
const oldObject = simulationScreen.querySelector(".falling-object");
const oldReaction = simulationScreen.querySelector(".capybara-reaction");

if (oldObject) oldObject.remove();
if (oldReaction) oldReaction.remove();

// 이전 사람 캐릭터 제거
const oldPerson = simulationScreen.querySelector(".person-character");
if (oldPerson) oldPerson.remove();


// 카피바라 이미지
const fallingObject = document.createElement("img");
fallingObject.src = "images/capybara.png";
fallingObject.className = "falling-object";
fallingObject.alt = "낙하하는 카피바라";
// 카피바라를 시뮬레이션 화면에 추가
simulationScreen.appendChild(fallingObject);


// 바닥에 사람 캐릭터 추가
const person = document.createElement("div");
person.className = "person-character";

// 사람 머리
const personHead = document.createElement("div");
personHead.className = "person-head";

// 얼굴 사진이 있으면 사진 적용
if (selectedFaceImage) {
    const faceImage = document.createElement("img");

    faceImage.src = selectedFaceImage;
    faceImage.className = "person-face";
    faceImage.alt = "업로드한 사람 얼굴";

    personHead.appendChild(faceImage);
} else {
    // 사진이 없으면 기본 얼굴
    personHead.textContent = "🙂";
}

person.appendChild(personHead);

// 사람 몸통
const personBody = document.createElement("div");
personBody.className = "person-body";

person.appendChild(personBody);
// 사람 발
const personFeet = document.createElement("div");
personFeet.className = "person-feet";

person.appendChild(personFeet);
simulationScreen.appendChild(person);



// 표정 표시
const capybaraReaction = document.createElement("div");
capybaraReaction.className = "capybara-reaction";
capybaraReaction.textContent = "😳";

simulationScreen.appendChild(capybaraReaction);

// 사람 캐릭터의 실제 위치를 기준으로 낙하 거리 계산
const screenRect = simulationScreen.getBoundingClientRect();
const personRect = person.getBoundingClientRect();

let targetY;

if (bodyPart === "head") {
    targetY = personHead.getBoundingClientRect().top;
} else if (bodyPart === "shoulder") {
    targetY = personBody.getBoundingClientRect().top;
} else {
    targetY = personFeet.getBoundingClientRect().top;
}

const objectStartY = fallingObject.getBoundingClientRect().top;

const animationDistance = targetY - objectStartY;

fallingObject.style.setProperty(
    "--fall-distance",
    `${animationDistance}px`
);
// 낙하 시작

fallingObject.classList.remove("drop");

void fallingObject.offsetWidth;

requestAnimationFrame(() => {
    fallingObject.classList.add("drop");
});


// 카피바라가 도착하면 충돌 효과
fallingObject.addEventListener("animationend", () => {
    capybaraReaction.textContent = "😵";

    // 선택한 충돌 부위에 맞는 효과
    if (bodyPart === "head") {
    personHead.classList.add("hit-head");

    // 머리 충돌이고 운동에너지가 200J 이상이면 쓰러짐
    if (energy >= 200) {
        person.classList.add("fall-down");
    }
}
    else if (bodyPart === "shoulder") {
        personBody.classList.add("hit-shoulder");
    } 
    else if (bodyPart === "foot") {
        personFeet.classList.add("hit-foot");
    }

    // 화면 흔들림
    simulationScreen.classList.add("impact");
// 바닥에 충격파 생성
const ripple = document.createElement("div");
ripple.className = "impact-ripple";
simulationScreen.appendChild(ripple);

// 충격파 제거
setTimeout(() => {
    ripple.remove();
}, 700);
    // 효과가 끝나면 제거
    setTimeout(() => {
        personHead.classList.remove("hit-head");
        personBody.classList.remove("hit-shoulder");
        personFeet.classList.remove("hit-foot");
        simulationScreen.classList.remove("impact");
    }, 600);
});




    // 진행 상태 표시const falling
   
progressFill.style.width = "0%";
progressText.textContent = "0%";

const startTime = performance.now();

function updateProgress(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / 2000, 1);
    const percent = Math.round(progress * 100);

    progressFill.style.width = percent + "%";
    progressText.textContent = percent + "%";

    if (progress < 1) {
        requestAnimationFrame(updateProgress);
    }
}

requestAnimationFrame(updateProgress);

    liveTag.textContent = "● COMPLETE";

    simulationMessage.innerHTML = `
        <div class="big-icon">✓</div>
        <h3>계산 완료!</h3>
        <p>낙하 조건에 따른 물리 계산이 완료되었습니다.</p>
        <p>충돌 부위: ${bodyPart === "head" ? "머리" : bodyPart === "shoulder" ? "어깨" : "발"}</p>
    `;

    notice.textContent = "ⓘ 계산 결과는 단순화된 교육용 물리 모델입니다.";

}

// 설정 초기화
function resetSimulation() {

    floorInput.value = "10";
    massInput.value = "1";
    heightInput.value = "170";
    bodyPartInput.value = "head";
    airInput.checked = false;
faceInput.value = "";

// 업로드한 얼굴 사진 초기화
selectedFaceImage = "";

const preview = document.getElementById("face-preview");

if (preview) {
    preview.remove();
}
    showResult(30, 0, 0, 0);

    riskStatus.innerHTML =
        '<span class="risk-indicator"></span>계산 대기 중';

    riskDescription.textContent =
        "시뮬레이션을 실행하면 물리 계산을 바탕으로 교육용 위험 안내가 표시됩니다.";

    simulationMessage.innerHTML = `
        <div class="big-icon">⬇</div>
        <h3>시뮬레이션 대기 중</h3>
        <p>왼쪽에서 낙하 조건을 설정한 후<br>
        시뮬레이션 시작 버튼을 눌러주세요.</p>
    `;

    progressFill.style.width = "0%";
    progressText.textContent = "0%";
    liveTag.textContent = "● READY";

    notice.textContent =
        "ⓘ 현재 화면은 시뮬레이션 실행 전 대기 화면입니다.";

}

// 얼굴 이미지 미리보기
faceInput.addEventListener("change", function () {

    const file = faceInput.files[0];

    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("JPG 또는 PNG 이미지 파일을 선택해 주세요.");
        faceInput.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
     selectedFaceImage = event.target.result;
        let preview = document.getElementById("face-preview");

        if (!preview) {
            preview = document.createElement("img");
            preview.id = "face-preview";
            preview.style.width = "90px";
            preview.style.height = "90px";
            preview.style.objectFit = "cover";
            preview.style.borderRadius = "50%";
            preview.style.display = "block";
            preview.style.margin = "12px auto";

            faceInput.parentElement.appendChild(preview);
        }

        preview.src = event.target.result;
    };

    reader.readAsDataURL(file);
});

// 버튼 연결
startButton.addEventListener("click", startSimulation);
resetButton.addEventListener("click", resetSimulation);

