import { PracticeChallenge } from '../types';

export const PRACTICE_CHALLENGES: PracticeChallenge[] = [
  {
    id: 'ch-1',
    title: 'تحدي 1: إنشاء زر تفاعلي مع عداد نقرات (Counter Button)',
    level: 'مبتدئ',
    category: 'JavaScript تفاعلي',
    instructions: 'قم بإنشاء زر برمجياً يزيد قيمة العداد بمقدار 1 عند كل نقرة، مع تغيير لون الزر إذا تجاوز العداد 5 نقرات.',
    requirements: [
      'يحتوي الكود على عنصر يحمل المُعرّف id="counter-value" لعرض الرقم.',
      'يحتوي الكود على زر يحمل المُعرّف id="increment-btn".',
      'عند النقر على الزر، يزيد الرقم بمقدار 1.'
    ],
    hints: [
      'استخدم document.getElementById("increment-btn") لإضافة مستمع الحدث click.',
      'احفظ قيمة العداد في متغير let count = 0 ثم حدث textContent للعنصر.'
    ],
    starterHtml: `<div class="exercise-box" dir="rtl">
  <h2>تمرين عداد النقرات</h2>
  <div class="count-display">
    العدد: <span id="counter-value">0</span>
  </div>
  <button id="increment-btn" class="btn">اضغط لزيادة العداد +</button>
</div>`,
    starterCss: `body {
  background: #0f172a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: system-ui, sans-serif;
}
.exercise-box {
  background: #1e293b;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
}
.count-display {
  font-size: 28px;
  font-weight: bold;
  margin: 20px 0;
  color: #38bdf8;
}
.btn {
  background: #6366f1;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}`,
    starterJs: `// اكتب الكود البرمجي هنا لجعل الزر يزيد العداد
let count = 0;
const counterSpan = document.getElementById('counter-value');
const btn = document.getElementById('increment-btn');

btn.addEventListener('click', () => {
  count++;
  counterSpan.textContent = count;
  console.log('القيمة الحالية:', count);
});`,
    testCode: `(function() {
  const counter = document.getElementById('counter-value');
  const btn = document.getElementById('increment-btn');
  if (!counter) return { pass: false, msg: 'لم يتم العثور على عنصر يحمل id="counter-value"' };
  if (!btn) return { pass: false, msg: 'لم يتم العثور على زر يحمل id="increment-btn"' };
  
  const before = parseInt(counter.textContent || '0', 10);
  btn.click();
  const after = parseInt(counter.textContent || '0', 10);
  
  if (after === before + 1) {
    return { pass: true, msg: 'أحسنت! الزر يزيد العداد بنجاح ودقة.' };
  } else {
    return { pass: false, msg: 'عند النقر على الزر لم يزدد العداد بالشكل المطلوب.' };
  }
})()`
  },
  {
    id: 'ch-2',
    title: 'تحدي 2: بطاقة تبديل السمة (Dark / Light Mode Toggle)',
    level: 'متوسط',
    category: 'واجهات مستخدم وتصميم',
    instructions: 'قم ببرمجة زر يقوم بالتبديل بين السمة الفاتحة والسمة الداكنة لبطاقة العرض عبر إضافة أو إزالة فئة CSS (class="dark-theme").',
    requirements: [
      'عنصر بطاقة يحمل المعرف id="theme-card".',
      'زر تبديل يحمل المعرف id="toggle-theme-btn".',
      'عند النقر، يتم تبديل فئة "dark-theme" على البطاقة أو الجسم.'
    ],
    hints: [
      'استخدم element.classList.toggle("dark-theme") لتحقيق التبديل بذكاء وسطر واحد.',
      'حدث نص الزر ليعكس السمة الحالية (مثلاً: "الوضع الفاتح ☀️" أو "الوضع الداكن 🌙").'
    ],
    starterHtml: `<div class="container" dir="rtl">
  <div id="theme-card" class="card">
    <h3 id="card-title">بطاقة تفاعلية متجاوبة</h3>
    <p>هذه البطاقة يمكن تبديل مظهرها بين الوضعين الداكن والفاتح.</p>
    <button id="toggle-theme-btn" class="toggle-btn">تبديل السمة 🌓</button>
  </div>
</div>`,
    starterCss: `body {
  background: #0b0f19;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: system-ui, sans-serif;
}
.card {
  background: #ffffff;
  color: #1e293b;
  padding: 30px;
  border-radius: 16px;
  max-width: 360px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}
.card.dark-theme {
  background: #1e293b;
  color: #f8fafc;
}
.toggle-btn {
  margin-top: 20px;
  background: #4f46e5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}`,
    starterJs: `const card = document.getElementById('theme-card');
const toggleBtn = document.getElementById('toggle-theme-btn');

toggleBtn.addEventListener('click', () => {
  card.classList.toggle('dark-theme');
  console.log('تم تبديل السمة! الفئات الحالية:', card.className);
});`,
    testCode: `(function() {
  const card = document.getElementById('theme-card');
  const btn = document.getElementById('toggle-theme-btn');
  if (!card) return { pass: false, msg: 'عنصر id="theme-card" غير موجود' };
  if (!btn) return { pass: false, msg: 'زر id="toggle-theme-btn" غير موجود' };
  
  const hasBefore = card.classList.contains('dark-theme');
  btn.click();
  const hasAfter = card.classList.contains('dark-theme');
  
  if (hasBefore !== hasAfter) {
    return { pass: true, msg: 'رائع جداً! تم تبديل السمة وفئة dark-theme بنجاح.' };
  } else {
    return { pass: false, msg: 'لم تتغير فئة dark-theme عند النقر على الزر.' };
  }
})()`
  },
  {
    id: 'ch-3',
    title: 'تحدي 3: محول العملات والوحدات اللحظي (Live Converter)',
    level: 'متوسط',
    category: 'خوارزميات وتطبيقات عملية',
    instructions: 'أنشئ حقل إدخال رقمي يحول القيمة المدخلة بالدولار الأمريكي إلى الريال السعودي (بمعدل 1 USD = 3.75 SAR) بمجرد الكتابة لحظياً.',
    requirements: [
      'حقل إدخال يحمل id="usd-input".',
      'عنصر لعرض النتيجة يحمل id="sar-result".',
      'تحديث القيمة لحظياً مع كل تغيير في حقل الإدخال.'
    ],
    hints: [
      'استخدم حدث "input" على حقل الإدخال لتلقي التحديثات اللحظية أثناء الكتابة.',
      'تأكد من فحص القيم الفارغة لتجنب ظهور NaN.'
    ],
    starterHtml: `<div class="converter-box" dir="rtl">
  <h2>محول الدولار إلى الريال السعودي</h2>
  <div class="field">
    <label>المبلغ بالدولار ($):</label>
    <input type="number" id="usd-input" placeholder="أدخل المبلغ..." value="10" />
  </div>
  <div class="result-box">
    <span>القيمة بالريال:</span>
    <strong id="sar-result">37.50</strong> ريال سعودي
  </div>
</div>`,
    starterCss: `body {
  background: #030712;
  color: #f9fafb;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: system-ui, sans-serif;
}
.converter-box {
  background: #111827;
  padding: 30px;
  border-radius: 20px;
  width: 360px;
  border: 1px solid #1f2937;
}
.field {
  margin: 20px 0;
}
.field label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #9ca3af;
}
.field input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background: #1f2937;
  border: 1px solid #374151;
  color: white;
  font-size: 16px;
  box-sizing: border-box;
}
.result-box {
  background: #1e1b4b;
  padding: 16px;
  border-radius: 12px;
  color: #a5b4fc;
}
#sar-result {
  color: #38bdf8;
  font-size: 20px;
  margin: 0 4px;
}`,
    starterJs: `const usdInput = document.getElementById('usd-input');
const sarResult = document.getElementById('sar-result');
const RATE = 3.75;

usdInput.addEventListener('input', () => {
  const usd = parseFloat(usdInput.value) || 0;
  const sar = (usd * RATE).toFixed(2);
  sarResult.textContent = sar;
  console.log(\`تحويل: \${usd} $ = \${sar} SAR\`);
});`,
    testCode: `(function() {
  const input = document.getElementById('usd-input');
  const result = document.getElementById('sar-result');
  if (!input) return { pass: false, msg: 'حقل id="usd-input" غير موجود' };
  if (!result) return { pass: false, msg: 'عنصر id="sar-result" غير موجود' };
  
  input.value = '100';
  input.dispatchEvent(new Event('input'));
  
  const val = parseFloat(result.textContent);
  if (Math.abs(val - 375) < 0.1) {
    return { pass: true, msg: 'ممتاز! المحول يحسب القيم الرياضية بدقة متناهية.' };
  } else {
    return { pass: false, msg: 'القيمة المحسوبة غير متطابقة مع معدل التحويل (100 دولار = 375 ريال).' };
  }
})()`
  }
];
