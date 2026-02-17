const GAS_URL = "https://script.google.com/macros/s/AKfycbySPYLiPf6pUhZqbHMSK2z2eYtrzVWrPUweojAoCG8_15IrxQH0dhTOiXp1gf58dpiEQg/exec"; 
const ADMIN_KEY = (123 * 914 + 39).toString();

const PRICE_MAP = {      
  '201': { weekday: { 1: 1900 }, weekend: { 1: 2200 }, cny: { 1: 2900 } },      
  '202': { weekday: { 1: 2400, 2: 2600 }, weekend: { 1: 2600, 2: 2800 }, cny: { 1: 5600, 2: 6000 } },      
  '301': { weekday: { 1: 3500, 2: 4500, 3: 5000, 4: 5500 }, weekend: { 1: 3800, 2: 4800, 3: 5300, 4: 5800 }, cny: { 1: 6000, 2: 7000, 3: 8000, 4: 9000 } }      
};

const TPL_DATA = [      
  { cat: '訂房', title: '有空房回覆(含介紹)', content: (d) => `👋您好～煦願民宿 ${d} 有空房，每間房都有陽台\n寬敞客廳備有：\n✅電動麻將桌✅藍芽麥克風音響✅桌遊✅廚房可煮火鍋，大長桌同樂自在輕鬆\n車庫最多可停放3輛車\n私訊訂房可享優惠～\n民宿設施可參考官網：wishstaybnb.com` },      
  { cat: '訂房', title: '匯款帳號資訊', content: (d,p,dep) => `中華郵政（代號700）\n帳號：0111334-0036797\n戶名：林奐廷\n需麻煩您於 24 小時內匯入訂金 $${dep}，核對後即完成預定。` },      
  { cat: '入住', title: '今日大門密碼', content: (d,p) => `煦願小幫手先介紹：\n🌟這邊先給您今日大門密碼：${p}\n🔓開門方法：\n（1）從外開門：手掌觸碰螢幕，按鍵亮起後輸入密碼按*字鍵\n（2）從裡面出去：按下安全鈕、手把同時下壓即可開門` },
  { cat: '入住', title: '鑰匙與拖鞋提醒', content: () => `🌟房間鑰匙配備在-電視櫃旁鑰匙架，歡迎使用\n隔天11點退房時，鑰匙放回架上，回傳照片即做好退房手續喔～\n\n🌟民宿拖鞋每一組客人離開後都清洗過，每一組客人都是專屬的室內拖鞋，請您放心使用～` },
  { cat: '設施', title: '備品與飲品說明', content: () => `🌟民宿室內全面禁菸，若有需要吸菸的朋友，我們每個陽台和車庫都備有煙灰缸，謝謝您🙏\n\n🌟民宿備有大、小毛巾、漱口杯、沐浴乳和洗髮精是用-沙威隆系列，並備有旋轉式按摩蓮蓬頭和吹風機\n\n🌟吧台上面的飲品和零食是免費為您們準備，請自行取用` },
  { cat: '設施', title: '麥克風教學', content: () => `🎤藍牙麥克風音響使用說明：\nhttps://m.youtube.com/shorts/8LMhA15R870\n（唱歌請於 10:00 前結束，後續可改玩電動麻將喔！）` },
  { cat: '烤肉', title: '代訂食材流程', content: () => `以下向您說明代訂烤肉食材的相關流程：\n1. 確認匯款後，我們將進行代訂服務。\n2. 貨物抵達後，民宿會先協助開箱檢查品項數量。\n3. 完成檢查後，我們會回傳照片給您確認。\n⚠️請於9:00前結束室外烤肉活動☺️` },
  { cat: '周邊', title: '阿信快炒折扣', content: () => `🍱 民宿走路2分鐘可到「阿信快炒」，報煦願民宿，享有 9.5 折優惠。` },
  { cat: '周邊', title: '超商與步道', content: () => `走路5分鐘可到7-11和美廉社，還有早午餐店\n7-11：https://maps.app.goo.gl/uskg6orv7dVas2eb7\n美聯社：https://maps.app.goo.gl/LNYRJGaVaj8GNxAy7\n\n分享很不錯的步道給您參考：\n仁山步道：https://maps.app.goo.gl/C9XisDS8qaQax11q6\n三清宮步道：https://maps.app.goo.gl/rmyyNfcdFHc8YdbX6` },      
  { cat: '退房', title: '住宿資料表', content: () => `麻煩您✏️住宿資料\n姓名：\n出生年月：\n身分證號：\n住址：\n電話：` },
  { cat: '退房', title: '五星好評連結', content: () => `有空歡迎幫您我們留言+5星好評，您的肯定是我們前進的動力！煦願民宿感謝您💕\nhttps://maps.app.goo.gl/vcoPQQuMRaME1rpY6` }
];      

let globalOrderData = [];
let currentViewDate = new Date();

function switchPage(id, e) {
    document.querySelectorAll('.page, .tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(e) e.currentTarget.classList.add('active');
}

function updateAll() { updateTpl(); buildPackage(); }

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

function toggleAccordion() {
    const c = document.getElementById('acc-content');
    c.classList.toggle('active');
    document.getElementById('acc-icon').innerText = c.classList.contains('active') ? '▲' : '▼';
}

function buildPackage() {
    const d = document.getElementById('v-date').value || "今天";
    const p = document.getElementById('v-pwd').value || "____";
    let pkg = `👋 您好！煦願小幫手先介紹入住資訊 (${d})：\n\n`;
    if(document.getElementById('c-basic').checked) pkg += `🌟 大門密碼：${p}\n🔓 開門：手掌觸碰螢幕亮起後輸入密碼按*\n🔑 鑰匙在電視櫃架上，退房放回即可。\n----------------\n`;
    if(document.getElementById('c-amenity').checked) pkg += `🛁 備品：大小毛巾、洗沐系列，吧台零食免費。\n⚠️ 不主動提供牙刷牙膏，沒帶請告知。\n----------------\n`;
    if(document.getElementById('c-sing').checked) pkg += `🎤 唱歌：請於 10:00 前結束，影片教學：https://m.youtube.com/shorts/8LMhA15R870\n----------------\n`;
    if(document.getElementById('c-nearby').checked) pkg += `🍱 快炒：阿信快炒報「煦願」享 9.5 折。\n----------------\n`;
    if(document.getElementById('c-form').checked) pkg += `✏️ 住宿資料：姓名、生日、身分證號、住址、電話。\n----------------\n`;
    pkg += `祝您入住愉快！☺️`;
    document.getElementById('pkg-preview').innerText = pkg;
}

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

async function fetchOrders() {
    const key = document.getElementById('admin-key').value;
    try {
        const res = await fetch(GAS_URL, { method: "POST", body: JSON.stringify({ action: "read", key: key }) });
        globalOrderData = await res.json();
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('order-content').style.display = 'block';
        renderOrderList();
    } catch(e) { alert("連線失敗"); }
}

async function addOrder() {
    const data = {
        action: "add", key: document.getElementById('admin-key').value,
        name: document.getElementById('o-name').value, date: document.getElementById('o-date').value,
        source: document.getElementById('o-source').value, guests: document.getElementById('o-guests').value,
        rooms: document.getElementById('o-rooms').value, total: document.getElementById('o-total').value,
        dep: document.getElementById('o-dep').value, bal: document.getElementById('o-total').value - document.getElementById('o-dep').value
    };
    await fetch(GAS_URL, { method: "POST", body: JSON.stringify(data) });
    alert("儲存成功"); fetchOrders();
}

function renderOrderList() {
    const monthStr = currentViewDate.toISOString().slice(0, 7);
    document.getElementById('cal-month-title').innerText = `${currentViewDate.getFullYear()}年 ${currentViewDate.getMonth()+1}月`;
    const mData = globalOrderData.filter(r => r[3] && r[3].includes(monthStr));
    document.getElementById('order-list').innerHTML = mData.map(r => `<div class="card" style="font-size:0.9rem;"><b>${r[3].slice(5)} | ${r[2]}</b> (${r[1]}) - 尾款:$${r[9]}</div>`).join('');
    updateStatistics(mData);
    calculateFinance(mData);
}

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

window.onload = () => { updateAll(); };