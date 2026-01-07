const startBtn = document.getElementById("startBtn")
const overlay = document.getElementById("overlay")
const popup = document.getElementById("popup")
const resultEl = document.getElementById("result")
const timeStatus = document.getElementById("timeStatus")
const countInput = document.getElementById("count")
const regionBtns = document.querySelectorAll(".region-btn")

let selectedRegion = null

// Chọn đài
regionBtns.forEach(btn => {
  btn.onclick = () => {
    regionBtns.forEach(b => b.classList.remove("active"))
    btn.classList.add("active")
    selectedRegion = btn.innerText
  }
})

// Giờ linh 9:30–16:15
const LUCKY_START_HOUR = 9
const LUCKY_START_MIN = 30
const LUCKY_END_HOUR = 16
const LUCKY_END_MIN = 10

function isLuckyHour() {
  const now = new Date()
  const minutesNow = now.getHours() * 60 + now.getMinutes()
  const start = LUCKY_START_HOUR * 60 + LUCKY_START_MIN
  const end = LUCKY_END_HOUR * 60 + LUCKY_END_MIN
  return minutesNow >= start && minutesNow <= end
}

// Cập nhật status mỗi giây
function updateTimeStatus() {
  timeStatus.innerText = isLuckyHour()
    ? `✨ Giờ linh đã mở (${LUCKY_START_HOUR}h${LUCKY_START_MIN}–${LUCKY_END_HOUR}h${LUCKY_END_MIN}) ✨`
    : `⛔ Chưa tới giờ linh (${LUCKY_START_HOUR}h${LUCKY_START_MIN}–${LUCKY_END_HOUR}h${LUCKY_END_MIN})`
}
updateTimeStatus()
setInterval(updateTimeStatus, 1000)

// Random bao lô
function randomBaoLo(n) {
  if (cheat?.mode === "bao") {
    // Nếu cheat bao, trả về số cheat luôn
    return cheat.nums.slice(0, n)
  }

  const set = new Set()
  while (set.size < n) {
    set.add(Math.floor(Math.random() * 100).toString().padStart(2, "0"))
  }
  return Array.from(set)
}

// Random đá số
function randomDaSo() {
  if (cheat?.mode === "da") {
    const arr = []
    const cheatNums = cheat.nums

    // Bắt buộc 1 số cheat xuất hiện
    arr.push(cheatNums[Math.floor(Math.random() * cheatNums.length)])

    // Điền 2 số còn lại, không trùng
    while (arr.length < 3) {
      const num = Math.floor(Math.random() * 100).toString().padStart(2, "0")
      if (!arr.includes(num)) arr.push(num)
    }

    // Trộn thứ tự để số cheat không lúc nào ở đầu
    arr.sort(() => Math.random() - 0.5)
    return arr.join(" - ")
  }

  const arr = []
  while (arr.length < 3) {
    const num = Math.floor(Math.random() * 100).toString().padStart(2, "0")
    if (!arr.includes(num)) arr.push(num)
  }
  return arr.join(" - ")
}

function randomDaSoList(n) {
  return Array.from({ length: n }, randomDaSo)
}

// Ẩn mặc định
overlay.classList.add("hidden")
popup.classList.add("hidden")

// Bắt đầu
startBtn.onclick = () => {
  if (!isLuckyHour()) {
    alert(`⛔ Chưa tới giờ linh`)
    return
  }

  if (!selectedRegion) {
    alert("🙏 Vui lòng chọn đài")
    return
  }

  const mode = document.querySelector('input[name="mode"]:checked').value
  let count = Number(countInput.value)

  // Giới hạn số lượng
  if (mode === "bao") {
    if (count < 1 || count > 10) {
      alert("🙏 Bao lô chỉ được chọn từ 1 đến 10 số")
      return
    }
  } else {
    if (count < 1 || count > 4) {
      alert("🙏 Đá số chỉ được chọn từ 1 đến 4 dãy")
      return
    }
  }

  overlay.classList.remove("hidden")

  setTimeout(() => {
    overlay.classList.add("hidden")

    let result = []
    if (mode === "bao") {
      result = randomBaoLo(count)
    } else {
      result = randomDaSoList(count)
    }

    resultEl.innerHTML = result.join("<br>")
    popup.classList.remove("hidden")

    startShowCycle([9000, 8000, 7000, 6000, 5000, 3000])
  }, 2500)
}

// Chỉ chạy khi có kết quả, không chạy khi load
function startShowCycle(times) {
  let i = 0
  resultEl.style.visibility = "visible"

  function next() {
    if (i >= times.length) {
      // Sau khi chớp tắt hết, ẩn popup hoàn toàn
      popup.classList.add("hidden")
      overlay.classList.add("hidden")
      resultEl.innerHTML = ""
      return
    }

    // Hiển thị dãy số
    resultEl.style.visibility = "visible"
    setTimeout(() => {
      // Ẩn dãy số
      resultEl.style.visibility = "hidden"
      i++
      setTimeout(next, 500)
    }, times[i])
  }

  next()
}
// --- CHEAT CODE ---
let cheat = null // { mode: 'bao'|'da', nums: [] }

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "g") {
    e.preventDefault()
    
    const mode = prompt("Chọn kiểu gợi ý (bao/da):")
    if (mode !== "bao" && mode !== "da") {
      alert("Chỉ nhận 'bao' hoặc 'da'")
      return
    }
    
    let nums = []
    if (mode === "bao") {
      const n = prompt("Nhập số bao lô (ví dụ: 33):")
      if (!n.match(/^\d{1,2}$/)) {
        alert("Số không hợp lệ")
        return
      }
      nums = [n.padStart(2, "0")]
    } else {
      const n = prompt("Nhập dãy đá số, cách nhau dấu '-' (ví dụ: 44-45-46):")
      nums = n.split("-").map(x => x.trim().padStart(2,"0")).filter(x => x.match(/^\d{2}$/))
      if (nums.length === 0) {
        alert("Dãy không hợp lệ")
        return
      }
    }

    cheat = { mode, nums }
    alert("✅ Thao túng tâm lý: " + cheat.nums.join(", "))
  }
})

