"use client";

import { useMemo, useState } from "react";

type FoodState = "normal" | "liked" | "blocked";
type Dish = { name: string; note: string; tags: string[]; cuisines?: string[] };

const groups: Record<string, string[]> = {
  "畜肉类": ["猪肉", "牛肉", "羊肉", "兔肉", "猪蹄", "猪耳朵", "猪舌头", "猪尾巴", "猪脑", "牛骨髓", "排骨", "牛蹄筋", "牛板筋"],
  "家禽肉": ["鸡肉", "鸭肉", "鹅肉", "鸽肉", "鹌鹑肉", "鸭脖", "鸭头", "鸭舌", "鸭锁骨", "鸡爪", "鸭爪", "凤爪", "鸭肠", "鸭翅"],
  "肉脏类": ["猪肝", "猪肚", "猪大肠", "猪腰子", "猪心", "猪血", "牛肚", "牛杂", "鸡胗", "鸡心", "鸭胗", "鹅胗", "鸡肝", "鸭肝"],
  "鱼虾蟹": ["三文鱼", "金枪鱼", "鳕鱼", "鲈鱼", "带鱼", "黄鱼", "鲤鱼", "鲫鱼", "草鱼", "鲶鱼", "鱼头", "鱼杂", "鱼籽", "鱼泡", "鱼丸", "虾", "小龙虾", "皮皮虾", "蟹", "虾滑", "蟹柳"],
  "贝类水产": ["扇贝", "生蚝", "花甲", "蛏子", "海螺", "田螺", "螺蛳", "章鱼", "鱿鱼", "墨鱼", "海蜇", "鲍鱼", "海参", "牛蛙", "泥鳅", "黄鳝", "甲鱼"],
  "蛋类": ["鸡蛋", "鸭蛋", "鹌鹑蛋", "鹅蛋"],
  "叶菜": ["白菜", "菠菜", "油菜", "空心菜", "苋菜", "茼蒿", "油麦菜", "生菜", "苦菊", "芹菜", "香菜", "韭菜", "红苋菜", "木耳菜", "水芹", "茭白", "紫苏", "笋", "鱼腥草", "马齿苋", "香椿"],
  "果菜豆类": ["西红柿", "茄子", "青椒", "彩椒", "辣椒", "黄瓜", "南瓜", "冬瓜", "苦瓜", "丝瓜", "秋葵", "西葫芦", "长豆角", "荷兰豆", "四季豆", "扁豆", "豌豆", "毛豆", "蚕豆", "绿豆"],
  "花菜菌菇": ["花菜", "西兰花", "黄花菜", "蘑菇", "香菇", "金针菇", "平菇", "杏鲍菇", "木耳"],
  "葱蒜类": ["洋葱", "蒜苗", "大葱", "小葱", "大蒜", "大蒜叶"],
  "豆制品": ["豆腐", "千张", "腐竹", "豆干", "油豆腐", "素鸡", "魔芋"],
  "主食": ["面条", "米粉", "米线", "粉丝", "年糕", "馒头", "包子", "饺子", "馄饨", "油条", "烧麦", "螺蛳粉"],
  "水果": ["苹果", "梨", "香蕉", "橙子", "橘子", "柚子", "柠檬", "西瓜", "哈密瓜", "甜瓜", "猕猴桃", "葡萄", "草莓", "蓝莓", "火龙果", "芒果", "木瓜", "桃子", "李子", "杏", "樱桃", "榴莲", "菠萝蜜", "牛油果", "百香果", "山竹", "菠萝", "柿子", "杨梅", "桑葚", "荔枝", "龙眼"]
};

const recipes: Dish[] = [
  { name: "番茄炒鸡蛋", note: "酸甜开胃，老少皆宜", tags: ["西红柿", "鸡蛋"] },
  { name: "香菇滑鸡", note: "鲜香嫩滑，适合配米饭", tags: ["香菇", "鸡肉"] },
  { name: "芹菜炒牛肉", note: "荤素均衡，清香爽口", tags: ["芹菜", "牛肉"] },
  { name: "蒜蓉西兰花", note: "清爽蔬菜，补充膳食纤维", tags: ["西兰花", "大蒜"] },
  { name: "鲈鱼蒸豆腐", note: "高蛋白、少油，口感细嫩", tags: ["鲈鱼", "豆腐"] },
  { name: "黄瓜虾仁", note: "清鲜轻盈，颜色也好看", tags: ["黄瓜", "虾"] },
  { name: "排骨炖冬瓜", note: "汤鲜不腻，适合多人分享", tags: ["排骨", "冬瓜"] },
  { name: "木耳炒鸡蛋", note: "家常快手，营养搭配自然", tags: ["木耳", "鸡蛋"] },
  { name: "香煎三文鱼", note: "优质脂肪与蛋白质来源", tags: ["三文鱼", "柠檬"] },
  { name: "青椒肉丝", note: "经典下饭菜，咸香有层次", tags: ["青椒", "猪肉"] },
  { name: "蒜蓉生蚝", note: "鲜味突出，适合丰盛聚餐", tags: ["生蚝", "大蒜"] },
  { name: "豆腐菌菇煲", note: "温暖鲜美，素食也满足", tags: ["豆腐", "蘑菇", "金针菇"] },
  { name: "清蒸黄鱼", note: "突出原味，清淡不失鲜美", tags: ["黄鱼", "小葱"] },
  { name: "油麦菜炒豆干", note: "清脆与豆香搭配，简单耐吃", tags: ["油麦菜", "豆干"] },
  { name: "洋葱炒羊肉", note: "香气浓郁，适合偏重口味", tags: ["洋葱", "羊肉"] },
  { name: "秋葵蒸蛋", note: "口感柔和，适合儿童与老人", tags: ["秋葵", "鸡蛋"] },
  { name: "花甲粉丝煲", note: "鲜香有主食感，聚餐气氛足", tags: ["花甲", "粉丝", "大蒜"] },
  { name: "凉拌菠菜", note: "清口解腻，平衡整桌菜", tags: ["菠菜"] },
  { name: "黑椒牛肉意面", note: "黑椒香气浓郁，主食与蛋白质兼顾", tags: ["牛肉", "面条", "洋葱"], cuisines: ["西餐"] },
  { name: "奶油蘑菇鸡", note: "奶香柔和，适合搭配面包或意面", tags: ["鸡肉", "蘑菇", "洋葱"], cuisines: ["西餐"] },
  { name: "柠香烤鳕鱼", note: "清爽少油，突出鱼肉鲜味", tags: ["鳕鱼", "柠檬"], cuisines: ["西餐"] },
  { name: "尼斯风味沙拉", note: "蔬菜丰富，清爽平衡", tags: ["生菜", "西红柿", "鸡蛋"], cuisines: ["西餐"] },
  { name: "照烧鸡肉饭", note: "甜咸酱香，米饭搭配很满足", tags: ["鸡肉", "洋葱"], cuisines: ["日料"] },
  { name: "味噌烤三文鱼", note: "咸鲜微甜，油脂香气细腻", tags: ["三文鱼"], cuisines: ["日料"] },
  { name: "日式牛肉寿喜锅", note: "暖锅共享，适合多人用餐", tags: ["牛肉", "豆腐", "金针菇", "大葱"], cuisines: ["日料"] },
  { name: "玉子烧", note: "柔软香甜，早餐或配菜都合适", tags: ["鸡蛋"], cuisines: ["日料"] },
  { name: "韩式辣炒鸡", note: "香辣浓郁，配饭很开胃", tags: ["鸡肉", "洋葱", "大蒜"], cuisines: ["韩餐"] },
  { name: "韩式牛肉拌饭", note: "一碗兼顾肉、蛋和蔬菜", tags: ["牛肉", "鸡蛋", "菠菜", "香菇"], cuisines: ["韩餐"] },
  { name: "豆腐海鲜汤", note: "热辣鲜香，适合凉爽天气", tags: ["豆腐", "虾", "花甲"], cuisines: ["韩餐"] },
  { name: "泰式柠檬虾", note: "酸辣明亮，清爽而有层次", tags: ["虾", "柠檬", "香菜"], cuisines: ["东南亚"] },
  { name: "菠萝鸡肉炒饭", note: "果香酸甜，适合全家分享", tags: ["菠萝", "鸡肉", "鸡蛋"], cuisines: ["东南亚"] },
  { name: "越式牛肉米粉", note: "汤头清鲜，香草气息丰富", tags: ["牛肉", "米粉", "香菜"], cuisines: ["东南亚"] }
];

const cuisineOptions = ["不限菜系", "中餐", "西餐", "日料", "韩餐", "东南亚"];

export default function Home() {
  const [states, setStates] = useState<Record<string, FoodState>>({});
  const [people, setPeople] = useState(2);
  const [richness, setRichness] = useState("中等");
  const [meal, setMeal] = useState("晚餐");
  const [taste, setTaste] = useState("家常均衡");
  const [cuisine, setCuisine] = useState("不限菜系");
  const [notes, setNotes] = useState("");
  const [plan, setPlan] = useState<Dish[] | null>(null);
  const [thinking, setThinking] = useState(false);
  const [engine, setEngine] = useState<"local" | "llm">("local");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState("gpt-5.6-terra");
  const [protocol, setProtocol] = useState<"responses" | "chat">("responses");
  const [apiUrl, setApiUrl] = useState("https://api.openai.com/v1/responses");
  const [temperature, setTemperature] = useState("0.7");
  const [singleUseKey, setSingleUseKey] = useState(true);
  const [error, setError] = useState("");

  const counts = useMemo(() => Object.values(states).reduce((a, s) => ({ ...a, [s]: (a[s] || 0) + 1 }), {} as Record<string, number>), [states]);

  function cycle(food: string) {
    setPlan(null);
    setStates(prev => {
      const current = prev[food] || "normal";
      const next: FoodState = current === "normal" ? "liked" : current === "liked" ? "blocked" : "normal";
      return { ...prev, [food]: next };
    });
  }

  function makeLocalPlan() {
    const wanted = recipes.filter(d => !d.tags.some(t => states[t] === "blocked") && (cuisine === "不限菜系" || (cuisine === "中餐" ? !d.cuisines || d.cuisines.includes("中餐") : d.cuisines?.includes(cuisine))));
    const scored = wanted.map((d, i) => ({ d, score: d.tags.filter(t => states[t] === "liked").length * 20 + ((i * 7 + people * 3) % 13) }));
    scored.sort((a, b) => b.score - a.score);
    const base = richness === "简单" ? 2 : richness === "丰盛" ? Math.min(8, Math.max(5, people + 2)) : Math.min(6, Math.max(3, people + 1));
    return scored.slice(0, base).map(x => x.d);
  }

  function extractJson(text: string) {
    const cleaned = text.replace(/```json|```/gi, "").trim();
    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]");
    if (start < 0 || end < start) throw new Error("模型没有返回可识别的菜单格式");
    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    if (!Array.isArray(parsed) || !parsed.length) throw new Error("模型返回了空菜单");
    return parsed.slice(0, 10).map((item: Record<string, unknown>) => ({
      name: String(item.name || "未命名菜品"),
      note: String(item.note || "由大模型根据偏好生成"),
      tags: Array.isArray(item.ingredients) ? item.ingredients.slice(0, 5).map(String) : []
    }));
  }

  async function generate() {
    setError("");
    setThinking(true);
    try {
      if (engine === "local") {
        await new Promise(resolve => setTimeout(resolve, 650));
        setPlan(makeLocalPlan());
      } else {
        if (!apiKey.trim()) throw new Error("请先输入 API Key");
        const url = new URL(apiUrl);
        if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") throw new Error("为保护密钥，接口地址必须使用 HTTPS");
        const liked = Object.entries(states).filter(([, v]) => v === "liked").map(([k]) => k);
        const blocked = Object.entries(states).filter(([, v]) => v === "blocked").map(([k]) => k);
        const dishCount = richness === "简单" ? 2 : richness === "丰盛" ? Math.min(8, Math.max(5, people + 2)) : Math.min(6, Math.max(3, people + 1));
        const prompt = `你是一名专业家庭配餐师。请为${people}人设计一顿${richness}${meal}。菜系：${cuisine}；口味：${taste}；偏爱食材：${liked.join("、") || "无特别偏爱"}；绝对不能出现：${blocked.join("、") || "无"}；补充要求：${notes || "无"}。请兼顾荤素、营养、烹饪可行性与份量，共${dishCount}道菜。只返回JSON数组，不要Markdown。每项格式：{"name":"菜名","note":"简短搭配理由和建议份量","ingredients":["主要食材"]}。`;
        const body = protocol === "responses"
          ? { model, input: prompt, store: false, text: { verbosity: "low" } }
          : { model, messages: [{ role: "system", content: "你是专业、谨慎的家庭配餐师。严格遵守忌口并只输出JSON。" }, { role: "user", content: prompt }], temperature: Number(temperature) };
        const response = await fetch(url.toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey.trim()}` },
          body: JSON.stringify(body),
          cache: "no-store",
          referrerPolicy: "no-referrer"
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.error?.message || `接口请求失败（${response.status}）`);
        const outputText = protocol === "responses"
          ? (data.output_text || data.output?.flatMap((x: { content?: { text?: string }[] }) => x.content || []).map((x: { text?: string }) => x.text || "").join(""))
          : data.choices?.[0]?.message?.content;
        if (!outputText) throw new Error("模型没有返回文本结果");
        setPlan(extractJson(outputText));
        if (singleUseKey) setApiKey("");
      }
      setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (e) {
      setError(e instanceof Error ? e.message : "生成失败，请检查设置后重试");
    } finally {
      setThinking(false);
    }
  }

  return (
    <main>
      <header className="hero">
        <div className="nav"><div className="brand"><span>食</span> 今日吃什么</div><div className="nav-note">AI 智能配餐 Agent</div></div>
        <div className="hero-copy">
          <p className="eyebrow">告别选择困难</p>
          <h1>把喜欢的，<em>搭成一桌好菜</em></h1>
          <p>告诉我们谁来吃、想吃多丰盛，再点一点食材偏好。配餐 Agent 会避开忌口，兼顾荤素、口味和份量。</p>
          <a href="#builder" className="primary">开始搭配 <span>→</span></a>
        </div>
        <div className="plate" aria-hidden="true"><div>🥢</div><strong>今晚<br/>好好吃饭</strong><small>用选择，换一餐惊喜</small></div>
      </header>

      <section id="builder" className="builder">
        <div className="section-head"><div><span>01 / 用餐信息</span><h2>先说说这一餐</h2></div><p>信息越具体，搭配越贴心</p></div>
        <div className="form-grid">
          <label>用餐人数<div className="stepper"><button onClick={() => setPeople(Math.max(1, people - 1))}>−</button><b>{people}</b><span>人</span><button onClick={() => setPeople(Math.min(20, people + 1))}>＋</button></div></label>
          <label>餐次<select value={meal} onChange={e => setMeal(e.target.value)}><option>早餐</option><option>午餐</option><option>晚餐</option><option>夜宵</option></select></label>
          <label>丰盛程度<div className="segments">{["简单", "中等", "丰盛"].map(x => <button className={richness === x ? "on" : ""} onClick={() => setRichness(x)} key={x}>{x}</button>)}</div></label>
          <label>口味偏好<select value={taste} onChange={e => setTaste(e.target.value)}><option>家常均衡</option><option>清淡少油</option><option>香辣下饭</option><option>高蛋白</option><option>适合孩子</option></select></label>
          <label className="wide">补充要求（可选）<input value={notes} onChange={e => setNotes(e.target.value)} placeholder="例如：30 分钟内做好、有人不能吃辣、想要一道汤……" /></label>
        </div>
        <div className="cuisine-picker">
          <div><b>想吃哪种风味？</b><span>Agent 会优先生成对应菜系的组合</span></div>
          <div className="cuisine-options">{cuisineOptions.map(item => <button key={item} className={cuisine === item ? "on" : ""} onClick={() => { setCuisine(item); setPlan(null); }}>{item}</button>)}</div>
        </div>

        <div className="engine-panel">
          <div className="engine-title"><div><span>配餐引擎</span><h3>选择谁来为你搭配</h3></div><div className="engine-tabs"><button className={engine === "local" ? "on" : ""} onClick={() => { setEngine("local"); setError(""); }}>本地规则 <small>免费</small></button><button className={engine === "llm" ? "on" : ""} onClick={() => { setEngine("llm"); setError(""); }}>大模型 <small>BYOK</small></button></div></div>
          {engine === "local" ? <div className="local-info"><b>⚡ 即时、免费、隐私友好</b><p>完全在当前页面中计算，不联网调用模型，不消耗任何 Token。</p></div> : <div className="llm-settings">
            <div className="security-note"><b>🔒 密钥保护模式</b><p>API Key 只保存在当前页面内存中，不写入数据库、Cookie 或浏览器存储；请求由你的浏览器直接发送到下方接口，本站服务器不会接触密钥。刷新页面即清除。</p></div>
            <div className="llm-grid">
              <label>模型<input list="model-list" value={model} onChange={e => setModel(e.target.value)} autoComplete="off" /><datalist id="model-list"><option value="gpt-5.6-terra"/><option value="gpt-5.6-luna"/><option value="gpt-5.6-sol"/><option value="gpt-4.1-mini"/></datalist></label>
              <label>API Key<div className="key-input"><input type={showKey ? "text" : "password"} value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-…" autoComplete="off" spellCheck={false}/><button type="button" onClick={() => setShowKey(v => !v)}>{showKey ? "隐藏" : "显示"}</button></div></label>
            </div>
            <details className="advanced"><summary>高级设置 <span>接口地址、协议与生成参数</span></summary><div className="advanced-grid">
              <label>接口协议<select value={protocol} onChange={e => { const p = e.target.value as "responses" | "chat"; setProtocol(p); setApiUrl(p === "responses" ? "https://api.openai.com/v1/responses" : "https://api.openai.com/v1/chat/completions"); }}><option value="responses">OpenAI Responses API</option><option value="chat">OpenAI 兼容 Chat Completions</option></select></label>
              <label>接口 URL<input value={apiUrl} onChange={e => setApiUrl(e.target.value)} spellCheck={false}/></label>
              {protocol === "chat" && <label>Temperature<input type="number" min="0" max="2" step="0.1" value={temperature} onChange={e => setTemperature(e.target.value)}/></label>}
              <label className="check"><input type="checkbox" checked={singleUseKey} onChange={e => setSingleUseKey(e.target.checked)}/><span>单次使用后立即从页面内存清除密钥</span></label>
            </div><p className="endpoint-warning">自定义 URL 对应的服务将直接收到你的 API Key。只使用你信任的 HTTPS 服务，切勿使用来源不明的中转地址。</p></details>
          </div>}
        </div>

        <div className="section-head food-head"><div><span>02 / 食材偏好</span><h2>点出你的态度</h2></div><div className="legend"><i className="liked"/>偏爱 <i className="blocked"/>不吃 <small>每个方块可连续点击</small></div></div>
        <div className="categories">
          {Object.entries(groups).map(([group, foods], index) => <details key={group} open={index < 4}>
            <summary><b>{String(index + 1).padStart(2, "0")}</b><strong>{group}</strong><span>{foods.length} 种⌄</span></summary>
            <div className="chips">{foods.map(food => <button key={food} onClick={() => cycle(food)} className={states[food] || "normal"} aria-label={`${food}，${states[food] === "liked" ? "偏爱" : states[food] === "blocked" ? "不吃" : "普通"}`}>{food}{states[food] === "liked" && <small>♥</small>}{states[food] === "blocked" && <small>×</small>}</button>)}</div>
          </details>)}
        </div>

        {error && <div className="error-box" role="alert">{error}</div>}
        <div className="action-bar"><div><b>{counts.liked || 0}</b> 个偏爱 · <b>{counts.blocked || 0}</b> 个不吃 <small>{engine === "llm" ? `· ${model}` : "· 本地规则"}</small></div><button onClick={generate} disabled={thinking}>{thinking ? (engine === "llm" ? "模型正在搭配…" : "正在认真搭配…") : (engine === "llm" ? "让大模型配一餐" : "请 Agent 帮我配一餐")}<span>✦</span></button></div>
      </section>

      <section id="result" className={`result ${plan ? "show" : ""}`}>
        {plan && <><div className="result-top"><div><span>YOUR MENU · 今日推荐</span><h2>{people} 人份 · {richness}{meal}</h2><p>{cuisine} · {taste}{notes ? ` · 已考虑「${notes}」` : " · 荤素搭配，口味有层次"}</p></div><button onClick={generate}>换一桌 ↻</button></div>
        <div className="menu-grid">{plan.map((dish, i) => <article key={dish.name}><div className="dish-no">{String(i + 1).padStart(2, "0")}</div><div><h3>{dish.name}</h3><p>{dish.note}</p><div>{dish.tags.map(t => <span key={t}>{t}</span>)}</div></div></article>)}</div>
        <div className="agent-note"><b>{engine === "llm" ? `${model} 的搭配思路` : "Agent 的搭配思路"}</b><p>优先使用你偏爱的食材，避开所有标记为“不吃”的选项；按 {people} 人份控制菜量，并用蛋白质、蔬菜和清口菜形成平衡。{engine === "local" && `建议每道荤菜准备约 ${Math.max(250, people * 120)}g 主料。`}</p></div></>}
      </section>

      <footer><div className="brand"><span>食</span> 今日吃什么</div><p>认真选择，也认真吃饭。</p></footer>
    </main>
  );
}
