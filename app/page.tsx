"use client";

import { useMemo, useState } from "react";

type FoodState = "normal" | "liked" | "blocked";
type Dish = { name: string; note: string; tags: string[] };

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
  { name: "凉拌菠菜", note: "清口解腻，平衡整桌菜", tags: ["菠菜"] }
];

export default function Home() {
  const [states, setStates] = useState<Record<string, FoodState>>({});
  const [people, setPeople] = useState(2);
  const [richness, setRichness] = useState("中等");
  const [meal, setMeal] = useState("晚餐");
  const [taste, setTaste] = useState("家常均衡");
  const [notes, setNotes] = useState("");
  const [plan, setPlan] = useState<Dish[] | null>(null);
  const [thinking, setThinking] = useState(false);

  const counts = useMemo(() => Object.values(states).reduce((a, s) => ({ ...a, [s]: (a[s] || 0) + 1 }), {} as Record<string, number>), [states]);

  function cycle(food: string) {
    setPlan(null);
    setStates(prev => {
      const current = prev[food] || "normal";
      const next: FoodState = current === "normal" ? "liked" : current === "liked" ? "blocked" : "normal";
      return { ...prev, [food]: next };
    });
  }

  function generate() {
    setThinking(true);
    setTimeout(() => {
      const wanted = recipes.filter(d => !d.tags.some(t => states[t] === "blocked"));
      const scored = wanted.map((d, i) => ({ d, score: d.tags.filter(t => states[t] === "liked").length * 20 + ((i * 7 + people * 3) % 13) }));
      scored.sort((a, b) => b.score - a.score);
      const base = richness === "简单" ? 2 : richness === "丰盛" ? Math.min(8, Math.max(5, people + 2)) : Math.min(6, Math.max(3, people + 1));
      setPlan(scored.slice(0, base).map(x => x.d));
      setThinking(false);
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth" });
    }, 850);
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

        <div className="section-head food-head"><div><span>02 / 食材偏好</span><h2>点出你的态度</h2></div><div className="legend"><i className="liked"/>偏爱 <i className="blocked"/>不吃 <small>每个方块可连续点击</small></div></div>
        <div className="categories">
          {Object.entries(groups).map(([group, foods], index) => <details key={group} open={index < 4}>
            <summary><b>{String(index + 1).padStart(2, "0")}</b><strong>{group}</strong><span>{foods.length} 种⌄</span></summary>
            <div className="chips">{foods.map(food => <button key={food} onClick={() => cycle(food)} className={states[food] || "normal"} aria-label={`${food}，${states[food] === "liked" ? "偏爱" : states[food] === "blocked" ? "不吃" : "普通"}`}>{food}{states[food] === "liked" && <small>♥</small>}{states[food] === "blocked" && <small>×</small>}</button>)}</div>
          </details>)}
        </div>

        <div className="action-bar"><div><b>{counts.liked || 0}</b> 个偏爱 · <b>{counts.blocked || 0}</b> 个不吃</div><button onClick={generate} disabled={thinking}>{thinking ? "正在认真搭配…" : "请 Agent 帮我配一餐"}<span>✦</span></button></div>
      </section>

      <section id="result" className={`result ${plan ? "show" : ""}`}>
        {plan && <><div className="result-top"><div><span>YOUR MENU · 今日推荐</span><h2>{people} 人份 · {richness}{meal}</h2><p>{taste}{notes ? ` · 已考虑「${notes}」` : " · 荤素搭配，口味有层次"}</p></div><button onClick={generate}>换一桌 ↻</button></div>
        <div className="menu-grid">{plan.map((dish, i) => <article key={dish.name}><div className="dish-no">{String(i + 1).padStart(2, "0")}</div><div><h3>{dish.name}</h3><p>{dish.note}</p><div>{dish.tags.map(t => <span key={t}>{t}</span>)}</div></div></article>)}</div>
        <div className="agent-note"><b>Agent 的搭配思路</b><p>优先使用你偏爱的食材，避开所有标记为“不吃”的选项；按 {people} 人份控制菜量，并用蛋白质、蔬菜和清口菜形成平衡。建议每道荤菜准备约 {Math.max(250, people * 120)}g 主料。</p></div></>}
      </section>

      <footer><div className="brand"><span>食</span> 今日吃什么</div><p>认真选择，也认真吃饭。</p></footer>
    </main>
  );
}
