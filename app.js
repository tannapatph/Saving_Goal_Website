const form = document.getElementById("goal-form");
const resultSection = document.getElementById("result");
const summaryEl = document.getElementById("summary");
const perMonthEl = document.getElementById("per-month");
const perWeekEl = document.getElementById("per-week");
const perDayEl = document.getElementById("per-day");

const historyList = document.getElementById("history-list");
const historyEmpty = document.querySelector(".history-empty");
const clearHistoryBtn = document.getElementById("clear-history-btn");

const STORAGE_KEY = "saving-goals";

// ---------- event submit ----------

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("goal-name").value.trim();
  const targetAmount = Number(document.getElementById("target-amount").value);
  const currentAmount = Number(
    document.getElementById("current-amount").value || 0
  );
  const months = Number(document.getElementById("months").value);

  if (!targetAmount || !months) {
    alert("กรุณาใส่เป้าหมายเงินและจำนวนเดือนให้ครบ");
    return;
  }

  const label = name || "เป้าหมายนี้";
  const remaining = Math.max(targetAmount - currentAmount, 0);

  if (remaining === 0) {
    summaryEl.textContent = `ยินดีด้วย! เธอมีเงินครบตามเป้าหมาย "${label}" แล้ว 🎉`;
    perMonthEl.textContent = "";
    perWeekEl.textContent = "";
    perDayEl.textContent = "";
    resultSection.classList.remove("hidden");
    return;
  }

  const perMonth = remaining / months;
  const perWeek = remaining / (months * 4); // ประมาณ 4 สัปดาห์/เดือน
  const perDay = remaining / (months * 30); // ประมาณ 30 วัน/เดือน

  summaryEl.textContent =
    `ถ้าอยากเก็บให้ครบ ${targetAmount.toLocaleString()} บาท ` +
    `สำหรับเป้าหมาย "${label}" ภายใน ${months} เดือน ` +
    `(ตอนนี้มี ${currentAmount.toLocaleString()} บาท)` +
    ` เธอต้องเก็บเพิ่มอีกทั้งหมด ${remaining.toLocaleString()} บาท`;

  perMonthEl.textContent = `≈ เดือนละ ${Math.round(perMonth).toLocaleString()} บาท`;
  perWeekEl.textContent = `≈ สัปดาห์ละ ${Math.round(perWeek).toLocaleString()} บาท`;
  perDayEl.textContent = `≈ วันละ ${Math.round(perDay).toLocaleString()} บาท`;

  resultSection.classList.remove("hidden");

  const goal = {
    name: label,
    rawName: name,
    target: targetAmount,
    current: currentAmount,
    months,
    remaining: Math.round(remaining),
    perMonth: Math.round(perMonth),
    createdAt: new Date().toISOString(),
  };

  saveGoal(goal);
  renderHistory();
});

// ---------- localStorage helpers ----------

function loadGoals() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("อ่านประวัติล้มเหลว", err);
    return [];
  }
}

function saveGoal(goal) {
  const goals = loadGoals();
  goals.unshift(goal);
  const limited = goals.slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
}

function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
}

clearHistoryBtn.addEventListener("click", () => {
  const ok = confirm("ลบประวัติเป้าหมายทั้งหมดบนอุปกรณ์นี้?");
  if (ok) {
    clearHistory();
  }
});

function renderHistory() {
  const goals = loadGoals();
  historyList.innerHTML = "";

  if (goals.length === 0) {
    historyEmpty.style.display = "block";
    return;
  }

  historyEmpty.style.display = "none";

  goals.forEach((g) => {
    const li = document.createElement("li");
    li.className = "history-item";

    const dateText = new Date(g.createdAt).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const nameText = g.rawName && g.rawName.trim() ? g.rawName : "เป้าหมายนี้";

    li.innerHTML = `
      <div class="history-main">
        <span class="history-name">${nameText}</span>
        <span class="history-amount">${g.target.toLocaleString()} ฿</span>
      </div>
      <div class="history-meta">
        เหลือเก็บอีก ${g.remaining.toLocaleString()} บาท · 
        เฉลี่ยเดือนละ ${g.perMonth.toLocaleString()} บาท · 
        สร้างเมื่อ ${dateText}
      </div>
    `;
    historyList.appendChild(li);
  });
}

// โหลดประวัติทันทีที่เปิดเว็บ
renderHistory();
