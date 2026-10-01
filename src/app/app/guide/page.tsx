import { redirect } from "next/navigation";
import { pick } from "@/lib/constants";
import { getCurrentUser, getLang } from "@/lib/session";
import { Disclaimer, SectionTitle } from "@/components/ui";

type Section = { icon: string; en: string; bn: string; itemsEn: string[]; itemsBn: string[] };

const SECTIONS: Section[] = [
  {
    icon: "🚪", en: "Your first day at the gym", bn: "জিমে আপনার প্রথম দিন",
    itemsEn: ["Go at a quiet time (mid-morning or early afternoon) for your first 2–3 sessions.", "Bring a small towel, a water bottle and clean indoor shoes.", "Ask the front desk for a quick tour: where the dumbbells, machines and stretching area are.", "Start with the warm-up, then follow your plan one exercise at a time. You don't need to do everything.", "It's completely fine to use light weights. Everyone started here.", "Finish with the cool-down and write your numbers in the app."],
    itemsBn: ["প্রথম ২–৩ সেশন ভিড়হীন সময়ে (সকাল ১০টা বা দুপুরে) যান।", "ছোট তোয়ালে, পানির বোতল ও পরিষ্কার ইনডোর জুতা নিন।", "রিসেপশনে বলে জিমটা এক নজরে ঘুরে দেখুন: ডাম্বেল, মেশিন ও স্ট্রেচিংয়ের জায়গা কোথায়।", "ওয়ার্ম-আপ দিয়ে শুরু করে প্ল্যান অনুযায়ী একটি একটি করে ব্যায়াম করুন। সব করার দরকার নেই।", "হালকা ওজনে করা পুরোপুরি ঠিক আছে। সবাই এখান থেকেই শুরু করেছে।", "কুল-ডাউন করে অ্যাপে আপনার সংখ্যাগুলো লিখে রাখুন।"],
  },
  {
    icon: "🤝", en: "Gym etiquette", bn: "জিমের শিষ্টাচার",
    itemsEn: ["Re-rack your weights and wipe machines after use.", "Don't hog a machine between sets. Let others work in if it's busy.", "Ask “how many sets do you have left?” before using someone's machine.", "Don't drop dumbbells or slam the weight stack.", "Keep your phone use short, and don't film other people.", "Good hygiene matters: clean clothes, deodorant, towel on benches."],
    itemsBn: ["ব্যবহারের পর ওজন যথাস্থানে রাখুন ও মেশিন মুছে দিন।", "সেটের মাঝে মেশিন দখল করে রাখবেন না। ভিড় থাকলে অন্যকে সুযোগ দিন।", "কারও মেশিন ব্যবহারের আগে জিজ্ঞেস করুন “আপনার আর কয় সেট বাকি?”", "ডাম্বেল ফেলবেন না বা ওজনের স্ট্যাক ধপ করে ফেলবেন না।", "ফোন কম ব্যবহার করুন এবং অন্যদের ছবি/ভিডিও তুলবেন না।", "পরিচ্ছন্নতা জরুরি: পরিষ্কার পোশাক, ডিওডোরেন্ট, বেঞ্চে তোয়ালে।"],
  },
  {
    icon: "⚙️", en: "How to use common machines", bn: "সাধারণ মেশিন ব্যবহারের নিয়ম",
    itemsEn: ["Always adjust the seat first. The handles should line up with the target muscle.", "Put the pin in the lightest weight and do a practice set.", "Move slowly: 2 seconds up, 2–3 seconds down.", "If a machine feels painful or awkward, stop and ask staff to help adjust it.", "Use the “Machine busy?” button in Gym Mode for an equivalent exercise."],
    itemsBn: ["আগে সিট ঠিক করুন। হ্যান্ডেল যেন টার্গেট পেশির বরাবর থাকে।", "পিন সবচেয়ে হালকা ওজনে দিয়ে একটি অনুশীলন সেট করুন।", "ধীরে করুন: ২ সেকেন্ডে উপরে, ২–৩ সেকেন্ডে নিচে।", "মেশিনে ব্যথা বা অস্বস্তি হলে থামুন এবং স্টাফকে ঠিক করে দিতে বলুন।", "সমতুল্য ব্যায়ামের জন্য জিম মোডের “মেশিন ব্যস্ত?” বাটন ব্যবহার করুন।"],
  },
  {
    icon: "🩹", en: "Something hurts? Stop, swap or see a pro", bn: "ব্যথা করছে? থামুন, বদলান, অথবা বিশেষজ্ঞ দেখান",
    itemsEn: ["STOP and see a doctor if you feel chest pain, dizziness, shortness of breath, numbness, or a sudden sharp pain or “pop”.", "SWAP the exercise if a joint (knee, shoulder, lower back) feels pinchy or sharp. Use the swap or “Machine busy?” tools.", "REDUCE the weight if a muscle just burns or feels tired. That's effort, not injury.", "If pain lasts more than 2–3 days or keeps coming back, get it checked by a physiotherapist or doctor."],
    itemsBn: ["বুকে ব্যথা, মাথা ঘোরা, শ্বাসকষ্ট, অসাড় ভাব, বা হঠাৎ তীব্র ব্যথা/“পপ” শব্দ হলে থামুন এবং ডাক্তার দেখান।", "হাঁটু, কাঁধ বা কোমরের জয়েন্টে খোঁচা বা তীব্র ব্যথা লাগলে ব্যায়াম বদলান। সোয়াপ বা “মেশিন ব্যস্ত?” ব্যবহার করুন।", "পেশি শুধু জ্বললে বা ক্লান্ত লাগলে ওজন কমান। এটা পরিশ্রম, আঘাত নয়।", "ব্যথা ২–৩ দিনের বেশি থাকলে বা বারবার ফিরে এলে ফিজিওথেরাপিস্ট বা ডাক্তার দেখান।"],
  },
  {
    icon: "😖", en: "Soreness (DOMS) is normal", bn: "পেশিতে টনটনে ব্যথা (DOMS) স্বাভাবিক",
    itemsEn: ["Muscle soreness 1–2 days after a new workout is normal. It peaks around day 2 and fades by day 4.", "It's a dull, spread-out ache in the muscle, not a sharp pain in a joint.", "Light movement, walking, water and good sleep help. You don't need to skip the next session, just go lighter.", "NOT normal: sharp or localised pain, swelling, pain that gets worse each day, or dark urine. See a doctor."],
    itemsBn: ["নতুন ওয়ার্কআউটের ১–২ দিন পর পেশিতে ব্যথা স্বাভাবিক। ২য় দিনে সবচেয়ে বেশি, ৪র্থ দিনের মধ্যে কমে যায়।", "এটি পেশিজুড়ে ভোঁতা ব্যথা, জয়েন্টে তীব্র ব্যথা নয়।", "হালকা নড়াচড়া, হাঁটা, পানি ও ভালো ঘুম সাহায্য করে। পরের সেশন বাদ দিতে হবে না, শুধু হালকা করুন।", "স্বাভাবিক নয়: তীব্র বা নির্দিষ্ট জায়গায় ব্যথা, ফোলা, প্রতিদিন বাড়তে থাকা ব্যথা, বা গাঢ় রঙের প্রস্রাব। ডাক্তার দেখান।"],
  },
];

export default async function GuidePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");
  const lang = await getLang();
  const T = (en: string, bn: string) => pick(lang, en, bn);
  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-2xl font-bold">🧭 {T("Gym guide & safety", "জিম গাইড ও নিরাপত্তা")}</h1>
        <p className="text-sm text-slate-400">{T("Free for everyone, always.", "সবার জন্য সবসময় ফ্রি।")}</p>
      </div>
      {SECTIONS.map((s, i) => (
        <details key={s.en} open={i === 0} className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <summary className="flex items-center justify-between text-lg font-semibold">
            <span>{s.icon} {pick(lang, s.en, s.bn)}</span>
            <span className="text-slate-500">＋</span>
          </summary>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            {(lang === "bn" ? s.itemsBn : s.itemsEn).map((it, k) => <li key={k}>{it}</li>)}
          </ul>
        </details>
      ))}
      <SectionTitle>{T("Medical disclaimer", "চিকিৎসা দাবিত্যাগ")}</SectionTitle>
      <Disclaimer lang={lang} />
    </div>
  );
}
