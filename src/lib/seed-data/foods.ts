export type SeedFood = {
  en: string;
  bn: string;
  portionEn: string;
  portionBn: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: "staple" | "protein" | "veg" | "fruit" | "snack" | "dairy" | "drink";
};

const f = (
  en: string,
  bn: string,
  portionEn: string,
  portionBn: string,
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  category: SeedFood["category"],
): SeedFood => ({ en, bn, portionEn, portionBn, calories, protein, carbs, fat, category });

// Approximate values for typical Bangladeshi home/restaurant portions.
export const SEED_FOODS: SeedFood[] = [
  f("Bhat (cooked rice)", "ভাত", "1 plate (~200 g)", "১ প্লেট (~২০০ গ্রাম)", 260, 5, 57, 0.5, "staple"),
  f("Ruti", "রুটি", "1 piece", "১ পিস", 100, 3, 20, 1, "staple"),
  f("Paratha", "পরোটা", "1 piece", "১ পিস", 260, 5, 34, 11, "staple"),
  f("Bread slice", "পাউরুটি", "1 slice", "১ স্লাইস", 70, 2.5, 13, 1, "staple"),
  f("Khichuri", "খিচুড়ি", "1 plate", "১ প্লেট", 400, 12, 60, 12, "staple"),
  f("Chicken biryani", "চিকেন বিরিয়ানি", "1 plate", "১ প্লেট", 600, 28, 70, 22, "staple"),
  f("Beef tehari", "বিফ তেহারি", "1 plate", "১ প্লেট", 650, 26, 72, 26, "staple"),
  f("Muri (puffed rice)", "মুড়ি", "1 bati", "১ বাটি", 60, 1, 13, 0.2, "staple"),
  f("Dal (lentil soup)", "ডাল", "1 bati (~150 g)", "১ বাটি (~১৫০ গ্রাম)", 140, 8, 20, 3, "protein"),
  f("Boiled egg", "সিদ্ধ ডিম", "1 egg", "১টি", 75, 6, 0.5, 5, "protein"),
  f("Egg omelette", "ডিম ওমলেট", "1 egg with oil", "১ ডিম (তেল সহ)", 110, 6, 1, 9, "protein"),
  f("Chicken curry", "মুরগির ঝোল", "1 piece with gravy", "১ পিস ঝোল সহ", 200, 20, 3, 12, "protein"),
  f("Beef curry", "গরুর মাংসের ভুনা", "1 bati (~100 g)", "১ বাটি (~১০০ গ্রাম)", 250, 22, 4, 17, "protein"),
  f("Rui fish curry", "রুই মাছের ঝোল", "1 piece", "১ পিস", 150, 17, 2, 8, "protein"),
  f("Ilish (hilsa) curry", "ইলিশ মাছ", "1 piece", "১ পিস", 220, 18, 0, 16, "protein"),
  f("Tilapia fry", "তেলাপিয়া ভাজা", "1 piece", "১ পিস", 170, 20, 2, 9, "protein"),
  f("Soya chunks (dry weight)", "সয়াবিন (শুকনো ওজন)", "50 g dry", "৫০ গ্রাম শুকনো", 170, 26, 15, 0.5, "protein"),
  f("Chicken liver", "মুরগির কলিজা", "1 bati (~100 g)", "১ বাটি (~১০০ গ্রাম)", 170, 25, 1, 6.5, "protein"),
  f("Chola (boiled chickpeas)", "সেদ্ধ ছোলা", "1 bati", "১ বাটি", 210, 11, 35, 3.5, "protein"),
  f("Mixed vegetable bhaji", "মিক্সড সবজি ভাজি", "1 bati", "১ বাটি", 90, 2, 10, 5, "veg"),
  f("Shak bhaji (leafy greens)", "শাক ভাজি", "1 bati", "১ বাটি", 70, 3, 6, 4, "veg"),
  f("Alu bhorta", "আলু ভর্তা", "1 bati", "১ বাটি", 140, 2, 22, 5, "veg"),
  f("Milk", "দুধ", "1 glass (250 ml)", "১ গ্লাস (২৫০ মি.লি.)", 150, 8, 12, 8, "dairy"),
  f("Doi (yogurt)", "দই", "1 bati (~100 g)", "১ বাটি (~১০০ গ্রাম)", 100, 4, 12, 4, "dairy"),
  f("Banana", "কলা", "1 medium", "১টি মাঝারি", 105, 1.3, 27, 0.4, "fruit"),
  f("Guava", "পেয়ারা", "1 medium", "১টি মাঝারি", 70, 3, 14, 1, "fruit"),
  f("Papaya", "পেঁপে", "1 bati", "১ বাটি", 60, 1, 15, 0.2, "fruit"),
  f("Mango", "আম", "1 cup sliced", "১ কাপ কাটা", 100, 1, 25, 0.5, "fruit"),
  f("Fuchka", "ফুচকা", "6 pieces", "৬ পিস", 250, 5, 38, 9, "snack"),
  f("Singara", "সিঙ্গারা", "1 piece", "১ পিস", 260, 4, 28, 15, "snack"),
  f("Jhalmuri", "ঝালমুড়ি", "1 packet", "১ প্যাকেট", 220, 5, 38, 6, "snack"),
  f("Roasted peanuts", "চিনাবাদাম", "1 handful (30 g)", "এক মুঠো (৩০ গ্রাম)", 170, 7, 5, 14, "snack"),
  f("Milk tea (with sugar)", "দুধ চা", "1 cup", "১ কাপ", 60, 1.5, 9, 2, "drink"),
];
