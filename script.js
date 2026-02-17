const GAS_URL = "https://script.google.com/macros/s/AKfycbySPYLiPf6pUhZqbHMSK2z2eYtrzVWrPUweojAoCG8_15IrxQH0dhTOiXp1gf58dpiEQg/exec"; 

const PRICE_MAP = {      
  '201': { weekday: { 1: 1900 }, weekend: { 1: 2200 }, cny: { 1: 2900 } },      
  '202': { weekday: { 1: 2400, 2: 2600 }, weekend: { 1: 2600, 2: 2800 }, cny: { 1: 5600, 2: 6000 } },      
  '301': { weekday: { 1: 3500, 2: 4500, 3: 5000, 4: 5500 }, weekend: { 1: 3800, 2: 4800, 3: 5300, 4: 5800 }, cny: { 1: 6000, 2: 7000, 3: 8000, 4: 9000 } }      
};

const TPL_DATA = [      
  { cat: '訂房', title: '有空房回覆', content: (d) => `👋您好～煦願民宿 ${d} 有空房，每間房都有陽台\n✅電動麻將桌✅藍芽麥克風音響✅廚房可煮火鍋\n私訊訂房可享優惠～\n官網：wishstaybnb.com` },      
  { cat: '訂房', title: '匯款資訊', content: (d,p,dep) => `中華郵政（700）\n帳號：0111334-0036797\n戶名：林奐廷\n需麻煩於 24 小時內匯入訂金 $${dep}，核對後即完成預定。` },      
  { cat: '入住', title: '今日大門密碼', content: (d,p) => `🌟今日大門密碼：${p}\n🔓開門：手掌觸碰螢幕亮起後輸入密碼按*` },
  { cat: '設施', title: '麥克風教學', content: () => `🎤藍牙麥克風使用說明：\nhttps://m.youtube.com/shorts/8LMhA15R870\n（唱歌請於 10:00 PM 前結束喔！）` },
  { cat: '退房', title: '五星好評', content: () => `若您滿意此次入住，歡迎給我們五星好評，感謝您💕\nhttps://maps.app.goo.gl/vcoPQQuMRaME1rpY6` }
];      

let globalOrderData = [];
let currentViewDate = new Date();
let currentView = 'cal'; // 'cal' 或 'list'

// --- 初始化與基礎功能 ---

window.onload = () => {
    // 2. 若已輸入過密碼就不用再次輸入
    const savedKey = localStorage.getItem('bnb_admin_key');
    if (savedKey) {
        document.getElementById('admin-key').value = savedKey;
        fetchOrders(); 
    }
    updateAll();
};

function toggleLoading(show) {
    document.getElementById('loading-mask').style.display = show ? 'flex' : 'none';
}

function switchPage(id, e) {
    document.querySelectorAll('.page, .tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(e) e.currentTarget.classList.add('active');
}

function updateAll() { updateTpl(); buildPackage(); }

function toggleAccordion(contentId, iconId) {
    const c = document.getElementById(contentId);
    c.classList.toggle('active');
    document.getElementById(iconId).innerText = c.classList.contains('active') ? '▲' : '▼';
}

// --- 模板與打包邏輯 ---

function updateTpl(filter = 'all') {
    const d = document.getElementById('v-date').value || "____";
    const p = document.getElementById('v-pwd').value || "____";
    const dep = document.getElementById('v-dep').value || "____";
    const list = document.getElementById('tpl-list');
    list.innerHTML = '';
    TPL_DATA.filter(i => filter === 'all' || i.cat === filter).forEach((item, i) => {
        const box = document.createElement('div'); box.className = 'card';
        box.innerHTML = `<h3>[${item.cat}] ${item.title}</h3><div class="preview-area" id="t-${i}">${item.content(d,p,dep)}</div><button class="copy-btn" onclick="copyText('t-${i}', event)">複製</button>`;
        list.appendChild(box);
    });
}

function filterCat(cat, e) {
    document.querySelectorAll('.cat-tag').forEach(el => el.classList.remove('active'));
    if(e) e.currentTarget.classList.add('active');
    updateTpl(cat);
}

function buildPackage() {
    const d = document.getElementById('v-date').value || "今天";
    const p = document.getElementById('v-pwd').value || "____";
    let pkg = `👋 您好！煦願小幫手提供入住資訊 (${d})：\n\n`;
    if(document.getElementById('c-basic').checked) pkg += `🌟 大門密碼：${p}\n🔑 鑰匙在電視櫃架上。\n----------------\n`;
    if(document.getElementById('c-amenity').checked) pkg += `🛁 備品：大小毛巾、洗沐系列，吧台零食免費。\n----------------\n`;
    if(document.getElementById('c-sing').checked) pkg += `🎤 唱歌：請於 10:00 前結束。\n----------------\n`;
    if(document.getElementById('c-form').checked) pkg += `✏️ 住宿資料：姓名、生日、身分證號、住址、電話。\n----------------\n`;
    pkg += `祝您入住愉快！☺️`;
    document.getElementById('pkg-preview').innerText = pkg;
}

// --- 房價計算 ---

function runManualCalc() {
    const s = document.getElementById('m-season').value;
    const rooms = ['201','202','301'];
    let totalBT = 0;
    rooms.forEach(rid => {
        const b = parseInt(document.getElementById('m-'+rid).value);
        if(b > 0) {
            const customPrice = parseFloat(document.getElementById('p-'+rid).value);
            totalBT += customPrice || PRICE_MAP[rid][s][b];
        }
    });
    const priv = Math.ceil((totalBT * 0.88 * 1.03) / 10) * 10;
    document.getElementById('calc-result').innerHTML = `
        <div class="card">
            <div class="highlight">Booking 總價：$${totalBT.toLocaleString()}</div>
            <div class="private-price">私訊優惠價：$${priv.toLocaleString()}</div>
            <div class="preview-area" id="p-res" style="margin-top:10px;">房價報價：私訊優惠價 $${priv.toLocaleString()}</div>
            <button class="copy-btn" onclick="copyText('p-res', event)">複製報價</button>
        </div>`;
}

// --- 訂單雲端作業 (CRUD) ---

// 3. 按下送出密碼要有載入中訊息
async function fetchOrders() {
    const key = document.getElementById('admin-key').value;
    toggleLoading(true);
    try {
        const res = await fetch(GAS_URL, { method: "POST", body: JSON.stringify({ action: "read", key: key }) });
        const data = await res.json();
        if(Array.isArray(data)) {
            globalOrderData = data;
            localStorage.setItem('bnb_admin_key', key); 
            document.getElementById('lock-screen').style.display = 'none';
            document.getElementById('order-content').style.display = 'block';
            renderOrderList();
        } else { alert("金鑰有誤"); }
    } catch(e) { alert("連線失敗"); }
    toggleLoading(false);
}

async function addOrder() {
    toggleLoading(true);
    const data = {
        action: "add", key: document.getElementById('admin-key').value,
        name: document.getElementById('o-name').value, date: document.getElementById('o-date').value,
        source: document.getElementById('o-source').value, guests: document.getElementById('o-guests').value,
        rooms: document.getElementById('o-rooms').value, total: document.getElementById('o-total').value,
        dep: document.getElementById('o-dep').value, bal: document.getElementById('o-total').value - document.getElementById('o-dep').value
    };
    await fetch(GAS_URL, { method: "POST", body: JSON.stringify(data) });
    alert("儲存成功"); fetchOrders();
    toggleLoading(false);
}

// --- 渲染視圖與切換 ---

// 4. 能切換月曆視圖/條列式卡片
function switchOrderView(type) {
    currentView = type;
    document.getElementById('btn-cal').classList.toggle('active', type === 'cal');
    document.getElementById('btn-list').classList.toggle('active', type === 'list');
    document.getElementById('calendar-grid').style.display = type === 'cal' ? 'grid' : 'none';
    document.getElementById('order-list').style.display = type === 'list' ? 'block' : 'none';
}

function renderOrderList() {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    document.getElementById('cal-month-title').innerText = `${year}年 ${month + 1}月`;
    
    const mData = globalOrderData.filter(r => r[3] && r[3].includes(monthStr));
    
    // 渲染月曆
    renderCalendar(year, month, mData);
    
    // 渲染條列卡片
    const listDiv = document.getElementById('order-list');
    listDiv.innerHTML = mData.map(r => `
        <div class="card" onclick="openEdit('${r[0]}')">
            <span class="source-tag ${r[1] === 'Booking' ? 'tag-booking' : 'tag-line'}">${r[1]}</span>
            <b>${r[3].slice(8)}日 | ${r[2]}</b>
            <div style="font-size:0.8rem; color:#666; margin-top:5px;">餘額: $${r[9]} / ${r[4]}</div>
        </div>
    `).join('');
    
    switchOrderView(currentView);
    updateStatistics(mData);
    calculateFinance(mData);
}

function renderCalendar(year, month, mData) {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';
    const bookedDates = {};
    mData.forEach(r => { bookedDates[parseInt(r[3].split('-')[2])] = r[0]; });

    const weeks = ['日', '一', '二', '三', '四', '五', '六'];
    weeks.forEach(w => grid.innerHTML += `<div class="cal-day cal-header">${w}</div>`);
    
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    
    for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div class="cal-day"></div>`;
    for (let day = 1; day <= lastDate; day++) {
        const oid = bookedDates[day];
        const activeClass = oid ? 'has-order' : '';
        // 5. 點擊月曆日期進入詳細資訊
        grid.innerHTML += `<div class="cal-day ${activeClass}" onclick="${oid ? `openEdit('${oid}')` : ''}">${day}</div>`;
    }
}

// --- 編輯、刪除與 App 連動 ---

function openEdit(oid) {
    const r = globalOrderData.find(o => o[0] === oid);
    if(!r) return;
    document.getElementById('e-oid').value = r[0];
    document.getElementById('e-source').value = r[1];
    document.getElementById('e-name').value = r[2];
    document.getElementById('e-date').value = r[3];
    document.getElementById('e-guests').value = r[5];
    document.getElementById('e-rooms').value = r[6];
    document.getElementById('e-total').value = r[7];
    document.getElementById('e-dep').value = r[8];

    document.getElementById('btn-pulse').style.display = r[1] === 'Booking' ? 'block' : 'none';
    document.getElementById('edit-modal').style.display = 'block';
}

function closeEditModal() { document.getElementById('edit-modal').style.display = 'none'; }

function openPulse() {
    window.location.href = "pulse://";
    setTimeout(() => { window.open("https://admin.booking.com/", "_blank"); }, 800);
}

async function submitUpdate() {
    toggleLoading(true);
    const data = {
        action: "update", key: document.getElementById('admin-key').value,
        oid: document.getElementById('e-oid').value,
        source: document.getElementById('e-source').value, name: document.getElementById('e-name').value,
        date: document.getElementById('e-date').value, guests: document.getElementById('e-guests').value,
        rooms: document.getElementById('e-rooms').value, total: document.getElementById('e-total').value,
        dep: document.getElementById('e-dep').value, bal: document.getElementById('e-total').value - document.getElementById('e-dep').value
    };
    await fetch(GAS_URL, { method: "POST", body: JSON.stringify(data) });
    closeEditModal(); fetchOrders();
}

async function submitDelete() {
    if(!confirm("確定要刪除此訂單嗎？")) return;
    toggleLoading(true);
    await fetch(GAS_URL, { method: "POST", body: JSON.stringify({ action: "delete", key: document.getElementById('admin-key').value, oid: document.getElementById('e-oid').value })});
    closeEditModal(); fetchOrders();
}

// --- 統計與輔助 ---

function updateStatistics(mData) {
    const totalG = mData.reduce((s, r) => s + (parseInt(r[5]) || 0), 0);
    const totalR = mData.reduce((s, r) => s + (parseInt(r[6]) || 0), 0);
    const bCount = mData.filter(r => r[1] === 'Booking').length;
    const totalC = mData.length;
    document.getElementById('stat-total-guests').innerText = totalG;
    document.getElementById('stat-total-rooms').innerText = totalR;
    const bRate = totalC ? Math.round((bCount/totalC)*100) : 0;
    document.getElementById('stat-b-rate').innerText = bRate + '%';
    document.getElementById('stat-o-rate').innerText = (100 - bRate) + '%';
}

function calculateFinance(mData) {
    const income = mData.reduce((s, r) => s + (parseFloat(r[7]) || 0), 0);
    const bTotal = mData.filter(r => r[1] === 'Booking').reduce((s, r) => s + (parseFloat(r[7]) || 0), 0);
    const fee = Math.round(bTotal * 0.12);
    const laundry = parseFloat(document.getElementById('laundry-cost').value) || 0;
    const utility = parseFloat(document.getElementById('utility-cost').value) || 0;
    document.getElementById('fin-income').innerText = '$' + income.toLocaleString();
    document.getElementById('fin-fee').innerText = '-$' + fee.toLocaleString();
    document.getElementById('fin-net').innerText = '$' + (income - fee - laundry - utility).toLocaleString();
}

function toggleStats() {
    const s = document.getElementById('stats-area');
    s.style.display = s.style.display === 'block' ? 'none' : 'block';
}

function changeMonth(n) {
    currentViewDate.setMonth(currentViewDate.getMonth() + n);
    renderOrderList();
}

function copyText(id, e) {
    const t = document.getElementById(id).innerText;
    navigator.clipboard.writeText(t);
    const btn = e.currentTarget;
    btn.innerText = "✅ 已複製";
    setTimeout(() => btn.innerText = "複製", 1000);
}