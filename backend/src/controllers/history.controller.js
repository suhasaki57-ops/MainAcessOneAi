import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import db from '../supabase/database.js';

let inMemoryHistory = [
  {
    id: '1',
    title: 'Audit color contrast ratio for CTA button',
    category: 'Scans',
    date: '2026-08-05 14:22',
    isFav: true,
    created_at: new Date('2026-08-05T14:22:00Z').toISOString(),
  },
  {
    id: '2',
    title: 'Translate user interface strings into Spanish',
    category: 'Translations',
    date: '2026-08-05 11:05',
    isFav: false,
    created_at: new Date('2026-08-05T11:05:00Z').toISOString(),
  },
  {
    id: '3',
    title: 'Summarize WCAG 2.1 AA Compliance PDF',
    category: 'Prompts',
    date: '2026-08-04 18:30',
    isFav: true,
    created_at: new Date('2026-08-04T18:30:00Z').toISOString(),
  },
  {
    id: '4',
    title: 'Uploaded Product_Specification.docx OCR',
    category: 'Uploads',
    date: '2026-08-04 15:10',
    isFav: false,
    created_at: new Date('2026-08-04T15:10:00Z').toISOString(),
  },
];

export const getHistory = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  let items = [...inMemoryHistory];

  try {
    const dbItems = await db.select('History');
    if (dbItems && dbItems.length > 0) {
      items = dbItems.map((i) => ({
        id: i.id,
        title: i.title || i.prompt || 'Activity Log',
        category: i.category || 'Scans',
        date: i.date || new Date(i.created_at || Date.now()).toISOString().replace('T', ' ').slice(0, 16),
        isFav: !!i.is_favorite,
        created_at: i.created_at,
      }));
    }
  } catch (err) {
    console.warn('History database query fallback:', err.message);
  }

  if (category && category !== 'All') {
    items = items.filter((item) => item.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    items = items.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));
  }

  return res.status(200).json(new ApiResponse(200, items, 'History fetched successfully'));
});

export const createHistory = asyncHandler(async (req, res) => {
  const { title, category } = req.body;
  const newLog = {
    id: `log_${Date.now()}`,
    title: title || 'New Activity Log',
    category: category || 'Scans',
    date: new Date().toISOString().replace('T', ' ').slice(0, 16),
    isFav: false,
    created_at: new Date().toISOString(),
  };

  inMemoryHistory.unshift(newLog);

  try {
    await db.insert('History', {
      user_id: req.user?.id || 'demo-user-101',
      title: newLog.title,
      category: newLog.category,
      is_favorite: false,
    });
  } catch (err) {
    console.warn('History database insert fallback:', err.message);
  }

  return res.status(201).json(new ApiResponse(201, newLog, 'History entry created'));
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const itemIndex = inMemoryHistory.findIndex((i) => i.id === id);

  if (itemIndex !== -1) {
    inMemoryHistory[itemIndex].isFav = !inMemoryHistory[itemIndex].isFav;
  }

  try {
    await db.update('History', id, { is_favorite: inMemoryHistory[itemIndex]?.isFav ?? true });
  } catch (err) {
    console.warn('History favorite update fallback:', err.message);
  }

  return res.status(200).json(new ApiResponse(200, { id, isFav: inMemoryHistory[itemIndex]?.isFav }, 'Favorite status updated'));
});

export const deleteHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  inMemoryHistory = inMemoryHistory.filter((i) => i.id !== id);

  try {
    await db.delete('History', id);
  } catch (err) {
    console.warn('History delete fallback:', err.message);
  }

  return res.status(200).json(new ApiResponse(200, { id }, 'History entry deleted'));
});
