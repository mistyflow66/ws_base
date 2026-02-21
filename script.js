/**
 * 煦願民宿智慧工作站 (B&B Smart Workstation) - 完整核心邏輯
 */

/**
 * 煦願民宿 - 核心配置與金鑰邏輯
 */

// 1. 確保 URL 正確
const GAS_URL = "https://script.google.com/macros/s/AKfycbySPYLiPf6pUhZqbHMSK2z2eYtrzVWrPUweojAoCG8_15IrxQH0dhTOiXp1gf58dpiEQg/exec"; 

// 2. 自動生成金鑰 (112461)
function generateKey() {  
    const a = 300 * 300;  
    const b = 5000 + 2000;     
    const c = 400 + 50;     
    const d = 10 + 1;  
    const result = a + b + c + d;   
    return String(result + 15000); 
}

// 3. 房價配置表
const PRICE_MAP = {      
  '201': { weekday: { 1: 1900 }, weekend: { 1: 2200 }, cny: { 1: 2900 } },      
  '202': { weekday: { 1: 2400, 2: 2600 }, weekend: { 1: 2600, 2: 2800 }, cny: { 1: 5600, 2: 6000 } },      
  '301': { weekday: { 1: 3500, 2: 4500, 3: 5000, 4: 5500 }, weekend: { 1: 3800, 2: 4800, 3: 5300, 4: 5800 }, cny: { 1: 6000, 2: 7000, 3: 8000, 4: 9000 } }      
};

// 4. 全域狀態控制
let currentViewOrders = [];   // 儲存當前月份過濾後的訂單
let currentListPage = 1;      // 清單當前頁碼
const itemsPerPage = 5;       // 每頁顯示幾筆

// 5. 回覆模板資料 (TPL_DATA)
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
        return `請您確認預訂資訊：\n1. ${d}入住${nights} 一晚（${checkoutText}退房)，私訊優惠價 ${total} 元\n若以上訊息無誤，再麻煩您先匯訂金 ${dep} 元到以下帳號，煦願民宿先幫您預留日期，謝謝您的預訂\n\n中華郵政（代號700）\n帳號：0111334-0036797\n戶名：林奐廷`;
    }
  },
  { 
    cat: '詢問', 
    title: '詢問設備需求', 
    content: () => `需要幫您準備電動麻將桌、藍芽麥克風音箱、跳跳馬嗎？`
  },
  {
    cat: '訂房',
    title: '收到訂金確認',
    content: (d, p, dep, bal) => 
      `已收到訂金${dep}元，尾款${bal}元入住當天支付即可～\n歡迎蒞臨煦願民宿😊`
  },
  { 
    cat: '訂房', 
    title: '住宿資料填寫', 
    content: () => `麻煩您✏️住宿資料\n（一人代表填寫即可，謝謝！）\n姓名：\n出生年月：\n身分證號：\n住址：\n電話：`
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
    title: '備品與環保告知',
    content: () => 
      `客房提供備品：大小毛巾、沐浴乳、洗髮精\n響應政府政策，不主動提供牙刷、牙膏等一次性盥洗用品，建議房客自行攜帶，減少資源浪費\n若當天需牙刷組，可另外付費購買，謝謝您🙏`
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
    
    // 1. 初始化日期：確保 currentViewDate 是當前的正確時間
    currentViewDate = new Date(); 
    
    // 2. 自動連線邏輯：直接執行 fetchOrders
    // 因為現在使用 generateKey() 自動計算金鑰，不再依賴 localStorage
    fetchOrders(); 

    // 3. 更新 UI 初始顯示
    updateAll();
};

/**
 * 控制同步遮罩顯示狀態
 * @param {boolean} show - 是否顯示
 */
function toggleLoading(show) {
    const mask = document.getElementById('loading-mask');
    if (mask) {
        mask.style.display = show ? 'flex' : 'none';
    }
}

/**
 * 分頁切換功能
 * @param {string} id - 分頁元素 ID
 * @param {Event} e - 點擊事件
 */
function switchPage(id, e) {
    // 移除所有頁面與按鈕的 active 狀態
    document.querySelectorAll('.page, .tab-btn').forEach(el => el.classList.remove('active'));
    
    // 激活目標頁面
    const targetPage = document.getElementById(id);
    if (targetPage) targetPage.classList.add('active');
    
    // 激活對應按鈕
    if (e && e.currentTarget) {
        e.currentTarget.classList.add('active');
    }
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

/**
 * 核心連線工具 - 確保不觸發 OPTIONS 預檢，並統一處理通訊
 */
async function callGAS(payload) {
    try {
        const res = await fetch(GAS_URL, {
            method: "POST",
            mode: "cors", 
            headers: { "Content-Type": "text/plain;charset=utf-8" }, 
            body: JSON.stringify(payload)
        });
        const text = await res.text();
        try { return JSON.parse(text); } catch (e) { return text; }
    } catch (err) {
        console.error("網路連線錯誤:", err);
        throw new Error("網路請求遭攔截或網址錯誤");
    }
}

/**
 * 1. 讀取訂單 - 從試算表抓取全部資料
 */
async function fetchOrders() {
    toggleLoading(true);
    const key = generateKey(); 
    
    try {
        const data = await callGAS({ 
            action: "read", 
            key: key 
        });

        if (Array.isArray(data)) {
            globalOrderData = data;
            // 成功獲取後，確保 UI 狀態切換
            const lockScreen = document.getElementById('lock-screen');
            const orderContent = document.getElementById('order-content');
            if (lockScreen) lockScreen.style.display = 'none';
            if (orderContent) orderContent.style.display = 'block';
            
            renderOrderList();
        } else {
            alert("雲端驗證失敗，請檢查金鑰邏輯。");
        }
    } catch (e) {
        console.error("連線錯誤:", e);
        alert("連線失敗，請檢查 GAS 部署是否設為『任何人』且網址正確。");
    }
    toggleLoading(false);
}


/**
 * 核心輔助工具：抓取正確的晚數
 * @param {string} prefix - 'o' (新增) 或 'e' (修改)
 */
function getNightsValue(prefix) {
    const select = document.getElementById(`${prefix}-nights`);
    const customInput = document.getElementById(`${prefix}-nights-custom`);
    if (select && select.value === 'custom') {
        return customInput.value || 1;
    }
    return select ? select.value : 1;
}

/**
 * 核心輔助工具：抓取房型複選資料
 * @param {string} prefix - 'o' (新增) 或 'e' (修改)
 */
function getRoomData(prefix) {
    const checkedBoxes = document.querySelectorAll(`input[name="${prefix}-room-type"]:checked`);
    const rooms = Array.from(checkedBoxes).map(cb => cb.value);
    return {
        count: rooms.length,
        detail: rooms.join(', ') // 產出如 "201, 202"
    };
}

/**
 * 1. 新增訂單邏輯
 */
/**
 * 輔助工具：抓取房型複選資料 (適用於膠囊按鈕)
 * @param {string} prefix - 'o' (新增) 或 'e' (修改)
 */
function getRoomData(prefix) {
    const checkedBoxes = document.querySelectorAll(`input[name="${prefix}-room-type"]:checked`);
    const rooms = Array.from(checkedBoxes).map(cb => cb.value);
    return {
        count: rooms.length,
        detail: rooms.join(', ') // 產出如 "201, 202"
    };
}

/**
 * 1. 新增訂單邏輯
 */
async function addOrder() {
    const key = generateKey(); 
    // 取得房型數據 (膠囊按鈕本質還是 checkbox)
    const checkedBoxes = document.querySelectorAll('input[name="o-room-type"]:checked');
    const rooms = Array.from(checkedBoxes).map(cb => cb.value);
    
    if (rooms.length === 0) return alert("請選擇房型");

    toggleLoading(true);
    
    const total = Number(document.getElementById('o-total').value) || 0;
    const dep = Number(document.getElementById('o-dep').value) || 0;

    const payload = {
        action: "add", 
        key: key,
        name: document.getElementById('o-name').value, 
        date: document.getElementById('o-date').value,
        source: document.getElementById('o-source').value, 
        guests: document.getElementById('o-guests').value,
        rooms: rooms.length,           // 間數
        roomDetail: rooms.join(', '),  // 房號
        total: total, 
        dep: dep, 
        bal: total - dep,
        nights: Number(document.getElementById('o-nights').value) || 1, // 抓取純數字
        note: document.getElementById('o-note').value 
    };

    if (!payload.name || !payload.date) {
        toggleLoading(false);
        return alert("請填寫姓名與日期");
    }

    try {
        const result = await callGAS(payload);
        if (result === "Success" || result.result === "success") {
            alert("儲存成功"); 
            await fetchOrders(); 
            // 清除內容
            document.querySelectorAll('#order-add-content input').forEach(i => i.value = "");
            document.querySelectorAll('input[name="o-room-type"]').forEach(c => c.checked = false);
            toggleAccordion('order-add-content', 'order-acc-icon');
        } else {
            throw new Error(result);
        }
    } catch(e) {
        alert("儲存失敗：" + e.message);
    }
    toggleLoading(false);
}

/**
 * 2. 修改訂單邏輯
 */
async function updateOrder() {
    const key = generateKey();
    const oid = document.getElementById('e-oid').value;
    const roomData = getRoomData('e');
    const nights = Number(document.getElementById('e-nights').value) || 1; // 直接抓輸入框數字
    
    if (!oid) return alert("找不到訂單編號 (OID)");
    if (roomData.count === 0) return alert("請至少選擇一個房型");
    
    toggleLoading(true);

    const total = Number(document.getElementById('e-total').value) || 0;
    const dep = Number(document.getElementById('e-dep').value) || 0;

    const payload = {
        action: "update",
        key: key,
        oid: oid,
        name: document.getElementById('e-name').value,
        date: document.getElementById('e-date').value,
        nights: nights, 
        source: document.getElementById('e-source').value,
        guests: document.getElementById('e-guests').value,
        rooms: roomData.count,      
        roomDetail: roomData.detail, 
        total: total,
        dep: dep,
        bal: total - dep,
        note: document.getElementById('e-note').value
    };

    try {
        const result = await callGAS(payload);
        if (result === "Update Success" || result.result === "success") {
            alert("修改成功");
            await fetchOrders(); 
            document.getElementById('edit-modal').classList.remove('active');
        } else {
            alert("修改失敗：" + result);
        }
    } catch (e) {
        alert("連線異常，修改未完成");
    }
    toggleLoading(false);
}

/**
 * 3. 清空輸入框
 */
function clearOrderInputs() {
    // 陣列中直接加入 'o-nights'，移除了舊的 'o-nights-custom'
    ['o-name', 'o-date', 'o-total', 'o-dep', 'o-guests', 'o-note', 'o-nights'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    
    // 取消所有房型的打勾狀態 (膠囊按鈕會自動變回未選取顏色)
    document.querySelectorAll('input[name="o-room-type"]').forEach(cb => cb.checked = false);
}

/**
 * 4. 刪除訂單 - 透過 OID 刪除該行
 */
async function deleteOrder() {
    if (!confirm("確定要刪除這筆訂單嗎？刪除後無法復原。")) return;

    const key = generateKey();
    const oid = document.getElementById('e-oid').value;
    
    if (!oid) return alert("找不到訂單編號 (OID)");

    toggleLoading(true);

    try {
        const result = await callGAS({
            action: "delete",
            key: key,
            oid: oid
        });

        if (result === "Delete Success" || result.result === "success") {
            alert("訂單已刪除");
            await fetchOrders(); 
            document.getElementById('edit-modal').classList.remove('active');
        } else {
            alert("刪除失敗：" + result);
        }
    } catch (e) {
        alert("網路請求失敗，請稍後再試");
    }
    toggleLoading(false);
}


function renderOrderList() {
    if (!globalOrderData || globalOrderData.length === 0) {
        console.warn("尚無訂單資料");
        // 即便沒資料，也要更新標題並渲染空月曆
        const year = currentViewDate.getFullYear();
        const month = currentViewDate.getMonth();
        const titleEl = document.getElementById('cal-month-title');
        if (titleEl) titleEl.innerText = `${year}年 ${month + 1}月`;
        renderCalendar(year, month);
        return;
    }

    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    const titleEl = document.getElementById('cal-month-title');
    if (titleEl) titleEl.innerText = `${year}年 ${month + 1}月`;

    // 過濾並排序
    currentViewOrders = globalOrderData
        .filter(r => r[3] && String(r[3]).includes(monthStr))
        .map(r => ({
            id: r[0], source: r[1], name: r[2], date: r[3],
            guests: r[5], rooms: r[6], total: r[7], deposit: r[8],
            bal: r[9], nights: r[10], note: r[11]
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    // 渲染月曆
    renderCalendar(year, month);

    // 渲染清單
    const listDiv = document.getElementById('order-list');
    if (listDiv) {
        const totalPages = Math.ceil(currentViewOrders.length / itemsPerPage) || 1;
        if (currentListPage > totalPages) currentListPage = totalPages;
        
        const start = (currentListPage - 1) * itemsPerPage;
        const pageItems = currentViewOrders.slice(start, start + itemsPerPage);

        let listHtml = pageItems.map((o) => {
            const globalIdx = currentViewOrders.findIndex(item => item.id === o.id);
            return `
                <div class="order-list-item" onclick="showOrderDetail(currentViewOrders, ${globalIdx})">
                    <div class="order-info">
                        <div style="font-weight:bold;">${formatDate(o.date)} | ${o.name}</div>
                        <div style="font-size:0.85rem; color:#6a7181;">${o.rooms}房 / ${o.nights}晚</div>
                    </div>
                    <div style="text-align:right;">
                        <span class="source-tag tag-${getSourceClass(o.source)}">${o.source}</span>
                        <div style="color:#af6a58; font-weight:bold; margin-top:4px;">$${o.total}</div>
                    </div>
                </div>`;
        }).join('');

        // 分頁按鈕
        if (currentViewOrders.length > itemsPerPage) {
            listHtml += `
                <div style="display:flex; justify-content:center; align-items:center; gap:20px; margin-top:15px;">
                    <button onclick="changeListPage(-1)" class="pager-btn" ${currentListPage === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>
                    <span style="font-weight:bold; color:#666;">${currentListPage} / ${totalPages}</span>
                    <button onclick="changeListPage(1)" class="pager-btn" ${currentListPage === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>
                </div>`;
        }
        listDiv.innerHTML = listHtml || '<div style="text-align:center; padding:20px; color:#999;">本月尚無訂單</div>';
    }

    updateStatistics(currentViewOrders);
    calculateFinance(); 
}
// 分頁切換函數
function changeListPage(dir) {
    currentListPage += dir;
    renderOrderList();
}

function renderCalendar(year, month) {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const bookedStatus = {}; 

    currentViewOrders.forEach((o, index) => {
        // 使用 yyyy-mm-dd 分割避免時區偏誤
        const [y, m, d] = o.date.split('-').map(Number);
        const checkInDate = new Date(y, m - 1, d);
        const nights = parseInt(o.nights) || 1;
        
        for (let i = 0; i < nights; i++) {
            const current = new Date(checkInDate);
            current.setDate(checkInDate.getDate() + i);
            if (current.getFullYear() === year && current.getMonth() === month) {
                const day = current.getDate();
                if (!bookedStatus[day]) bookedStatus[day] = [];
                bookedStatus[day].push({ orderIndex: index, isFirstDay: (i === 0) });
            }
        }
    });

    const weeks = ['日', '一', '二', '三', '四', '五', '六'];
    weeks.forEach(w => grid.innerHTML += `<div class="cal-day cal-header">${w}</div>`);
    
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div class="cal-day"></div>`;
    
    const today = new Date();
    const todayY = today.getFullYear();
    const todayM = today.getMonth();
    const todayD = today.getDate();

    for (let day = 1; day <= lastDate; day++) {
        const dayOrders = bookedStatus[day] || [];
        let className = 'cal-day';
        
        // 精準判斷今天
        if (day === todayD && month === todayM && year === todayY) className += ' today';
        
        if (dayOrders.length > 0) {
            const hasCheckIn = dayOrders.some(d => d.isFirstDay);
            className += hasCheckIn ? ' has-order' : ' has-order stay-over';
        }
        
        const indices = JSON.stringify(dayOrders.map(d => d.orderIndex));
        const clickAction = dayOrders.length > 0 ? `onclick='handleCalendarClick(${indices})'` : '';
        
        grid.innerHTML += `<div class="${className}" ${clickAction}>${day}</div>`;
    }
}

// 輔助：日期格式化 (修復時區減一天問題)
function formatDate(dateStr) {
    if (!dateStr) return "";
    // 如果是 yyyy-mm-dd 格式，直接取最後兩段
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parseInt(parts[1])}/${parseInt(parts[2])}`;
    
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

// 處理月曆點擊：開啟該日期的第一筆訂單
function handleCalendarClick(indices) {
    if (indices && indices.length > 0) {
        showOrderDetail(currentViewOrders, indices[0], indices);
    }
}

// --- 3. 訂單詳情 (支援左右切換當日多單) ---
function showOrderDetail(sourceArray, index, dayGroupIndices = null) {
    const order = sourceArray[index];
    if (!order) return;

    const infoList = document.getElementById('detail-info-list');
    
    // 1. 生成切換器 (只有在當天有多筆訂單時才顯示)
    let pagerHtml = "";
    if (dayGroupIndices && dayGroupIndices.length > 1) {
        const currentPos = dayGroupIndices.indexOf(index) + 1;
        pagerHtml = `
            <div class="detail-pager" style="display:flex; justify-content:space-between; align-items:center; background:#f8f9fa; padding:10px; border-radius:8px; margin-bottom:12px;">
                <button onclick='showOrderDetail(currentViewOrders, ${dayGroupIndices[dayGroupIndices.indexOf(index)-1]}, ${JSON.stringify(dayGroupIndices)})' class="pager-btn" ${currentPos === 1 ? 'disabled' : ''} style="border:none; background:none; color:#af6a58; cursor:pointer;"><i class="fa-solid fa-chevron-left"></i> 上一筆</button>
                <span style="font-weight:bold; font-size:0.85rem;">當日第 ${currentPos} / ${dayGroupIndices.length} 筆</span>
                <button onclick='showOrderDetail(currentViewOrders, ${dayGroupIndices[dayGroupIndices.indexOf(index)+1]}, ${JSON.stringify(dayGroupIndices)})' class="pager-btn" ${currentPos === dayGroupIndices.length ? 'disabled' : ''} style="border:none; background:none; color:#af6a58; cursor:pointer;">下一筆 <i class="fa-solid fa-chevron-right"></i></button>
            </div>
        `;
    }

    // 2. 聯絡按鈕配置邏輯
    const s = order.source || "私LINE";
    let btnConfig = { text: "開啟 App", icon: "fa-solid fa-comment-dots", color: "#af6a58", appUrl: "#", webUrl: "#" };
    if (s.includes("Booking")) {
        btnConfig = { text: "Pulse", icon: "fa-solid fa-house-laptop", color: "#003580", appUrl: "pulse://hotel/", webUrl: "https://admin.booking.com" };
    } else if (s.includes("官方LINE")) {
        btnConfig = { text: "LINE OA", icon: "fa-solid fa-comment-medical", color: "#00b900", appUrl: "lineoa://", webUrl: "https://manager.line.biz" };
    } else if (s.includes("LINE")) {
        btnConfig = { text: "LINE", icon: "fa-solid fa-comment-dots", color: "#00c300", appUrl: "line://", webUrl: "https://line.me" };
    }

    // 3. 渲染詳細資訊 (顯示模式)
    infoList.innerHTML = pagerHtml + `
        <div class="info-item"><span class="info-label"><i class="fa-solid fa-user"></i> 訂房人</span><span class="info-value">${order.name}</span></div>
        <div class="info-item"><span class="info-label"><i class="fa-solid fa-calendar"></i> 入住日期</span><span class="info-value">${formatDate(order.date)} (${order.nights}晚)</span></div>
        <div class="info-item"><span class="info-label"><i class="fa-solid fa-tag"></i> 來源</span><span class="source-tag tag-${getSourceClass(s)}">${s}</span></div>
        <div class="info-item"><span class="info-label"><i class="fa-solid fa-bed"></i> 房型/人數</span><span class="info-value">${order.roomDetail || '未標註'} (${order.rooms}間) / ${order.guests}人</span></div>
        <div class="info-item" style="color:#af6a58; font-weight:bold;"><span class="info-label">總金額</span><span class="info-value">$${Number(order.total).toLocaleString()}</span></div>
        <div class="info-item"><span class="info-label">備註</span><span class="info-value">${order.note || '無'}</span></div>
    `;

    // 4. 更新聯絡按鈕
    const actionBtn = document.getElementById('btn-pulse');
    if (actionBtn) {
        actionBtn.innerHTML = `<i class="${btnConfig.icon}"></i> ${btnConfig.text}`;
        actionBtn.style.background = btnConfig.color;
        actionBtn.onclick = () => {
             const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
             window.open(isMobile ? btnConfig.appUrl : btnConfig.webUrl, '_blank');
        };
    }

    // 5. 預填編輯欄位 (對應您的 Grid HTML 結構)
    // 這裡使用 e- 前綴代表 Edit 模式的 ID
    setInputValue('e-oid', order.id);
    setInputValue('e-name', order.name);
    setInputValue('e-date', order.date ? order.date.split('T')[0] : '');
    setInputValue('e-nights', order.nights || '1'); // 直接填入晚數輸入框
    setInputValue('e-source', s);
    setInputValue('e-guests', order.guests);
    setInputValue('e-total', order.total);
    setInputValue('e-dep', order.deposit || 0);
    setInputValue('e-note', order.note);

    // 6. 還原「房型膠囊」的勾選狀態
    const roomStr = order.roomDetail || "";
    document.querySelectorAll('input[name="e-room-type"]').forEach(cb => {
        // 判斷該房號 (如 201) 是否在訂單的 roomDetail 字串中
        cb.checked = roomStr.includes(cb.value);
    });

    // 進入顯示模式，隱藏編輯輸入框，顯示文字
    toggleEditMode(false); 
    
    // 顯示 Modal
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('active'), 10);
}

// 輔助函數：安全設定數值
function setInputValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value || '';
}
// --- 財務計算優化 ---
function calculateFinance() {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    // 從原始 globalOrderData 過濾，確保數據最準
    const mData = globalOrderData.filter(r => r[3] && String(r[3]).includes(monthStr));

    const income = mData.reduce((s, r) => s + (parseFloat(r[7]) || 0), 0);
    const bTotal = mData.filter(r => String(r[1]).includes('Booking')).reduce((s, r) => s + (parseFloat(r[7]) || 0), 0);
    const fee = Math.round(bTotal * 0.12); // Booking 手續費 12%
    
    const laundry = parseFloat(document.getElementById('laundry-cost')?.value) || 0;
    const utility = parseFloat(document.getElementById('utility-cost')?.value) || 0;

    const net = income - fee - laundry - utility;

    if(document.getElementById('fin-income')) document.getElementById('fin-income').innerText = '$' + income.toLocaleString();
    if(document.getElementById('fin-fee')) document.getElementById('fin-fee').innerText = '-$' + fee.toLocaleString();
    if(document.getElementById('fin-net')) document.getElementById('fin-net').innerText = '$' + net.toLocaleString();
    
    // 儲存至全域供月結封存使用
    window.currentMonthFin = { income, fee, laundry, utility, net };
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
    // 1. 取得基本房費與手續費 (從全域變數拿，若無則設為 0)
    const income = window.currentMonthFin?.income || 0;
    const fee = window.currentMonthFin?.fee || 0;

    // 2. 取得即時輸入的洗衣費與水電費
    // 使用 parseInt 確保它是數字，避免字串相加錯誤
    const laundry = parseInt(document.getElementById('laundry-cost').value) || 0;
    const utility = parseInt(document.getElementById('utility-cost').value) || 0;

    // 3. 計算實際淨利
    const net = income - fee - laundry - utility;

    // 4. 更新畫面顯示 (財務月結試算區的總額)
    const netDisplay = document.getElementById('archive-net-profit-preview');
    if (netDisplay) {
        netDisplay.innerText = '$' + net.toLocaleString();
    }

    // 5. 【關鍵】同步回全域變數，這樣「封存彈窗」開啟時數據才會正確
    if (!window.currentMonthFin) window.currentMonthFin = {};
    window.currentMonthFin.laundry = laundry;
    window.currentMonthFin.utility = utility;
    window.currentMonthFin.net = net;
    
    console.log("財務數據已同步更新:", window.currentMonthFin);
}

/**
 * 開啟水電試算彈窗
 */
function openUtilityModal() {
    const y = currentViewDate.getFullYear();
    const m = currentViewDate.getMonth() + 1;
    
    const iframe = document.getElementById('utility-iframe');
    const modal = document.getElementById('u-modal');

    if (iframe) {
        // 現在只需要傳遞年份與月份，子網頁會自己用 generateKey() 通訊
        // 不再需要傳遞 &t=${savedToken}
        iframe.src = `./utility-app.html?y=${y}&m=${m}`;
    }
    
    if (modal) {
        modal.style.display = 'block'; // 先顯示元素
        setTimeout(() => { modal.classList.add('active'); }, 10); // 再觸發動畫
    }
}

/**
 * 監聽來自水電子網頁 (iframe) 的訊息
 */
window.addEventListener('message', function(e) {
    // 1. 更新財務攤提金額
    if (e.data.type === 'utility_update') {
        // 這裡對應你 HTML 裡的「水電攤提」輸入框 ID
        // 如果你 HTML 裡只有一個 id="utility-cost"，就直接填入
        const targetInput = document.getElementById('utility-cost');
        if (targetInput) {
            targetInput.value = e.data.value;
            // 更新完金額後，觸發主介面的淨利計算
            if (typeof updateNetPreview === "function") {
                updateNetPreview();
            }
        }
    }
    
    // 2. 接收關閉彈窗指令
    if (e.data.type === 'close_utility_modal') {
        closeUtilityModal();
    }
});

/**
 * 關閉水電試算彈窗
 */
function closeUtilityModal() {
    const modal = document.getElementById('u-modal');
    if (modal) {
        modal.classList.remove('active');
        // 等待 CSS 過渡動畫結束後再隱藏
        setTimeout(() => { modal.style.display = 'none'; }, 200);
    }
}

/**
 * 全域點擊事件：點擊彈窗外部黑色區域自動關閉
 */
window.onclick = function(event) {
    const uModal = document.getElementById('u-modal');
    const editModal = document.getElementById('edit-modal');
    const archiveModal = document.getElementById('archive-modal');

    if (event.target == uModal) closeUtilityModal();
    if (event.target == editModal) {
        editModal.style.display = 'none';
        editModal.classList.remove('active');
    }
    if (event.target == archiveModal) {
        archiveModal.style.display = 'none';
        archiveModal.classList.remove('active');
    }
}
/**
 * 開啟封存確認彈窗
 * 抓取當前頁面最新的經營數據與財務數值
 */
function openArchiveModal() {
    const monthTitle = document.getElementById('cal-month-title').innerText;
    
    // 確保從全域變數中拿取最新的財務狀態
    const fin = window.currentMonthFin || { income:0, fee:0, laundry:0, utility:0, net:0 };
    
    // 從畫面上抓取已經由 renderOrderList 自動算好的經營數據
    const guests = document.getElementById('stat-total-guests').innerText;
    const rooms = document.getElementById('stat-total-rooms').innerText;
    const bRate = document.getElementById('stat-b-rate').innerText;
    const oRate = document.getElementById('stat-o-rate').innerText;
    const totalExpenses = (fin.laundry || 0) + (fin.utility || 0);

    const listContainer = document.getElementById('archive-summary-list');
    if (listContainer) {
        listContainer.innerHTML = `
            <div class="archive-list-item">
                <span class="archive-label"><i class="fa-regular fa-calendar-check"></i> 結算月份</span>
                <span class="archive-value">${monthTitle}</span>
            </div>
            <div class="archive-list-item">
                <span class="archive-label"><i class="fa-solid fa-users"></i> 總來客數</span>
                <span class="archive-value">${guests} 人</span>
            </div>
            <div class="archive-list-item">
                <span class="archive-label"><i class="fa-solid fa-bed"></i> 總開房數</span>
                <span class="archive-value">${rooms} 房</span>
            </div>
            <div class="archive-list-item">
                <span class="archive-label"><i class="fa-solid fa-chart-pie"></i> 通路佔比</span>
                <span class="archive-value">Booking ${bRate} / 私訊 ${oRate}</span>
            </div>
            <hr style="border:0; border-top:1px dashed #eee; margin:15px 0;">
            <div class="archive-list-item">
                <span class="archive-label">房費總收入</span>
                <span class="archive-value">$${fin.income.toLocaleString()}</span>
            </div>
            <div class="archive-list-item">
                <span class="archive-label">Booking 手續費</span>
                <span class="archive-value" style="color:#e74c3c;">-$${fin.fee.toLocaleString()}</span>
            </div>
            <div class="archive-list-item">
                <span class="archive-label">洗衣/水電雜支</span>
                <span class="archive-value">-$${totalExpenses.toLocaleString()}</span>
            </div>
        `;
    }

    // 更新彈窗內的最終淨利顯示
    const netDisplay = document.getElementById('archive-net-profit');
    if (netDisplay) {
        netDisplay.innerText = '$' + fin.net.toLocaleString();
    }
    
    document.getElementById('archive-modal').classList.add('active');
}

/**
 * 關閉封存確認彈窗
 */
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