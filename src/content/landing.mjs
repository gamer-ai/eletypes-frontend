// Single source of truth for SEO landing pages.
// Consumed by:
//  - scripts/build-landing.mjs  (build-time static HTML + sitemap.xml)
//  - src/pages/landing/LandingPage.jsx (in-app React route version)
// Plain ESM data — no JSX, no window/document access (must stay Node-importable).

export const SITE_URL = "https://www.eletypes.com";
export const LAST_MOD = "2026-10-12";

export const STATIC_ROUTES = ["/", "/keyboardlab", "/markdown"];

export const PAGES = [
  {
    slug: "typing-test/1-minute",
    lang: "en",
    htmlLang: "en",
    ogLocale: "en_US",
    keyword: "1 minute typing test",
    title: "1 Minute Typing Test – Free WPM Check | Eletypes",
    description:
      "Take a free 1-minute typing test and get your WPM and accuracy instantly. No sign-up, no ads — your stats stay in your browser.",
    h1: "1 Minute Typing Test",
    intro: [
      "The 1-minute typing test is the industry-standard benchmark for typing speed. Sixty seconds is long enough to smooth out a slow start or one fumbled word, but short enough to repeat ten times in a row while chasing a personal best — which is why it’s the number most people quote when they say “my WPM.”",
      "Your score is measured in WPM (words per minute), where one “word” equals five characters including spaces. Eletypes also reports accuracy, raw vs. net WPM, and a per-character error breakdown, so you can see whether your bottleneck is speed, accuracy, or consistency.",
      "Unlike most typing tests, Eletypes needs no account: your history lives in your browser’s localStorage. Take the test as many times as you like, watch your WPM trend on the stats dashboard, opt into the no-signup leaderboard with any display name you choose, or send a friend a challenge link so you both type the exact same seeded text. When you beat your record, one click renders a shareable result card for X, Discord, or WeChat.",
    ],
    cta: { text: "Start the 1-minute test", href: `${SITE_URL}/?s=seo1min&t=60` },
    faqs: [
      {
        q: "What is a good score on a 1-minute typing test?",
        a: "For most people, 40 WPM is a solid baseline, 60 WPM is strong, and 80+ WPM is fast. Professional typists reach 100+. Accuracy matters as much as speed — a clean 60 WPM beats a sloppy 75 WPM in any real work.",
      },
      {
        q: "How is WPM calculated?",
        a: "WPM = (characters typed ÷ 5) ÷ minutes. The “÷ 5” is the industry standard that treats one word as five keystrokes, so scores are comparable across tests and languages. Eletypes shows both raw WPM and net WPM (penalized for errors).",
      },
      {
        q: "Do I need to create an account?",
        a: "No. Eletypes has no accounts, no ads, and no tracking. Your test history is stored only in your browser. Joining the leaderboard is opt-in and asks only for a display name — no email, no password.",
      },
      {
        q: "How can I improve my 1-minute score?",
        a: "Warm up with a 15-second test first, prioritize 98%+ accuracy over raw speed (errors cost more than they look), and keep a steady rhythm instead of sprinting. Eletypes’ stats dashboard highlights your weakest keys so practice targets the right thing.",
      },
    ],
    related: [
      { href: `${SITE_URL}/typing-test/wpm-test/`, label: "WPM Test — what exactly is WPM?" },
      { href: `${SITE_URL}/typing-test/chinese/`, label: "中文打字测试 — Chinese typing test" },
    ],
  },
  {
    slug: "typing-test/wpm-test",
    lang: "en",
    htmlLang: "en",
    ogLocale: "en_US",
    keyword: "wpm test",
    title: "WPM Test – Free Words-Per-Minute Test | Eletypes",
    description:
      "Free WPM test: find out exactly how fast you type. Words-per-minute plus accuracy, no sign-up. Compare on the leaderboard.",
    h1: "WPM Test",
    intro: [
      "WPM — words per minute — is the universal unit of typing speed. Job listings ask for it, typing certificates are graded in it, and every serious typing community argues about it. This free WPM test tells you exactly where you stand in under a minute.",
      "Here’s how it works: type for 60 seconds, and we count every correct character. Divide by five (the industry standard for one “word”), divide by minutes, and that’s your WPM. Eletypes reports both raw WPM (everything you typed) and net WPM (errors subtracted), plus accuracy and consistency stats, because a single number never tells the whole story.",
      "What counts as good? Below 30 WPM is beginner territory, 40 is the average adult, 60 is genuinely good, 80+ is fast, and 100+ is professional level. Wherever you land, Eletypes keeps your history locally — no account, no ads — and plots your WPM trend over time so progress is visible. Want bragging rights? The no-signup leaderboard ranks the top 50 scores per mode, and a shareable result card turns your personal best into a post.",
    ],
    cta: { text: "Check my WPM", href: `${SITE_URL}/?s=seowpm&t=60` },
    faqs: [
      {
        q: "What does WPM stand for?",
        a: "Words Per Minute — the standard measure of typing speed. One “word” is defined as five characters (including spaces) so scores can be compared fairly.",
      },
      {
        q: "What is a good WPM score?",
        a: "Below 30 is beginner, 30–40 average, 40–60 good, 60–80 above average, 80+ advanced, and 100+ professional. Most office work is comfortable at 50–60 WPM with high accuracy.",
      },
      {
        q: "What’s the difference between WPM, CPM, and KPM?",
        a: "WPM counts five-character words per minute; CPM/KPM count raw characters or keystrokes. WPM is the standard for English, while CPM is often used for Chinese typing where “words” don’t apply the same way.",
      },
      {
        q: "Is this WPM test really free?",
        a: "Yes — free forever, no sign-up, no ads. Eletypes is open-source (GPL-3.0); the only optional data that ever leaves your browser is a leaderboard entry you explicitly submit.",
      },
    ],
    related: [
      { href: `${SITE_URL}/typing-test/1-minute/`, label: "1 Minute Typing Test — the classic benchmark" },
      { href: `${SITE_URL}/monkeytype-alternative/`, label: "Eletypes vs Monkeytype — honest comparison" },
    ],
  },
  {
    slug: "typing-test/chinese",
    lang: "zh",
    htmlLang: "zh-CN",
    ogLocale: "zh_CN",
    keyword: "中文打字测试",
    title: "中文打字测试 - 免费在线拼音打字测速 | Eletypes",
    description:
      "免费中文打字测试：看汉字打拼音，实时统计速度与准确率。15/30/60/90 秒计时，免注册，记录只保存在本地。",
    h1: "中文打字测试",
    intro: [
      "中文打字和英文打字测的不是同一件事。英文打字拼的是纯指法速度，中文打字则是三件事的组合：QWERTY 键盘上的指法、看到汉字时拼音反应的快慢、以及在输入法候选词里选词的流畅度。只练英文打字，中文速度上不去——得用中文专门练。",
      "Eletypes 的中文打字测试直接看汉字打拼音，用你系统自带的输入法即可（拼音、五笔都行），实时统计每分钟字数与准确率。题库覆盖数千常用词/字、1500 个成语和中文短句，支持 15/30/60/90 秒四档计时，也有句子模式可以整段练习。",
      "和英文测试一样，中文测试无需注册、无广告，所有记录只保存在你的浏览器本地。你可以把成绩发到免注册排行榜和大家比一比，或者生成挑战链接发给朋友——同一套题，谁快谁慢一目了然。",
    ],
    cta: { text: "开始中文打字测试", href: `${SITE_URL}/?s=seocn&l=cn&t=60` },
    faqs: [
      {
        q: "中文打字速度是怎么计算的？",
        a: "中文一般按每分钟字数（CPM）统计，因为“词”的概念不像英文那样规整。Eletypes 会同时给出速度、准确率和错字分析，帮你定位是拼音不熟还是选词太慢。",
      },
      {
        q: "需要安装输入法吗？",
        a: "不需要。用你电脑/手机系统自带的拼音输入法就行，测试页面只负责出题和计时计分。",
      },
      {
        q: "中文打字多少算快？",
        a: "日常办公够用的水平大约是每分钟 60–80 字；100 字/分钟以上算熟练，专业速录员可达 200 字/分钟。先保证准确率，再提速度。",
      },
      {
        q: "需要注册账号吗？",
        a: "不需要。Eletypes 没有账号体系，练习记录只存在本地浏览器。排行榜是自愿参加的，只需要起个昵称。",
      },
    ],
    related: [
      { href: `${SITE_URL}/typing-test/1-minute/`, label: "1 Minute Typing Test — 英文打字测速" },
      { href: `${SITE_URL}/vocabulary/cet4/`, label: "打字背单词 — 用键盘记拼写" },
    ],
  },
  {
    slug: "vocabulary/cet4",
    lang: "zh",
    htmlLang: "zh-CN",
    ogLocale: "zh_CN",
    keyword: "打字背单词",
    title: "打字背四级单词 - CET-4 词汇拼写训练 | Eletypes",
    description:
      "用打字背四级单词：CET-4 词库分章节练习，拼对才算过，还有默写模式自测。免费免注册，进度保存在本地。",
    h1: "打字背四级单词",
    intro: [
      "很多人背完四级单词，考试时依然写不对——因为“认识”和“会写”是两回事。只看不写，单词永远是哑巴词汇：阅读时眼熟，写作时调不出来。打字背单词解决的就是这个问题：每个单词必须亲手拼对，拼错就得重来，记忆走的是拼写输出通道，比干瞪眼记得牢得多。",
      "Eletypes 的单词卡内置 CET-4 词库，按章节划分，你可以一章一章过。练习时单词配有词义和例句，敲对拼写才算通过；recite（默写）模式会把单词藏起来、只留释义，逼你凭记忆输出——这是检验真记住了还是“以为记住了”的最好方式。",
      "背完单词，还能把 CET-4 词表直接当作打字测试的自定义词库，在计时模式里再练一轮速度。免注册、免下载，打开网页就练，进度存在本地浏览器，下次接着来。",
    ],
    cta: { text: "开始打字背单词", href: `${SITE_URL}/?deck=CET4` },
    faqs: [
      {
        q: "打字背单词真的比普通背单词有效吗？",
        a: "对“会认不会写”的情况特别有效。阅读只需要再认（recognition），写作和翻译需要回忆（recall），而打字强制你完整输出拼写，正好训练的是回忆通道。建议配合默写模式自测。",
      },
      {
        q: "和百词斩、扇贝这些 App 有什么区别？",
        a: "背单词 App 主攻“认识”，Eletypes 主攻“拼写输出”。两者不冲突：App 上刷完一章，来这里用打字检验是不是真会写了。",
      },
      {
        q: "CET-4 词库覆盖多少词？怎么划分？",
        a: "覆盖 CET-4 考纲核心词汇，按章节划分，可分章练习、跳章复习。",
      },
      {
        q: "需要下载或注册吗？",
        a: "都不需要。网页打开即用，免注册；学习进度保存在本地浏览器。",
      },
    ],
    related: [
      { href: `${SITE_URL}/vocabulary/toefl/`, label: "打字背托福单词 — 进阶词汇" },
      { href: `${SITE_URL}/typing-test/chinese/`, label: "中文打字测试 — 换个赛道" },
    ],
  },
  {
    slug: "vocabulary/toefl",
    lang: "zh",
    htmlLang: "zh-CN",
    ogLocale: "zh_CN",
    keyword: "托福词汇",
    title: "打字背托福单词 - TOEFL 词汇拼写训练 | Eletypes",
    description:
      "用打字背托福单词：TOEFL 词库分章节练习，拼对才算过，默写模式自测。免费免注册，进度保存在本地。",
    h1: "打字背托福单词",
    intro: [
      "托福考试的写作和口语部分，提分瓶颈往往不在思路而在词汇输出：脑子里有词，写出来却拼错，或者干脆用不上。托福词汇比四级更长、更学术、更容易拼错，恰恰是最需要“动手写”的词库。",
      "Eletypes 的单词卡内置 TOEFL 词库，按章节划分，每个单词配有词义和例句。练习时你必须完整敲出拼写，错一个字母就得重来——这种“错误阻断”机制逼你记住那些最容易错的字母组合。recite（默写）模式只给释义不给单词，适合考前自测。",
      "全部免费、免注册，进度存在本地。建议的学习节奏：每天一章新词 + 默写模式复习旧词，写作时能调出来的词才是真正记住的词。",
    ],
    cta: { text: "开始托福词汇练习", href: `${SITE_URL}/?deck=TOEFL` },
    faqs: [
      {
        q: "这个适合正在备考托福的人用吗？",
        a: "适合作为词汇输出的补充训练。它不替代系统的备考课程，但能解决“背过却写不对”的问题，建议每天 15–20 分钟，配合你的备考计划。",
      },
      {
        q: "单词有例句和释义吗？",
        a: "有。每个单词配有中文释义和英文例句/短语，默写模式下释义保留、单词隐藏。",
      },
      {
        q: "和四级词汇页面有什么区别？",
        a: "词库不同（TOEFL vs CET-4），界面操作完全一样，可直接进阶。",
      },
      {
        q: "免费吗？要注册吗？",
        a: "免费，免注册。Eletypes 是开源项目（GPL-3.0），无广告。",
      },
    ],
    related: [
      { href: `${SITE_URL}/vocabulary/cet4/`, label: "打字背四级单词 — 从四级起步" },
      { href: `${SITE_URL}/typing-test/1-minute/`, label: "1 Minute Typing Test — 顺手测英文打字" },
    ],
  },
  {
    slug: "monkeytype-alternative",
    lang: "en",
    htmlLang: "en",
    ogLocale: "en_US",
    keyword: "monkeytype alternative",
    title: "Monkeytype Alternative – Typing Test + More | Eletypes",
    description:
      "Looking for a Monkeytype alternative? Eletypes is a free, open-source typing test with vocab cards for learners, a 3D keyboard lab, and no sign-up.",
    h1: "Looking for a Monkeytype Alternative?",
    intro: [
      "Let’s be honest: Monkeytype is excellent at what it does — a minimal, fast, endlessly customizable typing test. If all you want is the purest words-per-minute loop, it’s hard to beat, and this page isn’t here to trash it.",
      "Eletypes started from the same inspiration but grew in a different direction: instead of going deeper into one loop, it became the place where typing practice meets everything around it. The typing test itself covers English and Chinese (Pinyin), words and sentence modes, 15–90s timers, and the same live stats you’d expect. Around it, you get things Monkeytype doesn’t try to be: vocab cards for English learners (GRE, TOEFL, CET-4/CET-6 decks where you type to learn, with a recite mode that hides the word and tests recall); Keyboard Lab, a 3D keyboard design playground in your browser (7 layouts, 8 keycap profiles, KLE import); no account, ever — your history lives in localStorage and the leaderboard needs only a display name you invent; plus a QWERTY trainer, 30+ achievement badges, challenge links that let friends type the exact same seeded text, and one-click shareable result cards.",
      "Who should pick which? If you want the most refined minimal typing test with a huge community, stay with Monkeytype. If you want typing + vocabulary learning + keyboard tinkering in one tab — especially if you type in Chinese or are learning English — give Eletypes a run. It’s free, open-source (GPL-3.0), and takes about ten seconds to judge for yourself.",
    ],
    cta: { text: "Try Eletypes — no sign-up", href: `${SITE_URL}/?s=seomt&t=60` },
    faqs: [
      {
        q: "Is Eletypes really free?",
        a: "Yes — free forever, no premium tier, no ads. It’s open-source under GPL-3.0, so the code is public too.",
      },
      {
        q: "Do I need an account to use Eletypes?",
        a: "No. There are no accounts at all. Settings and history are stored in your browser’s localStorage; the leaderboard is opt-in with just a display name.",
      },
      {
        q: "Is Eletypes open source?",
        a: "Yes, GPL-3.0. You can read the code, self-host it, or contribute on GitHub.",
      },
      {
        q: "I’m a Monkeytype user — what will feel different?",
        a: "The core typing loop will feel familiar (live WPM, accuracy, timers). The difference is everything around it: vocab cards, a 3D keyboard lab, built-in Chinese pinyin mode, and zero-account privacy.",
      },
    ],
    related: [
      { href: `${SITE_URL}/typing-test/1-minute/`, label: "1 Minute Typing Test — start with the classic" },
      { href: `${SITE_URL}/typing-test/wpm-test/`, label: "WPM Test — check your words per minute" },
    ],
  },
];
