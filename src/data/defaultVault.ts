import { VaultItem } from '../types';

export const DEFAULT_VAULT_ITEMS: VaultItem[] = [
  {
    id: 'vault-1',
    title: 'حاسبة تفاعلية عصرية بنظام نيوبروتاليزم',
    description: 'تطبيق حاسبة متكامل وسريع مع لوحة أزرار رقمية، ذاكرة حسابية، وتأثيرات صوتية وحركية عند الضغط ودعم لوحة المفاتيح.',
    category: 'interactive-apps',
    tags: ['حاسبة', 'JavaScript', 'تفاعلي', 'رياضيات'],
    isFavorite: true,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
    html: `<!-- حاسبة كود كرافت العصرية -->
<div class="calculator-wrapper">
  <div class="calc-card">
    <div class="calc-header">
      <div class="window-dots">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <span class="calc-title">حاسبة كود كرافت</span>
    </div>
    
    <div class="screen">
      <div class="equation" id="equation">0</div>
      <div class="result" id="result">0</div>
    </div>
    
    <div class="keypad">
      <button class="key action" onclick="clearAll()">AC</button>
      <button class="key action" onclick="deleteLast()">DEL</button>
      <button class="key action" onclick="appendOperator('%')">%</button>
      <button class="key operator" onclick="appendOperator('/')">÷</button>
      
      <button class="key" onclick="appendNumber('7')">7</button>
      <button class="key" onclick="appendNumber('8')">8</button>
      <button class="key" onclick="appendNumber('9')">9</button>
      <button class="key operator" onclick="appendOperator('*')">×</button>
      
      <button class="key" onclick="appendNumber('4')">4</button>
      <button class="key" onclick="appendNumber('5')">5</button>
      <button class="key" onclick="appendNumber('6')">6</button>
      <button class="key operator" onclick="appendOperator('-')">-</button>
      
      <button class="key" onclick="appendNumber('1')">1</button>
      <button class="key" onclick="appendNumber('2')">2</button>
      <button class="key" onclick="appendNumber('3')">3</button>
      <button class="key operator" onclick="appendOperator('+')">+</button>
      
      <button class="key" onclick="appendNumber('0')">0</button>
      <button class="key" onclick="appendNumber('.')">.</button>
      <button class="key equals" onclick="calculateResult()">=</button>
    </div>
  </div>
</div>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, sans-serif;
}

body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  padding: 12px;
}

.calc-card {
  width: 100%;
  max-width: 380px;
  background: #111827;
  border-radius: 20px;
  padding: 18px 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.calc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.window-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dot.red { background: #ef4444; }
.dot.yellow { background: #f59e0b; }
.dot.green { background: #10b981; }

.calc-title {
  color: #9ca3af;
  font-size: 13px;
  font-weight: 500;
}

.screen {
  background: #030712;
  border-radius: 16px;
  padding: 16px 20px;
  text-align: right;
  margin-bottom: 20px;
  border: 1px solid #1f2937;
  direction: ltr;
}

.equation {
  color: #6b7280;
  font-size: 14px;
  min-height: 20px;
  word-break: break-all;
}

.result {
  color: #f9fafb;
  font-size: 32px;
  font-weight: 700;
  overflow-x: auto;
  white-space: nowrap;
}

.keypad {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.key {
  border: none;
  background: #1f2937;
  color: #f3f4f6;
  font-size: 18px;
  font-weight: 600;
  padding: 16px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.key:hover {
  background: #374151;
  transform: translateY(-2px);
}

.key:active {
  transform: translateY(1px);
}

.key.action {
  background: #374151;
  color: #38bdf8;
}
.key.action:hover {
  background: #4b5563;
}

.key.operator {
  background: #4338ca;
  color: #e0e7ff;
}
.key.operator:hover {
  background: #4f46e5;
}

.key.equals {
  grid-column: span 2;
  background: #2563eb;
  color: white;
}
.key.equals:hover {
  background: #3b82f6;
}`,
    js: `let currentInput = '';
let equationText = '';

function updateDisplay() {
  document.getElementById('result').innerText = currentInput || '0';
  document.getElementById('equation').innerText = equationText || ' ';
}

function appendNumber(num) {
  if (num === '.' && currentInput.includes('.')) return;
  if (currentInput === '0' && num !== '.') {
    currentInput = num;
  } else {
    currentInput += num;
  }
  updateDisplay();
}

function appendOperator(op) {
  if (!currentInput && !equationText) return;
  if (currentInput) {
    equationText += (equationText ? ' ' : '') + currentInput + ' ' + op;
    currentInput = '';
  } else if (equationText) {
    // replace last operator
    equationText = equationText.slice(0, -1) + op;
  }
  updateDisplay();
}

function calculateResult() {
  if (!currentInput && !equationText) return;
  let fullExpr = equationText + (currentInput ? ' ' + currentInput : '');
  try {
    // Safe evaluation of basic math expressions
    let clean = fullExpr.replace(/×/g, '*').replace(/÷/g, '/');
    let ans = Function('"use strict";return (' + clean + ')')();
    console.log('حساب المعادلة: ' + clean + ' = ' + ans);
    equationText = fullExpr + ' =';
    currentInput = String(Number(ans.toFixed(6)));
    updateDisplay();
  } catch (err) {
    document.getElementById('result').innerText = 'خطأ';
    console.error('خطأ في العملية الحسابية:', err.message);
  }
}

function clearAll() {
  currentInput = '';
  equationText = '';
  updateDisplay();
  console.log('تم تصفير الحاسبة');
}

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

// Support keyboard typing
window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  if (e.key === '.') appendNumber('.');
  if (['+', '-', '*', '/'].includes(e.key)) appendOperator(e.key);
  if (e.key === 'Enter' || e.key === '=') calculateResult();
  if (e.key === 'Backspace') deleteLast();
  if (e.key === 'Escape') clearAll();
});`
  },
  {
    id: 'vault-2',
    title: 'تطبيق إدارة المهام التفاعلي مع الحفظ التلقائي',
    description: 'تطبيق مهام عصري (To-Do List) مكتمل الخصائص يدعم إضافة المهام، وتحديد المكتملة، وحذفها، وتصفية المهام (الكل / قيد التنفيذ / المكتملة)، مع تخزين البيانات في المتصفح.',
    category: 'interactive-apps',
    tags: ['مهام', 'تطبيق ويب', 'LocalStorage', 'DOM'],
    isFavorite: true,
    createdAt: '2026-03-02T11:00:00.000Z',
    updatedAt: '2026-03-02T11:00:00.000Z',
    html: `<div class="app-container" dir="rtl">
  <header class="app-header">
    <div class="badge">إنتاجية يومية</div>
    <h1>مدير المهام الذكي</h1>
    <p>نظم مهامك اليومية بسهولة واحفظ تقدمك تلقائياً</p>
  </header>

  <form id="taskForm" class="task-form">
    <input type="text" id="taskInput" placeholder="أدخل مهمة جديدة..." autocomplete="off" required />
    <button type="submit" id="addBtn">
      <span>+ إضافة مهمة</span>
    </button>
  </form>

  <div class="stats-bar">
    <div class="stat-item">
      <span>إجمالي المهام:</span>
      <strong id="totalCount">0</strong>
    </div>
    <div class="stat-item">
      <span>المكتملة:</span>
      <strong id="completedCount" class="text-green">0</strong>
    </div>
  </div>

  <div class="filter-tabs">
    <button class="filter-tab active" data-filter="all">الكل</button>
    <button class="filter-tab" data-filter="active">قيد الإنجاز</button>
    <button class="filter-tab" data-filter="completed">المكتملة</button>
  </div>

  <ul id="taskList" class="task-list"></ul>
  
  <div id="emptyState" class="empty-state">
    <div class="empty-icon">📝</div>
    <p>لا توجد مهام حالياً. ابدأ بإضافة أول مهمة!</p>
  </div>
</div>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, sans-serif;
}

body {
  background: #090d16;
  color: #f1f5f9;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 16px;
}

.app-container {
  width: 100%;
  max-width: 520px;
  background: #0f172a;
  border-radius: 20px;
  padding: 28px;
  border: 1px solid #1e293b;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.app-header {
  text-align: center;
  margin-bottom: 24px;
}

.badge {
  display: inline-block;
  background: #1e1b4b;
  color: #818cf8;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 12px;
  border: 1px solid #312e81;
}

.app-header h1 {
  font-size: 24px;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 6px;
}

.app-header p {
  font-size: 13px;
  color: #94a3b8;
}

.task-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.task-form input {
  flex: 1;
  background: #1e293b;
  border: 1px solid #334155;
  color: #f8fafc;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.task-form input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.task-form button {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.task-form button:hover {
  background: #4338ca;
}

.stats-bar {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background: #131d33;
  border-radius: 12px;
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 16px;
}

.text-green {
  color: #34d399;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  background: #1e293b;
  padding: 4px;
  border-radius: 10px;
}

.filter-tab {
  flex: 1;
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 8px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab.active {
  background: #0f172a;
  color: #f8fafc;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.task-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #182234;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #1e293b;
  transition: all 0.2s;
}

.task-item:hover {
  border-color: #334155;
  transform: translateX(-2px);
}

.task-item.completed {
  opacity: 0.6;
}

.task-item.completed .task-text {
  text-decoration: line-through;
  color: #64748b;
}

.task-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.task-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #6366f1;
}

.task-text {
  font-size: 14px;
  color: #f1f5f9;
}

.delete-btn {
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #64748b;
  font-size: 14px;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 8px;
}`,
    js: `let tasks = [
  { id: 1, text: 'دراسة ومراجعة مفاهيم JavaScript الأساسية', completed: true },
  { id: 2, text: 'بناء مكون واجهة مستخدم تفاعلي', completed: false },
  { id: 3, text: 'حفظ الشفرات البرمجية المميزة في المخزن', completed: false }
];

let currentFilter = 'all';

function renderTasks() {
  const taskList = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  
  taskList.innerHTML = '';
  
  const filtered = tasks.filter(t => {
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true;
  });

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.innerHTML = \`
      <div class="task-left">
        <input type="checkbox" class="task-checkbox" \${task.completed ? 'checked' : ''} onchange="toggleTask(\${task.id})">
        <span class="task-text">\${escapeHtml(task.text)}</span>
      </div>
      <button class="delete-btn" onclick="deleteTask(\${task.id})" title="حذف المهمة">✕</button>
    \`;
    taskList.appendChild(li);
  });

  document.getElementById('totalCount').innerText = tasks.length;
  document.getElementById('completedCount').innerText = tasks.filter(t => t.completed).length;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  console.log('تم تحديث حالة المهمة #' + id);
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  console.log('تم حذف المهمة #' + id);
  renderTasks();
}

document.getElementById('taskForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (!text) return;
  
  tasks.push({
    id: Date.now(),
    text: text,
    completed: false
  });
  
  console.log('تمت إضافة مهمة جديدة: ' + text);
  input.value = '';
  renderTasks();
});

document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.getAttribute('data-filter');
    renderTasks();
  });
});

renderTasks();`
  },
  {
    id: 'vault-3',
    title: 'بطاقة تسوق تفاعلية ثلاثية الأبعاد (Glassmorphism Card)',
    description: 'بطاقة عرض منتج فاخرة بتأثير الزجاج الشفاف (Glassmorphism) مع تفاعل إمالة 3D ومحدد ألوان تفاعلي وزر شراء نابض بالحياة.',
    category: 'ui-components',
    tags: ['واجهات UI', 'Glassmorphism', 'CSS 3D', 'تأثيرات'],
    isFavorite: true,
    createdAt: '2026-03-03T12:00:00.000Z',
    updatedAt: '2026-03-03T12:00:00.000Z',
    html: `<div class="card-scene">
  <div class="product-card" id="card">
    <div class="card-glow"></div>
    <div class="card-badge">إصدار حصري 2026</div>
    
    <div class="image-box">
      <div class="glow-sphere"></div>
      <div class="product-icon">🎧</div>
    </div>
    
    <div class="card-body">
      <h3 class="product-title">سماعات Sonic Pro اللاسلكية</h3>
      <p class="product-desc">صوت نقي بتقنية إلغاء الضوضاء الفعالة وبطارية تدوم حتى 40 ساعة متواصلة.</p>
      
      <div class="color-picker">
        <span>اللون المختار:</span>
        <div class="colors">
          <button class="color-dot active" style="--c: #6366f1" onclick="selectColor(this, 'أرجواني ملكي')"></button>
          <button class="color-dot" style="--c: #06b6d4" onclick="selectColor(this, 'أزرق سيان')"></button>
          <button class="color-dot" style="--c: #10b981" onclick="selectColor(this, 'أخضر زمردي')"></button>
          <button class="color-dot" style="--c: #f43f5e" onclick="selectColor(this, 'وردي قرمزي')"></button>
        </div>
      </div>

      <div class="card-footer">
        <div class="price-wrap">
          <span class="price-label">السعر الحالي</span>
          <span class="price-value">$249</span>
        </div>
        <button class="buy-btn" onclick="orderNow()">
          <span>أضف للسلة 🛒</span>
        </button>
      </div>
    </div>
  </div>
</div>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, sans-serif;
}

body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 50% 20%, #1e1b4b, #030712 80%);
  padding: 20px;
  direction: rtl;
}

.card-scene {
  perspective: 1000px;
}

.product-card {
  width: 330px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.6);
}

.card-badge {
  display: inline-block;
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #a5b4fc;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 16px;
}

.image-box {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.glow-sphere {
  position: absolute;
  width: 120px;
  height: 120px;
  background: #6366f1;
  filter: blur(40px);
  opacity: 0.4;
  border-radius: 50%;
}

.product-icon {
  font-size: 72px;
  z-index: 2;
  filter: drop-shadow(0 15px 25px rgba(0,0,0,0.5));
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.product-title {
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.product-desc {
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 18px;
}

.color-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 12px;
  color: #cbd5e1;
}

.colors {
  display: flex;
  gap: 8px;
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--c);
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-dot.active {
  border-color: white;
  transform: scale(1.2);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.price-label {
  display: block;
  font-size: 11px;
  color: #64748b;
}

.price-value {
  font-size: 22px;
  font-weight: 800;
  color: #38bdf8;
}

.buy-btn {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

.buy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
}`,
    js: `const card = document.getElementById('card');

// Interactive 3D mouse tilt
document.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  
  if (Math.abs(x) < 300 && Math.abs(y) < 300) {
    const rotateX = -(y / 20);
    const rotateY = (x / 20);
    card.style.transform = \`rotateX(\${rotateX}deg) rotateY(\${rotateY}deg)\`;
  }
});

card.addEventListener('mouseleave', () => {
  card.style.transform = 'rotateX(0deg) rotateY(0deg)';
});

function selectColor(btn, name) {
  document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
  btn.classList.add('active');
  console.log('تم اختيار اللون: ' + name);
}

function orderNow() {
  console.log('تمت إضافة سماعات Sonic Pro إلى سلة المشتريات بنجاح!');
  alert('تمت إضافة المنتج إلى سلة المشتريات!');
}`
  },
  {
    id: 'vault-4',
    title: 'ساعة رقمية حية مع تاريخ هجري وميلادي ومؤقت إيقاف',
    description: 'ساعة تفاعلية عالية الدقة تعرض الوقت بنظام 12/24 ساعة، مع عداد إيقاف (Stopwatch) دقيق بالأجزاء من الثانية وزر للتحكم.',
    category: 'utilities',
    tags: ['ساعة', 'مؤقت', 'تاريخ', 'Stopwatch', 'أداة'],
    isFavorite: false,
    createdAt: '2026-03-04T09:30:00.000Z',
    updatedAt: '2026-03-04T09:30:00.000Z',
    html: `<div class="clock-app" dir="rtl">
  <div class="tabs">
    <button class="tab-btn active" onclick="switchMode('clock')">🕒 الساعة الرقمية</button>
    <button class="tab-btn" onclick="switchMode('timer')">⏱️ ساعة إيقاف</button>
  </div>

  <div id="clockSection" class="section">
    <div class="time-display" id="timeDisplay">00:00:00</div>
    <div class="ampm" id="ampmDisplay">--</div>
    <div class="date-display" id="dateDisplay">جاري التحميل...</div>
  </div>

  <div id="timerSection" class="section" style="display: none;">
    <div class="stopwatch-display" id="stopwatchDisplay">00:00:00.00</div>
    <div class="timer-controls">
      <button class="t-btn start" id="startBtn" onclick="toggleTimer()">بدء</button>
      <button class="t-btn reset" onclick="resetTimer()">إعادة ضبط</button>
    </div>
  </div>
</div>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, sans-serif;
}

body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #020617;
  color: #f8fafc;
  padding: 20px;
}

.clock-app {
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 24px;
  padding: 32px;
  width: 100%;
  max-width: 440px;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
}

.tabs {
  display: flex;
  background: #1e293b;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 28px;
}

.tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #0f172a;
  color: #38bdf8;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.time-display {
  font-size: 48px;
  font-weight: 800;
  color: #38bdf8;
  letter-spacing: 2px;
  font-family: monospace;
  margin-bottom: 6px;
  text-shadow: 0 0 20px rgba(56, 189, 248, 0.3);
}

.ampm {
  font-size: 16px;
  color: #818cf8;
  font-weight: 700;
  margin-bottom: 12px;
}

.date-display {
  font-size: 14px;
  color: #94a3b8;
}

.stopwatch-display {
  font-size: 40px;
  font-weight: 800;
  font-family: monospace;
  color: #34d399;
  margin-bottom: 24px;
  text-shadow: 0 0 20px rgba(52, 211, 153, 0.3);
}

.timer-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.t-btn {
  padding: 10px 24px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.t-btn.start {
  background: #10b981;
  color: white;
}
.t-btn.start:hover {
  background: #059669;
}

.t-btn.reset {
  background: #334155;
  color: #e2e8f0;
}
.t-btn.reset:hover {
  background: #475569;
}`,
    js: `// Clock logic
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const ampm = hours >= 12 ? 'مساءً' : 'صباحاً';
  hours = hours % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  document.getElementById('timeDisplay').innerText = \`\${String(hours).padStart(2, '0')}:\${minutes}:\${seconds}\`;
  document.getElementById('ampmDisplay').innerText = ampm;
  
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('dateDisplay').innerText = now.toLocaleDateString('ar-EG', options);
}

setInterval(updateClock, 1000);
updateClock();

// Stopwatch logic
let timerInterval = null;
let elapsedTime = 0;
let isRunning = false;

function toggleTimer() {
  const btn = document.getElementById('startBtn');
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    btn.innerText = 'استئناف';
    btn.style.background = '#10b981';
    console.log('تم إيقاف المؤقت مؤقتاً عند ' + (elapsedTime / 1000) + ' ث');
  } else {
    const startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      renderTimer();
    }, 10);
    isRunning = true;
    btn.innerText = 'إيقاف';
    btn.style.background = '#ef4444';
    console.log('تم تشغيل ساعة الإيقاف');
  }
}

function renderTimer() {
  const ms = Math.floor((elapsedTime % 1000) / 10);
  const totalSec = Math.floor(elapsedTime / 1000);
  const sec = totalSec % 60;
  const min = Math.floor(totalSec / 60);
  
  document.getElementById('stopwatchDisplay').innerText = 
    \`\${String(min).padStart(2, '0')}:\${String(sec).padStart(2, '0')}.\${String(ms).padStart(2, '0')}\`;
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  elapsedTime = 0;
  renderTimer();
  const btn = document.getElementById('startBtn');
  btn.innerText = 'بدء';
  btn.style.background = '#10b981';
  console.log('تمت إعادة ضبط ساعة الإيقاف');
}

function switchMode(mode) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  if (mode === 'clock') {
    document.getElementById('clockSection').style.display = 'block';
    document.getElementById('timerSection').style.display = 'none';
    event.target.classList.add('active');
  } else {
    document.getElementById('clockSection').style.display = 'none';
    document.getElementById('timerSection').style.display = 'block';
    event.target.classList.add('active');
  }
}`
  },
  {
    id: 'vault-5',
    title: 'شريط تنقل احترافي مع قائمة جانبية للموبايل وسِمة داكنة',
    description: 'شريط تنقل متجاوب تماماً (Responsive Navbar) مع قائمة منسدلة، وزر همبرغر متفاعل مع الشاشات الصغيرة، وقائمة جانبية منزلقة.',
    category: 'ui-components',
    tags: ['شريط تنقل', 'Navbar', 'متجاوب', 'موبايل'],
    isFavorite: false,
    createdAt: '2026-03-05T14:00:00.000Z',
    updatedAt: '2026-03-05T14:00:00.000Z',
    html: `<nav class="navbar" dir="rtl">
  <div class="nav-container">
    <a href="#" class="brand-logo">
      <span class="logo-box">⚡</span>
      <span class="logo-text">كود كرافت</span>
    </a>

    <div class="nav-links">
      <a href="#" class="nav-link active">الرئيسية</a>
      <a href="#" class="nav-link">المشاريع</a>
      <a href="#" class="nav-link">الدروس</a>
      <a href="#" class="nav-link">المخزن</a>
    </div>

    <div class="nav-actions">
      <button class="btn-primary">ابدأ التدريب</button>
      <button class="hamburger-btn" id="menuToggle" onclick="toggleMobileMenu()">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </div>

  <!-- Mobile Drawer -->
  <div class="mobile-drawer" id="mobileDrawer">
    <div class="drawer-header">
      <span class="logo-text">القائمة</span>
      <button class="close-btn" onclick="toggleMobileMenu()">✕</button>
    </div>
    <div class="drawer-links">
      <a href="#" onclick="toggleMobileMenu()">الرئيسية</a>
      <a href="#" onclick="toggleMobileMenu()">المشاريع</a>
      <a href="#" onclick="toggleMobileMenu()">الدروس التدريبية</a>
      <a href="#" onclick="toggleMobileMenu()">مخزن الأكواد</a>
    </div>
    <button class="btn-primary full-width">تسجيل الدخول</button>
  </div>
</nav>

<div class="page-content" dir="rtl">
  <div class="hero-box">
    <h2>مرحباً بك في واجهة الويب المتجاوبة</h2>
    <p>قم بتغيير حجم نافذة المعاينة لاختبار التحول التلقائي بين عرض سطح المكتب وعرض الأجهزة الذكية.</p>
  </div>
</div>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, sans-serif;
}

body {
  background: #090d16;
  color: #f8fafc;
  min-height: 100vh;
}

.navbar {
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: white;
  font-weight: 800;
  font-size: 18px;
}

.logo-box {
  width: 32px;
  height: 32px;
  background: #4f46e5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  text-decoration: none;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover, .nav-link.active {
  color: #38bdf8;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-primary {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #4338ca;
}

.hamburger-btn {
  display: none;
  background: transparent;
  border: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 6px;
}

.hamburger-btn span {
  width: 22px;
  height: 2px;
  background: #f8fafc;
  border-radius: 2px;
}

.mobile-drawer {
  display: none;
  position: fixed;
  top: 0;
  right: -280px;
  width: 260px;
  height: 100vh;
  background: #0f172a;
  border-left: 1px solid #1e293b;
  padding: 24px;
  flex-direction: column;
  transition: right 0.3s ease;
  z-index: 100;
}

.mobile-drawer.open {
  right: 0;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 18px;
  cursor: pointer;
}

.drawer-links {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
}

.drawer-links a {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 15px;
}

.full-width {
  width: 100%;
}

.page-content {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.hero-box {
  background: #1e293b;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
}

.hero-box h2 {
  margin-bottom: 12px;
  font-size: 22px;
}

.hero-box p {
  color: #94a3b8;
  font-size: 14px;
}

@media (max-width: 768px) {
  .nav-links, .btn-primary:not(.full-width) {
    display: none;
  }
  .hamburger-btn {
    display: flex;
  }
  .mobile-drawer {
    display: flex;
  }
}`,
    js: `let isDrawerOpen = false;

function toggleMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  isDrawerOpen = !isDrawerOpen;
  if (isDrawerOpen) {
    drawer.classList.add('open');
    console.log('تم فتح القائمة الجانبية للأجهزة المحمولة');
  } else {
    drawer.classList.remove('open');
    console.log('تم إغلاق القائمة الجانبية');
  }
}`
  }
];
