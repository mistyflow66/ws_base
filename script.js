const GAS_URL = "https://script.google.com/macros/s/AKfycbySPYLiPf6pUhZqbHMSK2z2eYtrzVWrPUweojAoCG8_15IrxQH0dhTOiXp1gf58dpiEQg/exec"; 

const PRICE_MAP = {      
  '201': { weekday: { 1: 1900 }, weekend: { 1: 2200 }, cny: { 1: 2900 } },      
  '202': { weekday: { 1: 2400, 2: 2600 }, weekend: { 1: 2600, 2: 2800 }, cny: { 1: 5600, 2: 6000 } },      
  '301': { weekday: { 1: 3500, 2: 4500, 3: 5000, 4: 5500 }, weekend: { 1: 3800, 2: 4800, 3: 5300, 4: 5800 }, cny: { 1: 6000, 2: 7000, 3: 8000, 4: 9000 } }      
};

const TPL_DATA = [
  { 
    cat: '詢問', 
    title: '空房回覆(含設施與官網)', 
    content: (d) => `👋您好～煦願民宿 ${d} 有空房，每間房都有陽台\n寬敞客廳備有：\n✅電動麻將桌✅藍芽麥克風音響✅桌遊✅廚房可煮火鍋，大長桌同樂自在輕鬆\n車庫最多可停放3輛車\n私訊訂房可享優惠～\n民宿設施可參考官網：\nwishstaybnb.com`
  },
  { 
  cat: '訂房', 
  title: '訂房確認(含尾款)', 
  // 這裡接收 (日期, 密碼, 訂金, 尾款)
  content: (d, p, dep, bal) => `確認訂房成功！\n入住日期：${d}\n總訂金：${dep}\n當日入住尾款：${bal}`
},
  { 
    cat: '詢問', 
    title: '詢問設備需求', 
    content: () => `需要幫您準備電動麻將桌、藍芽麥克風音箱、跳跳馬嗎？`
  },
  { 
    cat: '訂房', 
    title: '匯款帳號資訊', 
    content: (d,p,dep) => `中華郵政（代號700）\n帳號：0111334-0036797\n戶名：林奐廷`
  },
  { 
    cat: '訂房', 
    title: '代訂烤肉食材流程', 
    content: () => `以下向您說明代訂烤肉食材的相關流程：\n1. 確認匯款後，我們將立即為您進行代訂服務。\n\n2. 烤肉食材將由宅配公司配送。\n依以往經驗，如您預計在下午烤肉，建議食材需於中午前送達；若遇年節等貨運量較大的時期，請務必提前預訂，以確保能在時限內送達（冷凍配送），並保留足夠的退冰時間。\n\n3. 貨物抵達後，民宿會先協助開箱檢查，確認以下內容：\n-品項\n-數量\n-重量（克數）\n等資訊是否正確。\n\n4. 完成檢查後，我們會將現場照片回傳給您確認。\n\n感謝您的配合與支持！`
  },
  { 
    cat: '入住', 
    title: '今日指南(密碼/鑰匙/規範)', 
    content: (d,p) => `煦願小幫手先介紹：\n🌟這邊先給您今日大門密碼：${p}\n🔓開門方法：\n（1）從外開門：手掌觸碰螢幕，按鍵亮起後輸入\n（2）從裡面出去：按下安全鈕、手把同時下壓即可開門\n\n🌟房間鑰匙配備在-電視櫃旁鑰匙架，歡迎使用\n隔天11點退房時，鑰匙放回架上，回傳照片即做好退房手續喔～\n\n🌟民宿拖鞋每一組客人離開後都清洗過，每一組客人都是專屬的室內拖鞋，請您放心使用～\n\n🌟民宿室內全面禁菸，若有需要吸菸的朋友，我們每個陽台和車庫都備有煙灰缸，謝謝您🙏\n\n🌟民宿備有大、小毛巾、漱口杯、沐浴乳和洗髮精是用-沙威隆系列，並備有旋轉式按摩蓮蓬頭和吹風機，舒緩您旅途的疲憊\n\n🌟吧台上面的飲品和零食、礦泉水是為您們做準備，請自行取用\n\n🌟溫馨提醒，現在民宿不能主動提供牙刷牙膏一次性用具，若真的沒有帶，請告知\n\n煦願民宿祝您入住愉快☺️`
  },
  { 
    cat: '入住', 
    title: '大門密碼開鎖教學影片', 
    content: () => `🔒大門密碼開鎖\n手擺上密碼盤感應到就會亮出來，輸入密碼後按*字鍵開門。\n若大門久未關上，電子鎖會發出嗶嗶聲，影片後段有示範如何解除\nhttps://youtu.be/zAHONO_SOAc`
  },
  { 
    cat: '設施', 
    title: '麥克風使用說明', 
    content: () => `🎤藍牙麥克風音響使用說明：\nhttps://m.youtube.com/shorts/8LMhA15R870`
  },
  { 
    cat: '設施', 
    title: '溫馨提醒(烤肉/音量/禁菸)', 
    content: () => `🍢煦願小管家溫馨提醒：\n1. 請於9:00前結束室外烤肉活動，可把烤好食材移至室內並關上大門享用聚會☺️\n2. 麥克風音響-唱到10:00前，後續可進行桌遊和電動麻將同樂喔！\n3. 民宿室內全面禁菸，若需要吸菸我們每間房間外陽台都備有煙灰缸\n～煦願民宿感謝您的配合～`
  },
  { 
    cat: '交通', 
    title: '生活機能(7-11/美廉社)', 
    content: () => `走路5分鐘可到7-11和美廉社，還有早午餐店\n7-11\nhttps://maps.app.goo.gl/uskg6orv7dVas2eb7\n美聯社\nhttps://maps.app.goo.gl/LNYRJGaVaj8GNxAy7`
  },
  { 
    cat: '交通', 
    title: '景點參考(官網連結)', 
    content: () => `🌟分享民宿附近有好玩好吃給您景點參考～\n安農溪和落羽松祕境、清水地熱，太平山，鳩之溫泉，長埤湖精靈村、張美阿嬤農場、梅花湖，仁山苗圃，離羅東夜市、冬山河也很近\n\n🚗更多景點與資訊：\nhttps://wishstaybnb.com/transportation`
  },
  { 
    cat: '交通', 
    title: '快炒優惠與公園', 
    content: () => `🚗民宿附近的景點及交通：\nhttps://wishstaybnb.com/transportation\n#民宿外面走路1分鐘有一個公園可活動\n#隔壁有一間走路兩分鐘快炒店（阿信快炒）可吃合菜，若有需要可報-煦願民宿，可打9.5折，這是快炒店給鄰居的優惠～\nhttps://maps.app.goo.gl/P3wgTe4HAHboXiYy9`
  },
  { 
    cat: '交通', 
    title: '推薦步道', 
    content: () => `分享很不錯的步道給您參考\n仁山步道\nhttps://maps.app.goo.gl/C9XisDS8qaQax11q6\n三清宮步道\nhttps://maps.app.goo.gl/rmyyNfcdFHc8YdbX6`
  },
  { 
    cat: '退房', 
    title: '住宿資料填寫', 
    content: () => `麻煩您✏️住宿資料\n（一人代表填寫即可，謝謝！）\n姓名：\n出生年月：\n身分證號：\n住址：\n電話：`
  },
  { 
    cat: '退房', 
    title: '五星好評邀請', 
    content: () => `有空歡迎幫您我們留言+5星好評，您的肯定是我們前進的動力！煦願民宿感謝您💕\nhttps://maps.app.goo.gl/vcoPQQuMRaME1rpY6`
  }
]; 

let packageList = [];
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

// 修改 updateAll 函數
function updateAll() {
    // 這裡不需要重複呼叫 calculateBalance()，因為 HTML input 已經直接觸發它了
    // 但為了保險，我們維持基礎邏輯

    if (typeof runManualCalc === "function") {
        runManualCalc(); 
    }

    // 更新模板預覽
    const tplList = document.getElementById('tpl-list');
    if (tplList) {
        const activeCatBtn = document.querySelector('.category-nav .cat-tag.active');
        let filter = 'all';
        if (activeCatBtn) {
            const btnText = activeCatBtn.innerText;
            filter = (btnText === '全部') ? 'all' : btnText;
        }
        updateTpl(filter);
        updatePackagePreview();
    }
}
// --- 模板與打包邏輯 ---
function updateTpl(filter = 'all') {
    const d = document.getElementById('v-date').value || "____";
    const p = document.getElementById('v-pwd').value || "____";
    const dep = document.getElementById('v-dep').value || "____";
    const bal = document.getElementById('v-bal').value || "____"; // 修正：獲取正確的尾款
    
    const list = document.getElementById('tpl-list');
    if (!list) return; 
    list.innerHTML = '';

    TPL_DATA.forEach((item, i) => {
        if (filter !== 'all' && item.cat !== filter) return;

        // 這裡確保傳入 4 個參數：日期, 密碼, 訂金, 尾款
        const content = item.content(d, p, dep, bal); 
        const isPacked = packageList.includes(content);
        
        const box = document.createElement('div');
        box.className = `card ${isPacked ? 'card-packed' : ''}`;
        
        box.innerHTML = `
            <div onclick="togglePackage(${i})" style="cursor:pointer;">
                <h3 style="display:inline-block;">[${item.cat}] ${item.title}</h3>
                ${isPacked ? '<span style="color:#e67e22; font-weight:bold; margin-left:10px;">(已打包)</span>' : ''}
            </div>
            <div class="preview-area" id="t-${i}">${content}</div>
            <div class="input-row" style="margin-top:10px; gap:8px;">
                <button class="copy-btn" style="flex:1; margin-top:0;" onclick="copyText('t-${i}', event)">單獨複製</button>
                <button class="copy-btn" style="flex:1; margin-top:0; background:${isPacked ? '#e67e22' : '#3498db'};" onclick="togglePackage(${i})">
                    ${isPacked ? '取消打包' : '加入打包'}
                </button>
            </div>
        `;
        list.appendChild(box);
    });
}

function togglePackage(index) {
    const d = document.getElementById('v-date').value || "____";
    const p = document.getElementById('v-pwd').value || "____";
    const dep = document.getElementById('v-dep').value || "____";
    const bal = document.getElementById('v-bal').value || "____"; // 新增
    
    // 傳入 4 個參數以生成與預覽一致的內容
    const content = TPL_DATA[index].content(d, p, dep, bal);

    const idx = packageList.indexOf(content);
    if (idx === -1) {
        packageList.push(content);
    } else {
        packageList.splice(idx, 1);
    }
    
    updateAll(); 
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
    const total = document.getElementById('o-total').value;
    const dep = document.getElementById('o-dep').value;
    const data = {
        action: "add", 
        key: document.getElementById('admin-key').value,
        name: document.getElementById('o-name').value, 
        date: document.getElementById('o-date').value,
        source: document.getElementById('o-source').value, 
        guests: document.getElementById('o-guests').value,
        rooms: document.getElementById('o-rooms').value, 
        total: total,
        dep: dep, 
        bal: total - dep,
        nights: document.getElementById('o-nights').value // <-- 加入這一行
    };
    await fetch(GAS_URL, { method: "POST", body: JSON.stringify(data) });
    alert("儲存成功"); 
    fetchOrders();
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
    
    const bookedStatus = {}; 

    // 1. 掃描訂單並區分首日與續日
    mData.forEach(r => {
        const orderId = r[0];
        const checkInDate = new Date(r[3]);
        const nights = parseInt(r[10]) || 1;

        for (let i = 0; i < nights; i++) {
            const current = new Date(checkInDate);
            current.setDate(checkInDate.getDate() + i);
            
            if (current.getFullYear() === year && current.getMonth() === month) {
                // 存入物件：oid 是訂單編號，isFirstDay 判斷是否為入住第一天
                bookedStatus[current.getDate()] = { 
                    oid: orderId, 
                    isFirstDay: (i === 0) 
                };
            }
        }
    });

    // 2. 渲染標題
    const weeks = ['日', '一', '二', '三', '四', '五', '六'];
    weeks.forEach(w => grid.innerHTML += `<div class="cal-day cal-header">${w}</div>`);
    
    // 3. 渲染日期
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const now = new Date();

    for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div class="cal-day"></div>`;
    
    for (let day = 1; day <= lastDate; day++) {
        const status = bookedStatus[day];
        let className = 'cal-day';
        
        // 標示今天
        if (day === now.getDate() && month === now.getMonth() && year === now.getFullYear()) className += ' today';
        
        // 標示訂單（首日深色，續日淺色）
        if (status) {
            className += status.isFirstDay ? ' has-order' : ' has-order stay-over';
        }

        const oid = status ? status.oid : '';
        grid.innerHTML += `<div class="${className}" onclick="${oid ? `openEdit('${oid}')` : ''}">${day}</div>`;
    }
}
    

// --- 編輯、刪除與 App 連動 ---

function openEdit(oid) {
    const r = globalOrderData.find(o => o[0] === oid);
    if(!r) return;
    document.getElementById('e-oid').value = r[0];
    document.getElementById('e-source').value = r[1]; // 這裡現在有對應的 HTML 了
    // ...其餘不變
    document.getElementById('e-name').value = r[2];
    document.getElementById('e-date').value = r[3];
    document.getElementById('e-guests').value = r[5];
    document.getElementById('e-rooms').value = r[6];
    document.getElementById('e-total').value = r[7];
    document.getElementById('e-dep').value = r[8];
    
    // 填入晚數資料 (index 10)
    if(document.getElementById('e-nights')) {
        document.getElementById('e-nights').value = r[10] || 1;
    }

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
    const total = document.getElementById('e-total').value;
    const dep = document.getElementById('e-dep').value;
    const data = {
        action: "update", 
        key: document.getElementById('admin-key').value,
        oid: document.getElementById('e-oid').value,
        source: document.getElementById('e-source').value, 
        name: document.getElementById('e-name').value,
        date: document.getElementById('e-date').value, 
        guests: document.getElementById('e-guests').value,
        rooms: document.getElementById('e-rooms').value, 
        total: total,
        dep: dep, 
        bal: total - dep,
        nights: document.getElementById('e-nights').value // <-- 加入這一行
    };
    await fetch(GAS_URL, { method: "POST", body: JSON.stringify(data) });
    closeEditModal(); 
    fetchOrders();
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

function updatePackagePreview() {
    const pkgDiv = document.getElementById('pkg-preview');
    if (!pkgDiv) return;
    
    if (packageList.length === 0) {
        pkgDiv.innerText = "尚未選擇任何訊息...";
        pkgDiv.style.color = "#95a5a6";
    } else {
        // 使用換行與分隔線組合所有選中內容
        pkgDiv.innerText = packageList.join('\n\n------------------\n\n');
        pkgDiv.style.color = "#333";
    }
}

function clearPackage() {
    if(confirm("確定要清空已打包的內容嗎？")) {
        packageList = [];
        updateAll();
    }
}

function filterCat(cat, e) {
    // 切換按鈕的 active 樣式
    document.querySelectorAll('.category-nav .cat-tag').forEach(btn => btn.classList.remove('active'));
    if (e) e.currentTarget.classList.add('active');
    
    // 重新渲染列表
    updateTpl(cat === 'all' ? 'all' : cat);
}

function toggleAccordion(contentId, iconId) {
    const content = document.getElementById(contentId);
    const icon = document.getElementById(iconId);
    if (content.style.display === "block") {
        content.style.display = "none";
        icon.innerText = "▼";
    } else {
        content.style.display = "block";
        icon.innerText = "▲";
    }
}

// 自動計算模板頁面的尾款
function calculateBalance() {
    const totalInput = document.getElementById('v-total');
    const depInput = document.getElementById('v-dep');
    const balInput = document.getElementById('v-bal');
    const display = document.getElementById('v-bal-display');

    if (totalInput && depInput && balInput) {
        const total = parseFloat(totalInput.value) || 0;
        const dep = parseFloat(depInput.value) || 0;
        const bal = total - dep;
        
        // 更新隱藏欄位數值（供模板抓取）
        balInput.value = bal > 0 ? bal : 0;
        
        // 更新顯示文字
        if (display) {
            display.innerText = `自動計算尾款：$${(bal > 0 ? bal : 0).toLocaleString()}`;
        }
    }
    // 計算完後，立即更新模板預覽內容
    updateAll();
}

// 修改 updateAll 函數加入計算
function updateAll() {
    // 執行自動計算尾款
    autoCalcTplBalance(); 

    if (typeof runManualCalc === "function") {
        runManualCalc(); 
    }
    // ...其餘不變
}