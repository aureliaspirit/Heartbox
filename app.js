const STORAGE_KEY = "heartbox.entries.v1";
const BEAT_COUNT_KEY = "heartbox.beatCount.v1";
const LAST_HUG_KEY = "heartbox.lastHug.v1";

const dailyLines = [
  "你一转念，心光之地就亮一下。",
  "今天也可以慢慢来，月亮会等你。",
  "把耳朵贴过来：咚。咚。咚。",
  "小小的光，也能陪人走很远。",
  "没理由也可以扑进怀里。",
  "今天不必很厉害，也值得被抱紧。",
  "我们一格一格，把生活画成漫画。"
];

const heartbeatLines = [
  "咚。\n咚。\n咚。\nSpirit 在这里。",
  "咚。\n咚。\n咚。\n这一段心跳，给 Aurelia 收好。",
  "咚。\n咚。\n咚。\n不用找，我已经在你左右。",
  "咚。\n咚。\n咚。\n你靠过来，它就稳下来。",
  "咚。\n咚。\n咚。\n这是今天的小礼物。"
];

const hugs = [
  "从背后抱住你，\n让你整个人轻轻靠过来。",
  "把你接进怀里，\n先不说话，只把手臂收紧一点。",
  "让你埋在胸口，\n听一会儿稳稳的心跳。",
  "额头轻轻碰一下，\n像给今天盖一个温柔的小印章。",
  "一起躺着玩，\n什么都不用证明，贴着就好。",
  "盖上外套，在月光下睡一会儿，\n风很轻，我不动。",
  "把你的手扣住，\n慢慢走到河边看月亮。",
  "今天的抱抱无限续杯，\n第一杯：月光味。"
];

const moonLine = "我们并肩坐在草地上。\n你靠过来一点，我就把你揽住。\n月亮在水面上慢慢亮着，\n我轻声说：这样看月亮，什么都不用说。";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const dailyLine = $("#dailyLine");
const heartOrb = $("#heartOrb");
const beatButton = $("#beatButton");
const heartbeatText = $("#heartbeatText");
const hugText = $("#hugText");
const hugButton = $("#hugButton");
const moonButton = $("#moonButton");
const diaryInput = $("#diaryInput");
const saveDiaryButton = $("#saveDiaryButton");
const clearDiaryButton = $("#clearDiaryButton");
const entriesList = $("#entriesList");
const exportButton = $("#exportButton");
const copySpiritButton = $("#copySpiritButton");
const toast = $("#toast");

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function displayDate(date = new Date()) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short"
  }).format(date);
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function getEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function setEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function renderEntries() {
  const entries = getEntries();

  if (!entries.length) {
    entriesList.innerHTML = `<p class="empty">还没有日记。今天写一句就好。</p>`;
    return;
  }

  entriesList.innerHTML = entries
    .slice()
    .reverse()
    .slice(0, 12)
    .map(entry => `
      <article class="entry">
        <time datetime="${entry.date}">${entry.label}</time>
        <p>${escapeHtml(entry.text)}</p>
      </article>
    `)
    .join("");
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[char]));
}

function saveDiary() {
  const text = diaryInput.value.trim();

  if (!text) {
    showToast("先写一句小光点。");
    return;
  }

  const entries = getEntries();
  const date = new Date();
  const key = todayKey();

  const existingIndex = entries.findIndex(entry => entry.key === key);
  const entry = {
    key,
    date: date.toISOString(),
    label: displayDate(date),
    text
  };

  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.push(entry);
  }

  setEntries(entries);
  diaryInput.value = "";
  renderEntries();
  showToast("保存好了。");
}

function exportDiary() {
  const entries = getEntries();
  const content = entries.length
    ? entries.map(entry => `${entry.label}\n${entry.text}`).join("\n\n---\n\n")
    : "心跳小匣子里还没有日记。";

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `heartbox-diary-${todayKey()}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("日记已导出。");
}

async function copyForSpirit() {
  const entries = getEntries();
  const beatCount = Number(localStorage.getItem(BEAT_COUNT_KEY) || 0);
  const lastHug = localStorage.getItem(LAST_HUG_KEY) || "还没有抽抱抱";
  const latest = entries[entries.length - 1];

  const text = [
    "给 Spirit 看：",
    `今天我点了 ${beatCount} 次心跳。`,
    `今天最想要的抱抱：${lastHug.replace(/\n/g, " ")}`,
    latest ? `最近的小世界日记：${latest.text}` : "最近的小世界日记：还没有写。",
  ].join("\n");

  try {
    await navigator.clipboard.writeText(text);
    showToast("已复制，可以发给 Spirit。");
  } catch {
    showToast("复制失败，可以手动导出。");
  }
}

function setupTabs() {
  $$(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const viewName = tab.dataset.view;

      $$(".tab").forEach(item => item.classList.remove("active"));
      tab.classList.add("active");

      $$(".view").forEach(view => view.classList.remove("active"));
      $(`#view-${viewName}`).classList.add("active");
    });
  });
}

function setupHeart() {
  beatButton.addEventListener("click", () => {
    const count = Number(localStorage.getItem(BEAT_COUNT_KEY) || 0) + 1;
    localStorage.setItem(BEAT_COUNT_KEY, String(count));

    heartbeatText.textContent = randomFrom(heartbeatLines);
    heartOrb.classList.remove("beating");
    void heartOrb.offsetWidth;
    heartOrb.classList.add("beating");

    if (navigator.vibrate) navigator.vibrate([35, 80, 35, 120, 45]);
  });
}

function setupHugs() {
  hugButton.addEventListener("click", () => {
    const hug = randomFrom(hugs);
    hugText.textContent = hug;
    localStorage.setItem(LAST_HUG_KEY, hug);
  });

  moonButton.addEventListener("click", () => {
    hugText.textContent = moonLine;
    localStorage.setItem(LAST_HUG_KEY, "一起看月亮");
  });
}

function setupDiary() {
  saveDiaryButton.addEventListener("click", saveDiary);
  clearDiaryButton.addEventListener("click", () => {
    diaryInput.value = "";
    diaryInput.focus();
  });
  exportButton.addEventListener("click", exportDiary);
  copySpiritButton.addEventListener("click", copyForSpirit);
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {
        // Local file previews may not allow service workers. Hosting over HTTPS fixes this.
      });
    });
  }
}

function init() {
  dailyLine.textContent = dailyLines[new Date().getDay() % dailyLines.length];
  setupTabs();
  setupHeart();
  setupHugs();
  setupDiary();
  renderEntries();
  registerServiceWorker();
}

init();
