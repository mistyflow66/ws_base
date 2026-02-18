/**
 * 煦願民宿智慧工作站 (B&B Smart Workstation) - 完整核心邏輯
 */

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
    title: '預留確認 (含匯款帳號)', 
    content: (d, p, dep, bal, note, nights, total) => {
        let checkoutText = "退房日期";
        if (d && d.includes('/')) {
            let parts = d.split('/');
            let dateObj = new Date(new Date().getFullYear(), parseInt(parts[0]) - 1, parseInt(parts[1]));
            dateObj.setDate(dateObj.getDate() + (parseInt(nights) || 1));
            checkoutText = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
        }
        return `好的，請您確認以下訊息是否正確：\n1. ${d}入住-${checkoutText}退房\n ${nights} 晚，私訊優惠價 ${total} 元\n若以下訊息無誤，再麻煩您先匯訂金 ${dep} 元到以下帳號，煦願民宿先幫您預留日期，謝謝您的預訂\n\n中華郵政（代號700）\n帳號：0111334-0036797\n戶名：林奐廷`;
    }
  },
  { 
    cat: '詢問', 
    title: '詢問設備需求', 
    content: () => `需要幫您準備電動麻將桌、藍芽麥克風音箱、跳跳馬嗎？`
  },
  { 
    cat: '訂房', 
    title: '匯款帳號資訊', 
    content: () => `中華郵政（代號700）\n帳號：0111334-0036797\n戶名：林奐廷`
  },
  { 
    cat: '訂房', 
    title: '代訂烤肉食材流程', 
    content: () => `以下向您說明代訂烤肉食材的相關流程：\n1. 確認匯款後，我們將立即為您進行代訂服務。\n\n2. 烤肉食材將由宅配公司配送。\n依以往經驗，如您預計在下午烤肉，建議食材需於中午前送達；若遇年節等貨運量較大的時期，請務必提前預訂，以確保能在時限內送達（冷凍配送），並保留足夠的退冰時間。\n\n3. 貨物抵達後，民宿會先協助開箱檢查，確認以下內容：\n-品項\n-數量\n-重量（克數）\n等資訊是否正確。\n\n4. 完成檢查後，我們會將現場照片回傳給您確認。\n\n感謝您的配合與支持！`
  },
  { 
    cat: '入住', 
    title: '今日指南(密碼/鑰匙/規範)', 
    content: (d, p) => `煦願小幫手先介紹：\n🌟這邊先給您今日大門密碼：${p}\n\n🔓開門方法：\n（1）從外開門：手掌觸碰螢幕，按鍵亮起後輸入${p.replace('*','')}和*字鍵\n（2）從裡面出去：按下安全鈕、手把同時下壓即可開門\n\n🌟房間鑰匙配備在-電視櫃旁鑰匙架，歡迎使用\n隔天11點退房時，鑰匙放回架上，回傳照片即做好退房手續喔～\n\n🌟民宿拖鞋每一組客人離開後都清洗過，每一組客人都是專屬的室內拖鞋，請您放心使用～\n\n🌟民宿室內全面禁菸，若有需要吸菸的朋友，我們每個陽台和車庫都備有煙灰缸，謝謝您🙏\n\n🌟民宿備有大、小毛巾、漱口杯、沐浴乳和洗髮精是用-沙威隆系列，並備有旋轉式按摩蓮蓬頭和吹風機，舒緩您旅途的疲憊\n\n🌟吧台上面的飲品和零食、礦泉水是為您們做準備，請自行取用\n\n🌟溫馨提醒，現在民宿不能主動提供牙刷牙膏一次性用具，若真的沒有帶，請告知\n\n煦願民宿祝您入住愉快☺️`
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
    cat: '入住', 
    title: '住宿資料填寫', 
    content: () => `麻煩您✏️住宿資料\n（一人代表填寫即可，謝謝！）\n姓名：\n出生年月：\n身分證號：\n住址：\n電話：`
  },
 {
    cat: "退房",
    title: "退房好評邀請",
    // 改成函數格式 () => `...`
    content: () => `已收到您退房鑰匙，祝您假日愉快！\n有空歡迎幫我們留言+5星好評，您的肯定是我們前進的動力！\n煦願民宿感謝您❤️ https://maps.app.goo.gl/vcoPQQuMRaME1rpY6`
  },
  {
    cat: "退房",
    title: "退房手續說明",
    // 改成函數格式 () => `...`
    content: () => `退房時，麻煩您把鑰匙掛在一樓電視旁的鑰匙架上、拍照回傳給我們\n二樓冷/暖氣關機，大門關上\n這樣就做好退房手續唷！`
  }
]; 

let packageList = [];
let globalOrderData = [];
let currentViewDate = new Date();
let currentView = 'cal';

// --- 初始化與基礎功能 ---
window.onload = () => {
    updatePricePlaceholder();
    // 確保 currentViewDate 是當前的正確時間
    currentViewDate = new Date(); 
    
    const savedKey = localStorage.getItem('bnb_admin_key');
    if (savedKey) {
        document.getElementById('admin-key').value = savedKey;
        fetchOrders(); 
    } else {
        // 即便沒登入，也先渲染空的月曆顯示正確的當月份標題
        renderOrderList();
    }
    updateAll();
};

function toggleLoading(show) {
    const mask = document.getElementById('loading-mask');
    if (mask) {
        mask.style.display = show ? 'flex' : 'none';
    }
}

function switchPage(id, e) {
    document.querySelectorAll('.page, .tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(e) e.currentTarget.classList.add('active');
}

// --- 房價與計算連動 ---
function calculateBalance() {
    const total = parseFloat(document.getElementById('v-total').value) || 0;
    const dep = parseFloat(document.getElementById('v-dep').value) || 0;
    const bal = total - dep;
    
    if (document.getElementById('v-bal')) document.getElementById('v-bal').value = bal;
    const display = document.getElementById('v-bal-display');
    if (display) display.innerText = `自動計算尾款：$${(bal > 0 ? bal : 0).toLocaleString()}`;
    
    updateAll();
}

function updateAll() {
    if (typeof runManualCalc === "function") runManualCalc(); 

    const activeCatBtn = document.querySelector('.category-nav .cat-tag.active');
    let filter = activeCatBtn ? (activeCatBtn.innerText === '全部' ? 'all' : activeCatBtn.innerText) : 'all';
    
    updateTpl(filter);
    updatePackagePreview();
}

// --- 模板渲染與打包邏輯 ---
function updateTpl(filter = 'all') {
    const d = document.getElementById('v-date').value || "____";
    const p = document.getElementById('v-pwd').value || "____";
    const dep = document.getElementById('v-dep').value || "0";
    const bal = document.getElementById('v-bal') ? document.getElementById('v-bal').value : "0"; 
    const nights = document.getElementById('o-nights') ? document.getElementById('o-nights').value : "1";
    const total = document.getElementById('v-total') ? document.getElementById('v-total').value : "0";

    const list = document.getElementById('tpl-list');
    if (!list) return; 
    list.innerHTML = '';
    
    // 記錄目前的過濾狀態，方便 togglePackage 重新整理
    window.currentFilter = filter;

    TPL_DATA.forEach((item, i) => {
        if (filter !== 'all' && item.cat !== filter) return;

        const content = item.content(d, p, dep, bal, "", nights, total); 
        const isPacked = packageList.includes(content);
        
        // 核心修正：根據狀態動態決定按鈕樣式
        const packClass = isPacked ? 'btn-pack-del' : 'btn-pack-add';
        const packText = isPacked ? '取消打包' : '加入打包';
        const packIcon = isPacked ? 'fa-xmark' : 'fa-plus';

        const box = document.createElement('div');
        box.className = `card ${isPacked ? 'card-packed' : ''}`;
        box.innerHTML = `
            <div onclick="togglePackage(${i}, this.parentElement.querySelector('.btn-toggle-main'))" style="cursor:pointer;">
                <h3 style="display:inline-block; color:#3a4553;">[${item.cat}] ${item.title}</h3>
                ${isPacked ? '<span style="color:#af6a58; font-weight:bold; margin-left:10px;"><i class="fa-solid fa-check"></i> 已打包</span>' : ''}
            </div>
            <div class="preview-area" id="t-${i}">${content}</div>
            <div class="input-row" style="margin-top:10px; gap:8px;">
                <button class="copy-btn" style="flex:1; background:#af6a58;" onclick="copyText('t-${i}', event)">
                    <i class="fa-solid fa-copy"></i> 單獨複製
                </button>
                <button class="copy-btn ${packClass} btn-toggle-main" style="flex:1;" onclick="togglePackage(${i}, this)">
                    <i class="fa-solid ${packIcon}"></i> ${packText}
                </button>
            </div>
        `;
        list.appendChild(box);
    });
}

function togglePackage(index, btn) {
    const d = document.getElementById('v-date').value || "____";
    const p = document.getElementById('v-pwd').value || "____";
    const dep = document.getElementById('v-dep').value || "0";
    const bal = document.getElementById('v-bal') ? document.getElementById('v-bal').value : "0";
    const nights = document.getElementById('o-nights') ? document.getElementById('o-nights').value : "1";
    const total = document.getElementById('v-total') ? document.getElementById('v-total').value : "0";
    
    const content = TPL_DATA[index].content(d, p, dep, bal, "", nights, total);
    const idx = packageList.indexOf(content);
    
    if (idx === -1) {
        // --- 加入打包 ---
        packageList.push(content);
        // 變換為「已選取」狀態 (淺色/X)
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-xmark"></i> 取消打包';
            btn.classList.remove('btn-pack-add'); 
            btn.classList.add('btn-pack-del');
        }
    } else {
        // --- 移除打包 ---
        packageList.splice(idx, 1);
        // 恢復為「未選取」狀態 (深色/+)
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-plus"></i> 加入打包';
            btn.classList.remove('btn-pack-del');
            btn.classList.add('btn-pack-add');
        }
    }
    
    // 如果是點擊卡片標題觸發（沒有按鈕對象），則重刷列表以更新圖示與文字標記
    if (!btn) {
        updateTpl(window.currentFilter || 'all');
    }

    // 更新上方的「已打包訊息」大預覽框
    updatePackagePreview(); 
}

function updatePackagePreview() {
    const pkgDiv = document.getElementById('pkg-preview');
    if (!pkgDiv) return;
    if (packageList.length === 0) {
        pkgDiv.innerText = "尚未選擇任何訊息...";
        pkgDiv.style.color = "#95a5a6";
    } else {
        pkgDiv.innerText = packageList.join('\n\n---\n\n');
        pkgDiv.style.color = "#3a4553";
    }
}

function clearPackage() {
    if(confirm("確定要清空已打包的內容嗎？")) {
        packageList = [];
        
        // 1. 更新頂部大預覽框內容
        updatePackagePreview();
        
        // 2. 核心修正：直接重新跑一次 updateTpl，讓所有按鈕變回「加入打包」的深色樣式
        updateTpl(window.currentFilter || 'all');
    }
}
// --- 房價計算器 ---
function updatePricePlaceholder() {
    const s = document.getElementById('m-season').value;
    ['201','202','301'].forEach(rid => {
        const input = document.getElementById('p-'+rid);
        // 預設顯示該房型在該季節開 1 床的價格作為參考
        if (input && PRICE_MAP[rid][s][1]) input.placeholder = PRICE_MAP[rid][s][1];
    });
}

function runManualCalc() {
    const s = document.getElementById('m-season').value; // 季節 (平日/假日等)
    const resDiv = document.getElementById('calc-result'); // 提前抓取顯示容器
    
    // 如果找不到顯示容器，直接結束，避免報錯
    if (!resDiv) return;

    let totalBT = 0;
    let roomDetails = []; // 用來存儲選中的房型與床數文字

    ['201','202','301'].forEach(rid => {
        const b = parseInt(document.getElementById('m-'+rid).value); // 取得開幾床
        if(b > 0) {
            const customPrice = parseFloat(document.getElementById('p-'+rid).value);
            totalBT += customPrice || PRICE_MAP[rid][s][b];
            
            // 房號對應名稱
            const rName = rid === '201' ? '雙人房' : (rid === '202' ? '三人房' : '四人房');
            roomDetails.push(`${rName}開${b}床`);
        }
    });

    // 若沒選房型（金額為 0），則清空顯示區域並中止執行
    if (totalBT === 0) {
        resDiv.innerHTML = ''; 
        return; 
    }

    // 私訊價計算
    const priv = Math.ceil((totalBT * 0.88 * 1.03) / 10) * 10;
    // 額外計算：Booking 抽成 12% 後的實得金額
    const bookingNet = Math.round(priv * 0.88);

    // 取得季節文字 (例如: 一般平日)
    const seasonText = document.getElementById('m-season').options[document.getElementById('m-season').selectedIndex].text;
    // 取得房型文字 (例如: 雙人房開1床、三人房開1床)
    const roomsText = roomDetails.join('、');
    
    // 組合最終文字
    const copyContent = `${seasonText} ${roomsText}，私訊優惠價 $${priv.toLocaleString()} 元`;

    // 渲染報價結果到頁面
    resDiv.innerHTML = `
        <div class="card" style="border: 2px solid #af6a58;">
            <div style="font-weight:bold; color:#af6a58; font-size:1.1rem;">私訊優惠價：$${priv.toLocaleString()}</div>
            
            <div style="font-size:0.8rem; color:#999; margin-top:4px;">
                (Booking 扣 12% 抽成後實得：$${bookingNet.toLocaleString()})
            </div>

            <div class="preview-area" id="p-res" 
                 contenteditable="true"
                 style="margin-top:12px; background:#fcfcfc; padding:12px; border-radius:4px; font-size:0.95rem; line-height:1.6; text-align:left; border:1px dashed #af6a58; outline:none; color:#333;">${copyContent}</div>
            
            <button class="copy-btn" style="background:#af6a58; margin-top:10px; width:100%; border:none; padding:10px; color:white; border-radius:4px; cursor:pointer;" 
                    onclick="copyText('p-res', event)">
                <i class="fa-solid fa-copy"></i> 複製報價
            </button>
        </div>`;
}

// --- 訂單雲端 CRUD 作業 ---
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
    const key = document.getElementById('admin-key').value;
    if(!key) return alert("請輸入金鑰");
    toggleLoading(true);
    const total = document.getElementById('o-total').value;
    const dep = document.getElementById('o-dep').value;
    const data = {
        action: "add", key: key,
        name: document.getElementById('o-name').value, 
        date: document.getElementById('o-date').value,
        source: document.getElementById('o-source').value, 
        guests: document.getElementById('o-guests').value,
        rooms: document.getElementById('o-rooms').value, 
        total: total, dep: dep, bal: total - dep,
        nights: document.getElementById('o-nights').value,
        note: document.getElementById('o-note').value 
    };
    await fetch(GAS_URL, { method: "POST", body: JSON.stringify(data) });
    alert("儲存成功"); 
    fetchOrders();
    toggleLoading(false);
}

// 全域變數，用來存放當前顯示的物件以便點擊調用
let currentViewOrders = [];

// 核心：修改原本的 renderOrderList，加入統計連動
function renderOrderList() {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    document.getElementById('cal-month-title').innerText = `${year}年 ${month + 1}月`;

    // 1. 過濾並排序訂單
    currentViewOrders = globalOrderData
        .filter(r => r[3] && r[3].includes(monthStr))
        .map(r => ({
            id: r[0], source: r[1], name: r[2], date: r[3],
            guests: r[5], rooms: r[6], total: r[7], deposit: r[8],
            bal: r[9], nights: r[10], note: r[11]
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    // 2. 渲染月曆與列表 (維持原有功能)
    renderCalendar(year, month);
    const listDiv = document.getElementById('order-list');
    if (listDiv) {
        listDiv.innerHTML = currentViewOrders.map((o, index) => `
            <div class="order-list-item" onclick="handleOrderClick(${index})">
                <div class="order-info">
                    <div style="font-weight:bold;">${formatDate(o.date)} | ${o.name}</div>
                    <div style="font-size:0.85rem; color:#6a7181;">${o.rooms}房 / ${o.nights}晚</div>
                </div>
                <div style="text-align:right;">
                    <span class="source-tag tag-${getSourceClass(o.source)}">${o.source}</span>
                    <div style="color:#af6a58; font-weight:bold; margin-top:4px;">$${o.total}</div>
                </div>
            </div>`).join('');
    }

    // 3. 【關鍵】自動帶入經營數據統計與財務計算
    updateStatistics(currentViewOrders); 
    const rawMData = globalOrderData.filter(r => r[3] && r[3].includes(monthStr));
    calculateFinance(rawMData);
}

function renderCalendar(year, month) {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';
    const bookedStatus = {}; 

    currentViewOrders.forEach((o, index) => {
        const checkInDate = new Date(o.date);
        const nights = parseInt(o.nights) || 1;
        for (let i = 0; i < nights; i++) {
            const current = new Date(checkInDate);
            current.setDate(checkInDate.getDate() + i);
            if (current.getFullYear() === year && current.getMonth() === month) {
                bookedStatus[current.getDate()] = { orderIndex: index, isFirstDay: (i === 0) };
            }
        }
    });

    const weeks = ['日', '一', '二', '三', '四', '五', '六'];
    weeks.forEach(w => grid.innerHTML += `<div class="cal-day cal-header">${w}</div>`);
    
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div class="cal-day"></div>`;
    
    for (let day = 1; day <= lastDate; day++) {
        const status = bookedStatus[day];
        let className = 'cal-day';
        const isToday = (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear());
        if (isToday) className += ' today';
        if (status) className += status.isFirstDay ? ' has-order' : ' has-order stay-over';
        
        // 修正點擊：傳入索引
        const clickAction = status ? `onclick="handleOrderClick(${status.orderIndex})"` : '';
        grid.innerHTML += `<div class="${className}" ${clickAction}>${day}</div>`;
    }
}

// 新增一個處理點擊的中轉函數
function handleOrderClick(index) {
    const order = currentViewOrders[index];
    if (order) {
        showOrderDetail(order);
    }
}

// --- 訂單詳情彈窗與編輯邏輯 ---
// --- 訂單詳情彈窗與編輯邏輯 ---

function showOrderDetail(order) {
    if (!order) return;
    const infoList = document.getElementById('detail-info-list');
    const displayDate = formatDate(order.date);
    const s = order.source || "私LINE";
    
    // 1. 定義按鈕配置
    let btnConfig = { text: "開啟 App", icon: "fa-solid fa-comment-dots", color: "#af6a58", appUrl: "#", webUrl: "#" };

    if (s.includes("Booking")) {
        btnConfig = { 
            text: "Pulse", 
            icon: "fa-solid fa-house-laptop", 
            color: "#003580", 
            appUrl: "pulse://hotel/", 
            webUrl: "https://admin.booking.com" 
        };
    } else if (s.includes("官方LINE")) {
        btnConfig = { text: "LINE OA", icon: "fa-solid fa-comment-medical", color: "#00b900", appUrl: "lineoa://", webUrl: "https://manager.line.biz" };
    } else if (s.includes("LINE")) {
        btnConfig = { text: "LINE", icon: "fa-solid fa-comment-dots", color: "#00c300", appUrl: "line://", webUrl: "https://line.me" };
    } else if (s.includes("FB") || s.includes("Messenger")) {
        btnConfig = { text: "Messenger", icon: "fa-solid fa-comment-dots", color: "#0084ff", appUrl: "fb-messenger://", webUrl: "https://www.facebook.com/messages" };
    }

    // 2. 渲染詳細資訊內容
    const depositAmount = parseFloat(order.deposit) || 0;
    infoList.innerHTML = `
        <div class="info-item"><span class="info-label"><i class="fa-solid fa-user"></i> 訂房人</span><span class="info-value">${order.name}</span></div>
        <div class="info-item"><span class="info-label"><i class="fa-solid fa-calendar"></i> 入住日期</span><span class="info-value">${displayDate} (${order.nights}晚)</span></div>
        <div class="info-item"><span class="info-label"><i class="fa-solid fa-tag"></i> 來源</span><span class="source-tag tag-${getSourceClass(s)}">${s}</span></div>
        <div class="info-item"><span class="info-label"><i class="fa-solid fa-bed"></i> 房型/人數</span><span class="info-value">${order.rooms}房 / ${order.guests}人</span></div>
        
        <div class="info-item" style="color:#af6a58; font-weight:bold;">
            <span class="info-label"><i class="fa-solid fa-money-bill"></i> 總金額</span>
            <span class="info-value">$${order.total}</span>
        </div>
        
        <div class="info-item">
            <span class="info-label"><i class="fa-solid fa-hand-holding-dollar"></i> 已付訂金</span>
            <span class="info-value">$${depositAmount}</span>
        </div>
        
        <div class="info-item"><span class="info-label"><i class="fa-solid fa-pen"></i> 備註</span><span class="info-value">${order.note || '無'}</span></div>
    `;

    // 3. 更新聯絡按鈕點擊邏輯
    const actionBtn = document.getElementById('btn-pulse');
    if (actionBtn) {
        actionBtn.innerHTML = `<i class="${btnConfig.icon}"></i> ${btnConfig.text}`;
        actionBtn.style.background = btnConfig.color;

        actionBtn.onclick = () => {
            if (btnConfig.appUrl && btnConfig.appUrl !== "#") {
                window.location.href = btnConfig.appUrl;
            }
            setTimeout(() => {
                if (btnConfig.webUrl && btnConfig.webUrl !== "#") {
                    window.open(btnConfig.webUrl, "_blank");
                }
            }, 500);
        };
    }

    // 4. 預填編輯欄位
    document.getElementById('e-oid').value = order.id || '';
    document.getElementById('e-name').value = order.name || '';
    document.getElementById('e-date').value = order.date ? order.date.split('T')[0] : '';
    document.getElementById('e-nights').value = order.nights || '1';
    document.getElementById('e-source').value = s;
    document.getElementById('e-guests').value = order.guests || '';
    document.getElementById('e-rooms').value = order.rooms || '3';
    document.getElementById('e-total').value = order.total || '';
    document.getElementById('e-dep').value = order.deposit || 0;
    document.getElementById('e-note').value = order.note || '';

    toggleEditMode(false); 
    document.getElementById('edit-modal').classList.add('active');
} 

function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('active');
}

function toggleEditMode(isEdit) {
    document.getElementById('info-display-view').style.display = isEdit ? 'none' : 'block';
    document.getElementById('info-edit-view').style.display = isEdit ? 'block' : 'none';
    const modalTitle = document.getElementById('modal-title');
    modalTitle.innerText = isEdit ? "編輯訂單" : "訂單詳細資訊";
}

function getSourceClass(source) {
    if (!source) return 'default';
    const s = source.toLowerCase();
    if (s.includes('line')) return 'line';
    if (s.includes('booking')) return 'booking';
    if (s.includes('fb') || s.includes('messenger')) return 'fb';
    return 'default';
}

// --- 修正後的更新功能 (對接雲端) ---
async function submitUpdate() {
    const key = document.getElementById('admin-key').value;
    toggleLoading(true);
    const total = document.getElementById('e-total').value;
    const dep = document.getElementById('e-dep').value;
    const data = {
        action: "update", key: key,
        id: document.getElementById('e-oid').value,
        name: document.getElementById('e-name').value, 
        date: document.getElementById('e-date').value,
        source: document.getElementById('e-source').value, 
        guests: document.getElementById('e-guests').value,
        rooms: document.getElementById('e-rooms').value, 
        total: total, dep: dep, bal: total - dep,
        nights: document.getElementById('e-nights').value,
        note: document.getElementById('e-note').value 
    };
    await fetch(GAS_URL, { method: "POST", body: JSON.stringify(data) });
    closeEditModal();
    fetchOrders();
    toggleLoading(false);
}

async function submitDelete() {
    if(!confirm("確定要刪除這筆訂單嗎？此操作無法復原。")) return;
    const key = document.getElementById('admin-key').value;
    toggleLoading(true);
    const data = {
        action: "delete", key: key,
        id: document.getElementById('e-oid').value
    };
    await fetch(GAS_URL, { method: "POST", body: JSON.stringify(data) });
    closeEditModal();
    fetchOrders();
    toggleLoading(false);
}

// --- 統計與其他功能 (保留原樣) ---
function updateStatistics(mData) {
    const totalG = mData.reduce((s, o) => s + (parseInt(o.guests) || 0), 0);
    const totalR = mData.reduce((s, o) => s + (parseInt(o.rooms) || 0), 0);
    const bCount = mData.filter(o => o.source === 'Booking').length;
    
    document.getElementById('stat-total-guests').innerText = totalG;
    document.getElementById('stat-total-rooms').innerText = totalR;
    
    const bRate = mData.length ? Math.round((bCount / mData.length) * 100) : 0;
    document.getElementById('stat-b-rate').innerText = bRate + '%';
    document.getElementById('stat-o-rate').innerText = (100 - bRate) + '%';
}

// 修改原本的 calculateFinance
function calculateFinance(mData) {
    if (!mData) {
        const monthTitle = document.getElementById('cal-month-title').innerText;
        const monthStr = monthTitle.replace('年 ', '-').replace('月', '').trim();
        mData = globalOrderData.filter(r => r[3] && r[3].includes(monthStr));
    }

    const income = mData.reduce((s, r) => s + (parseFloat(r[7]) || 0), 0);
    const bTotal = mData.filter(r => r[1] === 'Booking').reduce((s, r) => s + (parseFloat(r[7]) || 0), 0);
    const fee = Math.round(bTotal * 0.12);
    
    const laundry = parseFloat(document.getElementById('laundry-cost')?.value) || 0;
    const utility = parseFloat(document.getElementById('utility-cost')?.value) || 0;

    if(document.getElementById('fin-income')) document.getElementById('fin-income').innerText = '$' + income.toLocaleString();
    if(document.getElementById('fin-fee')) document.getElementById('fin-fee').innerText = '-$' + fee.toLocaleString();
    if(document.getElementById('fin-net')) document.getElementById('fin-net').innerText = '$' + (income - fee - laundry - utility).toLocaleString();
    
    // 全域變數方便彈窗讀取
    window.currentMonthFin = { income, fee, laundry, utility, net: (income - fee - laundry - utility) };
}

// 修改水電帶入函數
function applyUtility() {
    const resValue = document.getElementById('u-res').innerText;
    // 直接帶入財務卡片的輸入框
    const utilityInput = document.getElementById('utility-cost');
    if (utilityInput) {
        utilityInput.value = resValue;
        calculateFinance(); // 立即重新計算
    }
    closeUtilityCalc();
}

function copyText(id, e) {
    const el = document.getElementById(id);
    const t = el.innerText || el.value;
    navigator.clipboard.writeText(t).then(() => {
        const btn = e.currentTarget;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> 已複製';
        setTimeout(() => btn.innerHTML = originalText, 1000);
    });
}

function filterCat(cat, e) {
    document.querySelectorAll('.cat-tag').forEach(btn => btn.classList.remove('active'));
    if (e) e.currentTarget.classList.add('active');
    updateTpl(cat === 'all' ? 'all' : cat);
}

function toggleAccordion(contentId, iconId) {
    const content = document.getElementById(contentId);
    const icon = document.getElementById(iconId);
    const isVisible = content.style.display === "block";
    content.style.display = isVisible ? "none" : "block";
    if(icon) icon.innerText = isVisible ? "▼" : "▲";
}

function toggleStats() {
    const s = document.getElementById('stats-area');
    const isVisible = s.style.display === 'block';
    
    if (isVisible) {
        s.style.display = 'none';
    } else {
        s.style.display = 'block';
        prepareMonthEnd(); // 顯示時同步最新的財務數據
    }
}

function changeMonth(n) {
    // 1. 切換月份邏輯
    currentViewDate.setMonth(currentViewDate.getMonth() + n);
    
    // 2. 重新渲染訂單列表與月曆
    renderOrderList();
    
    // 3. 【新增】隱藏經營數據統計區塊
    const statsArea = document.getElementById('stats-area');
    if (statsArea) {
        statsArea.style.display = 'none';
    }
}

function switchOrderView(type) {
    currentView = type;
    document.getElementById('btn-cal').classList.toggle('active', type === 'cal');
    document.getElementById('btn-list').classList.toggle('active', type === 'list');
    document.getElementById('calendar-grid').style.display = type === 'cal' ? 'grid' : 'none';
    document.getElementById('order-list').style.display = type === 'list' ? 'block' : 'none';
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    // 使用 getUTCMonth 避免時區導致日期減一天的問題
    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
}

// 1. 切換月結區塊顯示
function toggleMonthEnd() {
    const area = document.getElementById('month-end-calc');
    const icon = document.getElementById('me-icon');
    const isVisible = area.style.display === 'block';
    area.style.display = isVisible ? 'none' : 'block';
    icon.innerText = isVisible ? '▼' : '▲';
    if (!isVisible) prepareMonthEnd(); // 打開時更新數據
}

// 2. 準備結算數據
function prepareMonthEnd() {
    const income = parseFloat(document.getElementById('fin-income').innerText.replace(/[^0-9.-]+/g,"")) || 0;
    const bTotal = currentViewOrders.filter(o => o.source === 'Booking').reduce((s, o) => s + (parseFloat(o.total) || 0), 0);
    const fee = Math.round(bTotal * 0.12);

    // 這裡我們建立一個虛擬的顯示對象給 mini 區使用
    const laundry = parseFloat(document.getElementById('laundry-cost').value) || 0;
    const utility = parseFloat(document.getElementById('utility-cost').value) || 0;
    
    // 把資料塞進隱藏或顯示的欄位
    document.getElementById('final-laundry').value = laundry;
    document.getElementById('final-utility').value = utility;
    
    const net = income - fee - laundry - utility;
    document.getElementById('me-net-preview').innerText = '$' + net.toLocaleString();
    
    window.currentMonthEndData = { income, fee }; 
}

// 3. 淨利即時預覽
function updateNetPreview() {
    const income = parseFloat(document.getElementById('me-income').innerText.replace(/[^0-9.-]+/g,"")) || 0;
    const fee = parseFloat(document.getElementById('me-fee').innerText.replace(/[^0-9.-]+/g,"")) || 0;
    const laundry = parseFloat(document.getElementById('final-laundry').value) || 0;
    const utility = parseFloat(document.getElementById('final-utility').value) || 0;
    const net = income - fee - laundry - utility;
    document.getElementById('me-net-preview').innerText = '$' + net.toLocaleString();
}

// 4. 水電分攤邏輯
function openUtilityCalc() {
    document.getElementById('u-modal').style.display = 'flex';
}

function closeUtilityCalc() {
    document.getElementById('u-modal').style.display = 'none';
}

function calculateUtility() {
    const startVal = document.getElementById('u-start').value;
    const endVal = document.getElementById('u-end').value;
    const total = parseFloat(document.getElementById('u-total').value) || 0;

    if (!startVal || !endVal || total <= 0) return;

    // 轉換為日期物件
    const s = new Date(startVal);
    const e = new Date(endVal);
    
    // 計算該單據的總天數 (需包含結束當天，所以 +1)
    const totalDays = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
    if (totalDays <= 0) return;

    // 計算當前月曆顯示月份的範圍
    const viewYear = currentViewDate.getFullYear();
    const viewMonth = currentViewDate.getMonth();
    const mStart = new Date(viewYear, viewMonth, 1);
    const mEnd = new Date(viewYear, viewMonth + 1, 0); // 該月最後一天

    // 取得重疊天數
    const overlapS = s > mStart ? s : mStart;
    const overlapE = e < mEnd ? e : mEnd;
    
    let diff = Math.round((overlapE - overlapS) / (1000 * 60 * 60 * 24)) + 1;
    let overlapDays = diff > 0 ? diff : 0;

    // 計算分攤金額
    const resValue = Math.round((total / totalDays) * overlapDays);

    // 更新顯示
    document.getElementById('u-days').innerText = overlapDays;
    document.getElementById('u-res').innerText = resValue.toLocaleString();
}

document.querySelectorAll('#u-start, #u-end, #u-total').forEach(el => el.addEventListener('input', calculateUtility));

function applyUtility() {
    const resValue = document.getElementById('u-res').innerText;
    
    // 1. 填入封存區的小輸入框
    document.getElementById('final-utility').value = resValue;
    
    // 2. 同步到底部的財務預覽框
    const utilityCost = document.getElementById('utility-cost');
    if (utilityCost) utilityCost.value = resValue;

    // 3. 重新觸發計算
    updateNetPreview();
    
    // 4. 更新全域財務統計
    const monthTitle = document.getElementById('cal-month-title').innerText;
    const monthStr = monthTitle.replace('年 ', '-').replace('月', '').trim();
    const currentMData = globalOrderData.filter(r => r[3] && r[3].includes(monthStr));
    calculateFinance(currentMData);

    closeUtilityCalc();
}

function openArchiveModal() {
    const monthTitle = document.getElementById('cal-month-title').innerText;
    const fin = window.currentMonthFin || { income:0, fee:0, laundry:0, utility:0, net:0 };
    
    // 抓取經營數據卡片數值
    const guests = document.getElementById('stat-total-guests').innerText;
    const rooms = document.getElementById('stat-total-rooms').innerText;
    const bRate = document.getElementById('stat-b-rate').innerText;
    const oRate = document.getElementById('stat-o-rate').innerText;

    const listContainer = document.getElementById('archive-summary-list');
    listContainer.innerHTML = `
        <div class="archive-list-item"><span class="archive-label">結算月份</span><span class="archive-value">${monthTitle}</span></div>
        <div class="archive-list-item"><span class="archive-label">總來客數</span><span class="archive-value">${guests} 人</span></div>
        <div class="archive-list-item"><span class="archive-label">總開房數</span><span class="archive-value">${rooms} 房</span></div>
        <div class="archive-list-item"><span class="archive-label">通路佔比</span><span class="archive-value">Booking ${bRate} / 私訊 ${oRate}</span></div>
        <hr style="border:0; border-top:1px dashed #eee; margin:10px 0;">
        <div class="archive-list-item"><span class="archive-label">房費總收入</span><span class="archive-value">$${fin.income.toLocaleString()}</span></div>
        <div class="archive-list-item"><span class="archive-label">Booking 手續費</span><span class="archive-value" style="color:#e74c3c;">-$${fin.fee.toLocaleString()}</span></div>
        <div class="archive-list-item"><span class="archive-label">洗衣/水電雜支</span><span class="archive-value">-$${(fin.laundry + fin.utility).toLocaleString()}</span></div>
    `;

    document.getElementById('archive-net-profit').innerText = '$' + fin.net.toLocaleString();
    document.getElementById('archive-modal').classList.add('active');
}

function closeArchiveModal() {
    document.getElementById('archive-modal').classList.remove('active');
}

// 5. 提交月結至 GAS
async function finalConfirmArchive() {
    const key = document.getElementById('admin-key').value;
    const monthTitle = document.getElementById('cal-month-title').innerText;
    const fin = window.currentMonthFin;
    
    if(!confirm(`確認封存 ${monthTitle} 的數據嗎？`)) return;
    
    toggleLoading(true);
    const payload = {
        action: "monthEnd",
        key: key,
        month: monthTitle,
        income: fin.income,
        fee: fin.fee,
        laundry: fin.laundry,
        utility: fin.utility,
        net: fin.net,
        guests: document.getElementById('stat-total-guests').innerText,
        rooms: document.getElementById('stat-total-rooms').innerText,
        bRate: document.getElementById('stat-b-rate').innerText,
        oRate: document.getElementById('stat-o-rate').innerText
    };

    try {
        const res = await fetch(GAS_URL, { method: "POST", body: JSON.stringify(payload) });
        alert("數據已成功封存至雲端「月結紀錄」！");
        closeArchiveModal();
    } catch (e) {
        alert("上傳失敗，請檢查網路連線");
    }
    toggleLoading(false);
}

// 修改按鈕觸發的函數
function toggleStatsSection() {
    const statsArea = document.getElementById('stats-area');
    
    if (statsArea.style.display === 'none') {
        // 抓取目前畫面上顯示的年份與月份標題
        const monthTitle = document.getElementById('cal-month-title').innerText;
        const monthStr = monthTitle.replace('年 ', '-').replace('月', '').trim();
        
        // 從全域資料過濾出該月份的訂單
        const currentMData = globalOrderData.filter(r => r[3] && r[3].includes(monthStr));
        
        // 執行統計數據更新
        updateStatistics(currentMData.map(r => ({
            source: r[1],
            guests: r[5],
            rooms: r[6]
        })));
        
        // 顯示區塊
        statsArea.style.display = 'block';
    } else {
        // 若已顯示則隱藏
        statsArea.style.display = 'none';
    }
}