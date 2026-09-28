const messageState = document.getElementById("messageState");
const message = document.querySelector(".message");
const heart = document.querySelector(".heart");
const instruction = document.querySelector(".instruction");
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


/* =========================
   НАСТРОЙКА СООБЩЕНИЯ
========================= */

message.classList.add("closed", "no-anim");


/* =========================
   ОТКРЫТИЕ / ЗАКРЫТИЕ ПИСЬМА
========================= */

messageState.addEventListener("change", () => {
	message.classList.remove("openNor", "closeNor");

	if (messageState.checked) {

		// Убираем подсказку "кликни на сердечко"
		instruction.classList.add("is-hidden");

		message.classList.remove("closed", "no-anim");
		message.classList.add("openNor");

		heart.classList.remove("closeHer", "openedHer", "no-anim");
		heart.classList.add("openHer");

		mainContainer.style.backgroundColor = "#f48fb1";

		return;
	}

	// Возвращаем подсказку
	instruction.classList.remove("is-hidden");

	message.classList.remove("no-anim");
	message.classList.add("closeNor");

	heart.classList.remove("openHer", "openedHer");
	heart.classList.add("closeHer");

	mainContainer.style.backgroundColor = "#fce4ec";
});


/* =========================
   АНИМАЦИЯ ПИСЬМА
========================= */

message.addEventListener("animationend", () => {

	if (message.classList.contains("closeNor")) {
		message.classList.add("closed");
	}

	message.classList.remove("openNor", "closeNor");
	message.classList.add("no-anim");
});


/* =========================
   АНИМАЦИЯ СЕРДЦА
========================= */

heart.addEventListener("animationend", () => {

	if (heart.classList.contains("closeHer")) {

		heart.classList.add("no-anim");
		heart.classList.remove("beating");

	} else {

		heart.classList.add("openedHer", "beating");
	}

	heart.classList.remove("openHer", "closeHer");
});


/* =========================
   СБРОС ОКНА ВОПРОСА
========================= */

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


/* =========================
   ОТКРЫТЬ ВОПРОС
========================= */

questionButton.addEventListener("click", () => {

	resetQuestion();

	questionProject.hidden = false;

	yesButton.focus();
});


/* =========================
   ЗАКРЫТЬ ВОПРОС
========================= */

questionBack.addEventListener("click", () => {

	questionProject.hidden = true;
});


/* =========================
   КНОПКА "НЕ" УБЕГАЕТ
========================= */

noButton.addEventListener("pointerenter", () => {

	const bounds = questionCard.getBoundingClientRect();

	const maxLeft = Math.max(
		0,
		bounds.width - noButton.offsetWidth
	);

	const maxTop = Math.max(
		100,
		bounds.height - noButton.offsetHeight
	);

	noButton.style.left =
		`${Math.random() * maxLeft}px`;

	noButton.style.top =
		`${100 + Math.random() * (maxTop - 100)}px`;
});


/* =========================
   TELEGRAM
   CLOUDFLARE WORKER
========================= */

const WORKER_URL =
	"https://mylove-telegram.numon-ishmatov2006.workers.dev";


async function sendAnswer(answerText) {

	try {

		const response = await fetch(WORKER_URL, {

			method: "POST",

			headers: {
				"Content-Type": "application/json"
			},

			body: JSON.stringify({
				answer: answerText
			})
		});

		if (!response.ok) {
			throw new Error(
				`Worker returned ${response.status}`
			);
		}

		console.log("Ответ успешно отправлен:", answerText);

	} catch (error) {

		console.error(
			"Ошибка при отправке ответа:",
			error
		);
	}
}


/* =========================
   КНОПКА "ҲО"
========================= */

yesButton.addEventListener("click", () => {

	// Отправляем ответ в Telegram
	sendAnswer("Ҳо (Да) 💖");

	// Скрываем вопрос
	questionCard.hidden = true;

	// Показываем загрузку
	answerLoader.hidden = false;

	// Через 3 секунды показываем результат
	answerTimeout = setTimeout(() => {

		answerLoader.hidden = true;

		answerResult.hidden = false;

		resultVideo.play().catch((error) => {

			console.error(
				"Could not play the result video:",
				error
			);

		});

	}, 3000);
});


/* =========================
   КНОПКА "НЕ"
========================= */

noButton.addEventListener("click", () => {

	// Отправляем ответ в Telegram
	sendAnswer("Не (Нет) 💔");

});
