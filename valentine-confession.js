const messageState = document.getElementById("messageState");
const message = document.querySelector(".message");
const heart = document.querySelector(".heart");
const mainContainer = document.querySelector(".container");
const questionProject = document.getElementById("questionProject");
const questionButton = document.getElementById("questionButton");
const questionBack = document.getElementById("questionBack");
const questionCard = document.getElementById("questionCard");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const answerLoader = document.getElementById("answerLoader");
const answerResult = document.getElementById("answerResult");
const resultVideo = document.getElementById("resultVideo");
let answerTimeout;

message.classList.add("closed", "no-anim");

messageState.addEventListener("change", () => {
	message.classList.remove("openNor", "closeNor");

	if (messageState.checked) {
		message.classList.remove("closed", "no-anim");
		message.classList.add("openNor");
		heart.classList.remove("closeHer", "openedHer", "no-anim");
		heart.classList.add("openHer");
		mainContainer.style.backgroundColor = "#f48fb1";
		return;
	}

	message.classList.remove("no-anim");
	message.classList.add("closeNor");
	heart.classList.remove("openHer", "openedHer");
	heart.classList.add("closeHer");
	mainContainer.style.backgroundColor = "#fce4ec";
});

message.addEventListener("animationend", () => {
	if (message.classList.contains("closeNor")) {
		message.classList.add("closed");
	}
	message.classList.remove("openNor", "closeNor");
	message.classList.add("no-anim");
});

heart.addEventListener("animationend", () => {
	if (heart.classList.contains("closeHer")) {
		heart.classList.add("no-anim");
		heart.classList.remove("beating");
	} else {
		heart.classList.add("openedHer", "beating");
	}
	heart.classList.remove("openHer", "closeHer");
});

function resetQuestion() {
	clearTimeout(answerTimeout);
	questionCard.hidden = false;
	answerLoader.hidden = true;
	answerResult.hidden = true;
	noButton.style.left = "";
	noButton.style.top = "";
	resultVideo.pause();
	resultVideo.currentTime = 0;
}

questionButton.addEventListener("click", () => {
	resetQuestion();
	questionProject.hidden = false;
	yesButton.focus();
});

questionBack.addEventListener("click", () => {
	questionProject.hidden = true;
});

noButton.addEventListener("pointerenter", () => {
	const bounds = questionCard.getBoundingClientRect();
	const maxLeft = Math.max(0, bounds.width - noButton.offsetWidth);
	const maxTop = Math.max(100, bounds.height - noButton.offsetHeight);

	noButton.style.left = `${Math.random() * maxLeft}px`;
	noButton.style.top = `${100 + Math.random() * (maxTop - 100)}px`;
});

// Функция для отправки уведомления в Cloudflare Worker с правильным адресом
async function sendAnswer(answerText) {
    try {
        await fetch("https://mylove-telegram.numon-ishmatov2006.workers.dev", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ answer: answerText }),
        });
    } catch (error) {
        console.error("Ошибка при отправке:", error);
    }
}

yesButton.addEventListener("click", () => {
	// Отправляем уведомление в Telegram при нажатии «Ҳо»
	sendAnswer("Ҳо (Да) 💖");

	questionCard.hidden = true;
	answerLoader.hidden = false;

	answerTimeout = setTimeout(() => {
		answerLoader.hidden = true;
		answerResult.hidden = false;
		resultVideo.play().catch((error) => {
			console.error("Could not play the result video:", error);
		});
	}, 3000);
});

noButton.addEventListener("click", () => {
	sendAnswer("Не (Нет) 💔");
});
