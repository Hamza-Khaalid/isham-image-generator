let timerInterval;
let imageURL = ""; // Variable to store the generated image URL

async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
    {
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.blob();
  return URL.createObjectURL(result); // Returns the URL for the image blob
}

function startTimer() {
  const timerDisplay = document.getElementById("timer");
  let startTime = Date.now();

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    timerDisplay.textContent = (elapsedTime / 1000).toFixed(2) + "s";
  }, 10); // Update every 10 milliseconds
}

function stopTimer() {
  clearInterval(timerInterval);
}

async function generateImage() {
  const promptInput = document.getElementById("promptInput");
  const outputContainer = document.getElementById("outputContainer");
  const spinner = document.createElement("div");
  const timer = document.createElement("div");

  spinner.classList.add("spinner");
  timer.classList.add("timer");
  timer.id = "timer";

  if (!promptInput.value.trim()) {
    alert("Please enter a description");
    return;
  }

  outputContainer.innerHTML = "";
  outputContainer.appendChild(spinner);
  outputContainer.appendChild(timer);

  startTimer();

  try {
    imageURL = await query({ inputs: promptInput.value });

    spinner.style.display = "none";
    timer.style.display = "none";
    stopTimer();

    outputContainer.innerHTML = `
          <div class="image-container">
            <img src="${imageURL}" alt="Generated Image" />
            <a href="${imageURL}" download="generated-image.png" class="download-icon" title="Download Image">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 16l4-4h-3V4h-2v8H8l4 4zm6 2H6v2h12v-2z"/></svg>
            </a>
          </div>
        `;
  } catch (error) {
    console.error("Error generating image:", error);
    spinner.style.display = "none";
    timer.style.display = "none";
    stopTimer();
    outputContainer.innerHTML =
      "<p>Error generating image. Please try again later.</p>";
  }
}
