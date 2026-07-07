const NOTES = [
  { note: "E2", freq: 82.41 },
  { note: "A2", freq: 110.00 },
  { note: "D3", freq: 146.83 },
  { note: "G3", freq: 196.00 },
  { note: "B3", freq: 246.94 },
  { note: "E4", freq: 329.63 }
];

async function setupAudio() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(stream);

  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;

  source.connect(analyser);

  return { analyser, sampleRate: audioContext.sampleRate };
}

function getBuffer(analyser) {
  const buffer = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(buffer);
  return buffer;
}

function autoCorrelate(buffer, sampleRate) {
  let SIZE = buffer.length;
  let rms = 0;

  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / SIZE);

  // Noise gate filter
  if (rms < 0.01) return -1;

  let c = new Array(SIZE).fill(0);
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE - i; j++) {
      c[i] += buffer[j] * buffer[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;

  let maxval = -1;
  let maxpos = -1;

  for (let i = d; i < SIZE; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }

  let T0 = maxpos;
  return sampleRate / T0;
}

function findClosestNote(freq) {
  let closest = NOTES[0];
  let minDiff = Math.abs(freq - closest.freq);

  for (let note of NOTES) {
    let diff = Math.abs(freq - note.freq);
    if (diff < minDiff) {
      closest = note;
      minDiff = diff;
    }
  }
  return closest;
}

function getCents(freq, refFreq) {
  return 1200 * Math.log2(freq / refFreq);
}

async function startTuner() {
  try {
    const { analyser, sampleRate } = await setupAudio();
    
    const noteEl = document.getElementById("note");
    const freqEl = document.getElementById("freq");
    const needleEl = document.getElementById("needle");
    const labelMatchEl = document.querySelector(".label-match");
    const startBtn = document.getElementById("startTunerBtn");

    startBtn.classList.add("running");
    startBtn.querySelector("h4").textContent = "TUNER ACTIVE";

    function update() {
      const buffer = getBuffer(analyser);
      const freq = autoCorrelate(buffer, sampleRate);

      if (freq !== -1 && isFinite(freq)) {
        const note = findClosestNote(freq);
        const cents = getCents(freq, note.freq);

        noteEl.innerText = note.note;
        freqEl.innerText = freq.toFixed(2) + " Hz";

        const clamped = Math.max(-50, Math.min(50, cents));
        const percent = 50 + clamped;
        needleEl.style.left = percent + "%";

        if (Math.abs(cents) <= 3) {
          noteEl.classList.add("in-tune");
          needleEl.classList.add("in-tune");
          labelMatchEl.classList.add("active");
        } else {
          noteEl.classList.remove("in-tune");
          needleEl.classList.remove("in-tune");
          labelMatchEl.classList.remove("active");
        }
      }

      requestAnimationFrame(update);
    }

    update();
  } catch (err) {
    console.error("Microphone access denied:", err);
    document.getElementById("startTunerBtn").querySelector("h4").textContent = "ACCESS DENIED";
  }
}

document.getElementById("startTunerBtn").addEventListener("click", () => {
    startTuner();
});
function toggleDropdown(name) {
  const target = document.getElementById(name);
  const dropdowns = document.getElementsByClassName("dropdown-content");
  
  for (let i = 0; i < dropdowns.length; i++) {
    const openDropdown = dropdowns[i];
    if (openDropdown !== target && openDropdown.classList.contains('show')) {
      openDropdown.classList.remove('show');
    }
  }
  target.classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
