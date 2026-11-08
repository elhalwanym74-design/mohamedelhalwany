import React, { useState } from 'react';
import { 
  Archive, 
  Search, 
  Star, 
  Code2, 
  Play, 
  Copy, 
  Check, 
  Trash2, 
  Edit3, 
  Plus, 
  Download, 
  Upload, 
  Tag, 
  Clock, 
  CheckCircle2, 
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { VaultItem, Category } from '../types';

interface CodeVaultProps {
  vaultItems: VaultItem[];
  onLoadItemToEditor: (item: VaultItem) => void;
  onPreviewItem: (item: VaultItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onSaveNewItem: (item: Omit<VaultItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateItem: (item: VaultItem) => void;
  onExportVault: () => void;
  onImportVault: (file: File) => void;
}

const CATEGORY_MAP: Record<Category, { label: string; color: string }> = {
  'interactive-apps': { label: 'تطبيقات تفاعلية', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' },
  'ui-components': { label: 'واجهات مستخدم UI', color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800' },
  'css-effects': { label: 'تأثيرات وتنسيقات CSS', color: 'text-pink-400 bg-pink-950/60 border-pink-800' },
  'utilities': { label: 'أدوات ومساعدات', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800' },
  'full-templates': { label: 'قوالب ويب كاملة', color: 'text-amber-400 bg-amber-950/60 border-amber-800' }
};

export const CodeVault: React.FC<CodeVaultProps> = ({
  vaultItems,
  onLoadItemToEditor,
  onPreviewItem,
  onDeleteItem,
  onToggleFavorite,
  onSaveNewItem,
  onUpdateItem,
  onExportVault,
  onImportVault
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal for adding/editing items
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'ui-components' as Category,
    tagsString: '',
    html: '',
    css: '',
    js: '',
    isFavorite: false
  });

  // Filter items
  const filteredItems = vaultItems.filter((item) => {
    // Search query
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q)) ||
      item.html.toLowerCase().includes(q) ||
      item.js.toLowerCase().includes(q);

    // Category
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    // Favorite
    const matchesFavorite = !favoritesOnly || item.isFavorite;

    return matchesSearch && matchesCategory && matchesFavorite;
  });

  const handleCopyCode = (item: VaultItem) => {
    const combined = `<!-- ${item.title} -->\n${item.html}\n\n<style>\n${item.css}\n</style>\n\n<script>\n${item.js}\n</script>`;
    navigator.clipboard.writeText(combined);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      category: 'ui-components',
      tagsString: '',
      html: '<div class="card">\n  <h2>عنوان المكون</h2>\n  <p>وصف تجريبي</p>\n</div>',
      css: '.card {\n  padding: 20px;\n  background: #1e293b;\n  color: white;\n  border-radius: 12px;\n}',
      js: 'console.log("كود جديد في المخزن");',
      isFavorite: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: VaultItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      tagsString: item.tags.join(', '),
      html: item.html,
      css: item.css,
      js: item.js,
      isFavorite: item.isFavorite
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const tags = formData.tagsString
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingItem) {
      onUpdateItem({
        ...editingItem,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: tags.length ? tags : ['عام'],
        html: formData.html,
        css: formData.css,
        js: formData.js,
        isFavorite: formData.isFavorite,
        updatedAt: new Date().toISOString()
      });
    } else {
      onSaveNewItem({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: tags.length ? tags : ['عام'],
        html: formData.html,
        css: formData.css,
        js: formData.js,
        isFavorite: formData.isFavorite
      });
    }
    setIsModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportVault(file);
      e.target.value = '';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-950 overflow-y-auto">
      {/* Header and Hero Info */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Archive className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                مخزن الأكواد المهمة (Code Vault)
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              مستودعك البرمجي الخاص لحفظ وتصنيف أهم المكونات والشفرات وإعادة استخدامها بنقرة واحدة.
            </p>
          </div>

          {/* Quick Actions in Vault Header */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all shadow-md shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة كود جديد للمخزن</span>
            </button>

            <button
              onClick={onExportVault}
              title="تصدير نسخة احتياطية من جميع الأكواد المخزنة"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>تصدير (JSON)</span>
            </button>

            <label
              title="استيراد أكواد من ملف JSON احتياطي"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>استيراد</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto w-full px-6 py-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في العناوين، الوسوم، أو محتوى الأكواد..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-4 py-2 text-xs md:text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Favorite filter toggle */}
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              favoritesOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>المفضلة فقط</span>
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            الكل ({vaultItems.length})
          </button>

          {(Object.keys(CATEGORY_MAP) as Category[]).map((catKey) => {
            const count = vaultItems.filter(i => i.category === catKey).length;
            const meta = CATEGORY_MAP[catKey];
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === catKey
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {meta.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Vault Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 my-8">
            <Archive className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-200 mb-1">لم يتم العثور على أي أكواد تطابق البحث</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              يمكنك تجربة كلمات بحث أخرى أو إضافة كود جديد إلى مخزنك الآن.
            </p>
            <button
              onClick={openAddModal}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold"
            >
              + إضافة كود جديد للمخزن
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-12">
            {filteredItems.map((item) => {
              const catMeta = CATEGORY_MAP[item.category] || { label: item.category, color: 'text-slate-400 bg-slate-900' };
              return (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all group hover:shadow-xl hover:shadow-indigo-950/20"
                >
                  <div>
                    {/* Top Row: Category & Favorite */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${catMeta.color}`}>
                        {catMeta.label}
                      </span>
                      <button
                        onClick={() => onToggleFavorite(item.id)}
                        title={item.isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                        className="text-slate-500 hover:text-amber-400 transition-colors p-1"
                      >
                        <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Code Size Stats */}
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono mb-4 border-t border-slate-800/80 pt-3">
                      <span>HTML: {item.html.length}ح</span>
                      <span>·</span>
                      <span>CSS: {item.css.length}ح</span>
                      <span>·</span>
                      <span>JS: {item.js.length}ح</span>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-1">
                      {/* Load into Editor CTA */}
                      <button
                        onClick={() => onLoadItemToEditor(item)}
                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                        title="فتح هذا الكود داخل المحرر للتعديل والتدريب"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>تحميل بالمحرر</span>
                      </button>

                      {/* Quick Preview */}
                      <button
                        onClick={() => onPreviewItem(item)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs transition-colors"
                        title="معاينة مباشرة في صفحة المعاينة النهائية"
                      >
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Copy Code */}
                      <button
                        onClick={() => handleCopyCode(item)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs transition-colors"
                        title="نسخ الشفرة البرمجية بالكامل"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Edit item */}
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-xs transition-colors"
                        title="تعديل تفاصيل الكود"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-lg text-xs transition-colors"
                        title="حذف من المخزن"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Dialog for Adding / Editing Vault Item */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Archive className="w-5 h-5 text-amber-400" />
              <span>{editingItem ? 'تعديل بيانات الكود في المخزن' : 'حفظ كود جديد في المخزن'}</span>
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">عنوان الكود / المشروع:</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: بطاقة مستخدم تفاعلية مع تأثير زجاجي"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">وصف مختصر:</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="اشرح ماذا يفعل هذا الكود وكيفية الاستفادة منه..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">التصنيف:</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-indigo-500"
                  >
                    <option value="ui-components">واجهات مستخدم UI</option>
                    <option value="interactive-apps">تطبيقات تفاعلية</option>
                    <option value="css-effects">تأثيرات وتنسيقات CSS</option>
                    <option value="utilities">أدوات ومساعدات</option>
                    <option value="full-templates">قوالب ويب كاملة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">الوسوم (مفصولة بفاصلة):</label>
                  <input
                    type="text"
                    value={formData.tagsString}
                    onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                    placeholder="زر، تفاعلي، Tailwind، شكل"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Code Blocks */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-amber-400 font-mono font-medium mb-1">كود HTML:</label>
                  <textarea
                    rows={4}
                    value={formData.html}
                    onChange={(e) => setFormData({ ...formData, html: e.target.value })}
                    className="w-full bg-slate-950 font-mono text-xs border border-slate-800 rounded-lg p-2 text-slate-200 outline-none code-font"
                    style={{ direction: 'ltr' }}
                  />
                </div>

                <div>
                  <label className="block text-sky-400 font-mono font-medium mb-1">كود CSS:</label>
                  <textarea
                    rows={4}
                    value={formData.css}
                    onChange={(e) => setFormData({ ...formData, css: e.target.value })}
                    className="w-full bg-slate-950 font-mono text-xs border border-slate-800 rounded-lg p-2 text-slate-200 outline-none code-font"
                    style={{ direction: 'ltr' }}
                  />
                </div>

                <div>
                  <label className="block text-yellow-400 font-mono font-medium mb-1">كود JavaScript:</label>
                  <textarea
                    rows={4}
                    value={formData.js}
                    onChange={(e) => setFormData({ ...formData, js: e.target.value })}
                    className="w-full bg-slate-950 font-mono text-xs border border-slate-800 rounded-lg p-2 text-slate-200 outline-none code-font"
                    style={{ direction: 'ltr' }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="fav-check"
                  checked={formData.isFavorite}
                  onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
                />
                <label htmlFor="fav-check" className="text-slate-300 cursor-pointer">
                  تمييز هذا الكود بنجمة في المفضلة ⭐
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md"
                >
                  {editingItem ? 'حفظ التعديلات' : 'إضافة إلى المخزن'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
