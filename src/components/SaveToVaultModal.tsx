import React, { useState } from 'react';
import { Bookmark, X, Check } from 'lucide-react';
import { Category } from '../types';

interface SaveToVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    category: Category;
    tags: string[];
    isFavorite: boolean;
  }) => void;
}

export const SaveToVaultModal: React.FC<SaveToVaultModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('مشروعي الجديد');
  const [description, setDescription] = useState('كود تم تطويره وتجربته في محرر كود كرافت');
  const [category, setCategory] = useState<Category>('ui-components');
  const [tagsInput, setTagsInput] = useState('تفاعلي, كود, تصميم');
  const [isFavorite, setIsFavorite] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onSave({
      title,
      description,
      category,
      tags: tags.length ? tags : ['عام'],
      isFavorite
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">حفظ في مخزن الأكواد</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">اسم الكود / المكون:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: زر متجاوب بتأثير نيوني"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">الوصف:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف مختصر لاستخدام الكود لاحقاً..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">التصنيف في المخزن:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
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
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="زر, تصميم, JavaScript"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="save-fav"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
            />
            <label htmlFor="save-fav" className="text-slate-300 cursor-pointer">
              إضافة مباشرة إلى الأكواد المفضلة ⭐
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md"
            >
              تأكيد وحفظ بالمخزن
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
