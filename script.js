/* --- 數據配置區 (與前版相同) --- */
const PRICE_MAP = {      
  '201': { weekday: { 1: 1900 }, weekend: { 1: 2200 }, cny: { 1: 2900 }, cap: 2 },      
  '202': { weekday: { 1: 2400, 2: 2600 }, weekend: { 1: 2600, 2: 2800 }, cny: { 1: 5600, 2: 6000 }, cap: 4 },      
  '301': { weekday: { 1: 3500, 2: 4500, 3: 5000, 4: 5500 }, weekend: { 1: 3800, 2: 4800, 3: 5300, 4: 5800 }, cny: { 1: 6000, 2: 7000, 3: 8000, 4: 9000 }, cap: 8 }      
};      

const TPL_DATA = [      
  { cat: '訂房', title: '有空房回覆(含介紹)', content: (d) => `👋您好～煦願民宿 ${d} 有空房，每間房都有陽台\n寬敞客廳備有：\n✅電動麻將桌✅藍芽麥克風音響✅桌遊✅廚房可煮火鍋，大長桌同樂自在輕鬆\n車庫最多可停放3輛車\n私訊訂房可享優惠～\n民宿設施可參考官網：wishstaybnb.com` },      
  { cat: '訂房', title: '匯款帳號資訊', content: (d,p,dep) => `中華郵政（代號700）\n帳號：0111334-0036797\n戶名：林奐廷\n需麻煩您於 24 小時內匯入訂金 $${dep}，核對後即完成預定。` },      
  { cat: '入住', title: '今日大門密碼', content: (d,p) => `煦願小幫手先介紹：\n🌟這邊先給您今日大門密碼：${p}\n🔓開門方法：\n（1）從外開門：手掌觸碰螢幕，按鍵亮起後輸入密碼按*字鍵\n（2）從裡面出去：按下安全鈕、手把同時下壓即可開門` },
  { cat: '入住', title: '鑰匙與拖鞋提醒', content: () => `🌟房間鑰匙配備在-電視櫃旁鑰匙架，歡迎使用\n隔天11點退房時，鑰匙放回架上，回傳照片即做好退房手續喔～\n\n🌟民宿拖鞋每一組客人離開後都清洗過，每一組客人都是專屬的室內拖鞋，請您放心使用～` },
  { cat: '設施', title: '備品與飲品說明', content: () => `🌟民宿室內全面禁菸，若有需要吸菸的朋友，我們每個陽台和車庫都備有煙灰缸，謝謝您🙏\n\n🌟民宿備有大、小毛巾、漱口杯、沐浴乳和洗髮精是用-沙威隆系列，並備有旋轉式按摩蓮蓬頭和吹風機，舒緩您旅途的疲憊\n\n🌟吧台上面的飲品和零食、礦泉水是為您們做準備，請自行取用\n\n🌟溫馨提醒，現在民宿不能主動提供牙刷牙膏一次性用具，若真的沒有帶，請告知` },
  { cat: '設施', title: '麥克風使用教學', content: () => `🎤藍牙麥克風音響使用說明：\nhttps://m.youtube.com/shorts/8LMhA15R870\n（唱歌請於 10:00 前結束，後續可改玩電動麻將喔！）` },      
  { cat: '烤肉', title: '代訂食材流程', content: () => `以下向您說明代訂烤肉食材的相關流程：\n1. 確認匯款後，我們將立即為您進行代訂服務。\n\n2. 烤肉食材將由宅配公司配送。建議食材需於中午前送達，並保留足夠的退冰時間。\n\n3. 貨物抵達後，民宿會先協助開箱檢查品項、數量、重量是否正確。\n\n4. 完成檢查後，我們會將現場照片回傳給您確認。感謝您的配合與支持！\n\n⚠️請於9:00前結束室外烤肉活動，可移至室內繼續享用聚會☺️` },
  { cat: '周邊', title: '附近機能與折扣', content: () => `🚗民宿附近的景點及交通：\nhttps://wishstaybnb.com/transportation\n#民宿外面走路1分鐘有一個公園可活動\n#隔壁有一間走路兩分鐘快炒店（阿信快炒）可吃合菜，若有需要可報-煦願民宿，可打9.5折，這是快炒店給鄰居的優惠～\nhttps://maps.app.goo.gl/P3wgTe4HAHboXiYy9` },      
  { cat: '周邊', title: '超商與步道推薦', content: () => `走路5分鐘可到7-11和美廉社，還有早午餐店\n7-11：https://maps.app.goo.gl/uskg6orv7dVas2eb7\n美聯社：https://maps.app.goo.gl/LNYRJGaVaj8GNxAy7\n\n分享很不錯的步道給您參考：\n仁山步道：https://maps.app.goo.gl/C9XisDS8qaQax11q6\n三清宮步道：https://maps.app.goo.gl/rmyyNfcdFHc8YdbX6` },      
  { cat: '退房', title: '住宿資料填寫表', content: () => `麻煩您✏️住宿資料\n（一人代表填寫即可，謝謝！）\n姓名：\n出生年月：\n身分證號：\n住址：\n電話：` },
  { cat: '退房', title: '五星好評連結', content: () => `有空歡迎幫您我們留言+5星好評，您的肯定是我們前進的動力！煦願民宿感謝您💕\nhttps://maps.app.goo.gl/vcoPQQuMRaME1rpY6` }
];      

/* --- 核心邏輯區 --- */

function toggleAccordion() {
  const content = document.getElementById('acc-content');
  const icon = document.getElementById('acc-icon');
  content.classList.toggle('active');
  icon.innerText = content.classList.contains('active') ? '▲' : '▼';
}

function switchPage(pageId, e) {      
  document.querySelectorAll('.page, .tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');      
  if (e && e.currentTarget) e.currentTarget.classList.add('active');      
}      

function filterCat(cat, e) {      
  document.querySelectorAll('.cat-tag').forEach(el => el.classList.remove('active'));      
  if (e && e.currentTarget) e.currentTarget.classList.add('active');      
  updateTpl(cat);      
}

function updateAll() {
  updateTpl();
  buildPackage();
}

function updateTpl(filter = 'all') {      
  const d = document.getElementById('v-date').value || "____";      
  const p = document.getElementById('v-pwd').value || "____";      
  const dep = document.getElementById('v-dep').value || "____";      
  const list = document.getElementById('tpl-list');      
  list.innerHTML = '';      
  TPL_DATA.filter(item => filter === 'all' || item.cat === filter)
    .forEach((item, i) => {      
      const box = document.createElement('div'); 
      box.className = 'card';      
      box.innerHTML = `<h3>[${item.cat}] ${item.title}</h3><div class="preview-area" id="t-${i}">${item.content(d,p,dep)}</div><button class="copy-btn" onclick="copyText('t-${i}', event)">複製文字</button>`;      
      list.appendChild(box);      
  });      
}

function buildPackage() {
  const d = document.getElementById('v-date').value || "今天";
  const p = document.getElementById('v-pwd').value || "____";
  let pkg = `👋 您好！煦願小幫手先介紹入住資訊 (${d})：\n\n`;

  if(document.getElementById('c-basic').checked) {
    pkg += `🌟 今日大門密碼：${p}\n🔓 開門方法：\n（1）外開：手掌觸碰螢幕亮起後輸入密碼按*字鍵\n（2）內出：按下安全鈕、手把下壓即可。\n🔑 房間鑰匙配備在電視櫃旁鑰匙架，隔天退房放回即可。\n🩴 拖鞋每組客人離開後都清洗過，請放心使用。\n🚭 室內全面禁菸，陽台和車庫皆備有煙灰缸。\n--------------------------\n`;
  }
  
  if(document.getElementById('c-amenity').checked) {
    pkg += `🛁 備品與設備：\n- 備有大小毛巾、漱口杯、沙威隆洗沐系列、按摩蓮蓬頭。\n- 吧台飲品零食礦泉水免費取用。\n⚠️ 溫馨提醒：不主動提供牙刷牙膏一次性用具，若真的沒帶請告知。\n--------------------------\n`;
  }

  if(document.getElementById('c-sing').checked) {
    pkg += `🎤 唱歌/音響說明：\n教學影片：https://m.youtube.com/shorts/8LMhA15R870\n⚠️ 唱歌請於 10:00 前結束，後續可改玩電動麻將或桌遊喔！\n--------------------------\n`;
  }

  if(document.getElementById('c-nearby').checked) {
    pkg += `🍱 附近機能：\n- 走路5分鐘：7-11、美廉社、早午餐店。\n- 走路2分鐘：阿信快炒，報「煦願民宿」享 9.5 折優惠！\n--------------------------\n`;
  }

  if(document.getElementById('c-spot').checked) {
    pkg += `🏞️ 推薦景點與步道：\n- 景點：安農溪落羽松、張美阿嬤農場、梅花湖、冬山河。\n- 步道：仁山步道、三清宮步道。\n🚗 更多資訊：https://wishstaybnb.com/transportation\n--------------------------\n`;
  }

  if(document.getElementById('c-form').checked) {
    pkg += `✏️ 麻煩填寫住宿資料（一人代表即可）：\n姓名：\n出生年月：\n身分證號：\n住址：\n電話：\n--------------------------\n`;
  }

  pkg += `煦願民宿祝您入住愉快！☺️`;
  document.getElementById('pkg-preview').innerText = pkg;
}

function copyText(id, e) {      
  const text = document.getElementById(id).innerText;      
  navigator.clipboard.writeText(text).then(() => {      
    const btn = e.currentTarget; 
    const old = btn.innerText; btn.innerText = '✅ 已複製文字';      
    setTimeout(() => { btn.innerText = old; }, 1000);      
  });      
}      

/* --- 房價神器邏輯 --- */
function setCalcMode(mode) {      
  document.getElementById('btn-smart').classList.toggle('active', mode === 'smart');      
  document.getElementById('btn-manual').classList.toggle('active', mode === 'manual');      
  document.getElementById('smart-calc-box').style.display = mode === 'smart' ? 'block' : 'none';      
  document.getElementById('manual-calc-box').style.display = mode === 'manual' ? 'block' : 'none';      
}      

function runSmartCalc() {      
  const dateStr = document.getElementById('dateInput').value;      
  const guests = parseInt(document.getElementById('guestInput').value) || 0;      
  if (!dateStr || guests <= 0) return;      
  const s = new Date(dateStr).getDay() === 6 ? 'weekend' : 'weekday';      
  const list = document.getElementById('schemeList');
  list.innerHTML = '';      
  document.getElementById('smart-schemes').style.display = 'block';      
  const singles = [];
  Object.entries(PRICE_MAP).forEach(([rid, prs]) => {
    Object.entries(prs[s]).forEach(([beds, p]) => {
      singles.push({ rid, beds: parseInt(beds), cap: parseInt(beds)*2, p });
    });
  });
  const valid = [];
  singles.forEach(c => { if(c.cap >= guests) valid.push({ n: `${c.rid}(${c.beds}床)`, t: c.p }); });
  for(let i=0; i<singles.length; i++){
    for(let j=i+1; j<singles.length; j++){
      if(singles[i].rid !== singles[j].rid && (singles[i].cap + singles[j].cap) >= guests)
        valid.push({ n: `${singles[i].rid}+${singles[j].rid}`, t: singles[i].p + singles[j].p });
      for(let k=j+1; k<singles.length; k++){
        if(singles[i].rid !== singles[j].rid && singles[j].rid !== singles[k].rid && (singles[i].cap+singles[j].cap+singles[k].cap) >= guests)
          valid.push({ n: `201+202+301 (全開)`, t: singles[i].p+singles[j].p+singles[k].p });
      }
    }
  }
  valid.sort((a,b)=>a.t-b.t).slice(0,5).forEach(sc => {
    const btn = document.createElement('button'); btn.className = 'scheme-btn';
    btn.innerHTML = `<div>方案：${sc.n}</div><strong>總價：$${sc.t.toLocaleString()}</strong>`;
    btn.onclick = () => renderFinal(sc.t, sc.n, dateStr, guests);
    list.appendChild(btn);
  });
}      

function runManualCalc() {      
  const s = document.getElementById('m-season').value;      
  const rs = [
    {id:'201', b:parseInt(document.getElementById('m-201').value)},
    {id:'202', b:parseInt(document.getElementById('m-202').value)},
    {id:'301', b:parseInt(document.getElementById('m-301').value)}
  ].filter(r => r.b > 0);      
  if(rs.length === 0) return;      
  let total = 0; rs.forEach(r => total += PRICE_MAP[r.id][s][r.b]);
  renderFinal(total, rs.map(r=>r.id).join('+'), null, null);      
}      

function renderFinal(bt, config, dStr, g) {      
  const priv = Math.ceil((bt * 0.88 * 1.03) / 10) * 10;      
  let ct = ''; 
  if(dStr && g){ 
    const dp = dStr.split('-'); 
    ct = `${parseInt(dp[1])}月${parseInt(dp[2])}日入住${g}人，開${config}，優惠報價$${priv.toLocaleString()}`; 
  }
  document.getElementById('calc-result').innerHTML = `
    <div class="plan">
      <div class="highlight">Booking價：$${bt.toLocaleString()}</div>
      <div class="private-price">私訊優惠價：$${priv.toLocaleString()}</div>
      ${ct ? `<div style="margin-top:15px;"><div class="preview-area" id="p-copy">${ct}</div><button class="copy-btn" onclick="copyText('p-copy', event)">複製報價</button></div>` : ''}
    </div>`;
}      

/* --- 初始化 --- */
window.onload = updateAll;