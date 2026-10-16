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
  },  {
    slug: "typing-test",
    lang: "en",
    htmlLang: "en",
    ogLocale: "en_US",
    keyword: "typing test",
    title: "Free Typing Test – Check Your WPM Online | Eletypes",
    description:
      "Free online typing test: measure your WPM and accuracy in 15–90 seconds. English and Chinese, words and sentence modes, no sign-up.",
    h1: "Free Online Typing Test",
    intro: [
      "A typing test measures how fast and accurately you can type — usually reported as WPM (words per minute) plus an accuracy percentage. People take them for job applications, to track their own progress, or just for the fun of beating a personal best. Whatever your reason, the format is the same: type the text on screen before the timer runs out, and get your score instantly.",
      "Eletypes covers every common format in one place: 15, 30, 60, and 90-second timers, English and Chinese (Pinyin) languages, and both random-words and full-sentence modes. Every test reports live WPM, accuracy, and consistency stats, and your history is plotted over time so improvement is visible — not just a number you forget tomorrow.",
      "There is no account, no paywall, and no ads: everything runs in your browser and your data stays there. Opt into the leaderboard with any display name, send friends challenge links so everyone types the exact same text, or render a shareable result card when you set a record.",
    ],
    cta: { text: "Start typing test", href: `${SITE_URL}/?s=seohub&t=60` },
    faqs: [
      {
        q: "How does an online typing test work?",
        a: "Text appears on screen and a timer starts when you type the first character. When time runs out, your WPM and accuracy are calculated from what you typed — correct characters count, errors cost you.",
      },
      {
        q: "Which test length should I choose?",
        a: "15 or 30 seconds for a quick check or warm-up, 60 seconds for the standard benchmark most people quote, 90 seconds if you want the most reliable measure of sustained speed.",
      },
      {
        q: "Do I need to create an account?",
        a: "No. Eletypes has no accounts at all — your settings and history live in your browser's localStorage, and the leaderboard only asks for a display name you invent.",
      },
      {
        q: "Can I take the test in Chinese?",
        a: "Yes. Switch to Chinese (Pinyin) mode and type directly with your system input method — there is a dedicated Chinese typing test page with its own stats.",
      },
    ],
    related: [
      { href: `${SITE_URL}/typing-test/1-minute/`, label: "1 Minute Typing Test — the classic benchmark" },
      { href: `${SITE_URL}/typing-test/wpm-test/`, label: "WPM Test — what exactly is WPM?" },
    ],
  },
  {
    slug: "typing-test/30-second",
    lang: "en",
    htmlLang: "en",
    ogLocale: "en_US",
    keyword: "30 second typing test",
    title: "30 Second Typing Test – Quick WPM Check | Eletypes",
    description:
      "Free 30-second typing test: a quick, low-commitment WPM reading with accuracy breakdown. No sign-up, results instantly.",
    h1: "30 Second Typing Test",
    intro: [
      "Thirty seconds is the sweet spot of typing tests: long enough that one fumbled word doesn't wreck your score, short enough to repeat a dozen times while chasing a personal best. It's the format most people reach for when they want a quick, honest reading of their current speed without committing to a full minute.",
      "Your score is measured the standard way — (characters ÷ 5) ÷ minutes — with both raw and net WPM plus accuracy, so a clean run and a sloppy run never look the same. Because it's quick, the 30-second test doubles as the perfect warm-up: two or three rounds to loosen your fingers before you attempt a 60 or 90-second benchmark.",
      "Like every Eletypes test, it's free with no account and no ads. Your history is stored locally and charted over time, and one click turns a personal best into a shareable result card — or send a challenge link so a friend types the exact same text.",
    ],
    cta: { text: "Start the 30-second test", href: `${SITE_URL}/?s=seo30s&t=30` },
    faqs: [
      {
        q: "What is a good 30-second typing score?",
        a: "Roughly the same scale as the 1-minute test: 40 WPM is solid, 60 is strong, 80+ is fast. Scores run slightly higher than 60-second tests because there's less time for fatigue — compare 30-second scores with 30-second scores.",
      },
      {
        q: "Is a 30-second test as accurate as a 1-minute test?",
        a: "Close, but not identical. Shorter tests reward burst speed; longer tests reward consistency. Use 30 seconds for quick checks and warm-ups, 60–90 seconds when you want your most reliable number.",
      },
      {
        q: "Can I use this as a warm-up?",
        a: "Absolutely — that's one of its best uses. Two or three relaxed 30-second rounds before a longer benchmark typically add a few WPM to the real attempt.",
      },
      {
        q: "Do I need an account to save my score?",
        a: "No. Scores and history are stored in your browser automatically. The leaderboard is opt-in and needs only a display name.",
      },
    ],
    related: [
      { href: `${SITE_URL}/typing-test/1-minute/`, label: "1 Minute Typing Test — the standard benchmark" },
      { href: `${SITE_URL}/typing-test/15-second/`, label: "15 Second Typing Test — pure sprint" },
    ],
  },
  {
    slug: "typing-test/15-second",
    lang: "en",
    htmlLang: "en",
    ogLocale: "en_US",
    keyword: "15 second typing test",
    title: "15 Second Typing Test – Sprint Your WPM | Eletypes",
    description:
      "Free 15-second typing test: a pure burst-speed sprint. Great warm-up, instant WPM. No sign-up, no ads.",
    h1: "15 Second Typing Test",
    intro: [
      "Fifteen seconds is the sprint format: all burst, no pacing. It's the shortest standard timer, popularized by minimal typing tests, and it answers one question — how fast can your fingers go when fatigue isn't a factor? Expect your highest WPM numbers here, and don't compare them directly with longer tests.",
      "The real value of the 15-second test is as a training tool. It's the ideal warm-up (three quick rounds before a serious attempt), the fastest way to test a technique change, and the most addictive format for personal-best chasing — you can fit another attempt into any spare moment.",
      "Eletypes runs it free with no account: live WPM as you type, accuracy and consistency stats at the end, history charted locally over time. When you finally crack your record, the shareable result card is one click away.",
    ],
    cta: { text: "Start the 15-second sprint", href: `${SITE_URL}/?s=seo15s&t=15` },
    faqs: [
      {
        q: "Why is my 15-second WPM higher than my 1-minute WPM?",
        a: "That's normal. Short tests measure burst speed before fatigue and concentration lapses kick in. Your 60-second score is the more honest measure of sustained typing ability.",
      },
      {
        q: "Is the 15-second test good for practice?",
        a: "Yes — it's the best warm-up format and great for drilling specific weaknesses quickly. Just don't treat it as your only benchmark; mix in 60-second tests for the full picture.",
      },
      {
        q: "How is WPM calculated on such a short test?",
        a: "The same standard formula: (correct characters ÷ 5) ÷ minutes. With only 15 seconds, every error costs more, so accuracy matters enormously.",
      },
      {
        q: "Is it really free with no sign-up?",
        a: "Yes. No account, no ads, no tracking — open-source (GPL-3.0) and free forever.",
      },
    ],
    related: [
      { href: `${SITE_URL}/typing-test/30-second/`, label: "30 Second Typing Test — quick but steadier" },
      { href: `${SITE_URL}/typing-test/1-minute/`, label: "1 Minute Typing Test — the standard benchmark" },
    ],
  },
  {
    slug: "typing-test/90-second",
    lang: "en",
    htmlLang: "en",
    ogLocale: "en_US",
    keyword: "90 second typing test",
    title: "90 Second Typing Test – Endurance WPM Test | Eletypes",
    description:
      "Free 90-second typing test: the endurance format for your most reliable WPM. Consistency stats included, no sign-up.",
    h1: "90 Second Typing Test",
    intro: [
      "Ninety seconds is the endurance format — the longest standard timer, and the most honest measure of real typing ability. Burst speed fades after half a minute; what remains at 90 seconds is your sustainable pace, the number that actually predicts how fast you'll type an email, an essay, or a day's work.",
      "The key skill here is pacing, not sprinting. Start slightly below your max, keep a steady rhythm, and resist the urge to speed up when you see a familiar word — most 90-second scores are lost in the middle third, when concentration dips. Eletypes' consistency stats show exactly where your pace wavers.",
      "Free with no account, like everything here. Your 90-second history is charted locally alongside your shorter tests, so you can watch endurance improve independently of burst speed — and yes, the leaderboard and shareable result cards work for this format too.",
    ],
    cta: { text: "Start the 90-second test", href: `${SITE_URL}/?s=seo90s&t=90` },
    faqs: [
      {
        q: "Why take a 90-second test instead of 60 seconds?",
        a: "Longer tests are more reliable: luck and burst speed average out, leaving your true sustainable pace. If you want the single most honest WPM number, 90 seconds is it.",
      },
      {
        q: "How should I pace a 90-second test?",
        a: "Start at about 90% of your max and hold a metronome-steady rhythm. Sprinting early almost always costs more in errors and late-test slowdown than it gains.",
      },
      {
        q: "Will my WPM be lower than on short tests?",
        a: "Usually a few WPM lower, yes — that's the fatigue effect, and it's exactly what this format is designed to reveal. Track it separately from your sprint scores.",
      },
      {
        q: "Do I need to sign up to keep my endurance history?",
        a: "No. All history is stored in your browser automatically, with per-format trends so sprint and endurance progress stay separate.",
      },
    ],
    related: [
      { href: `${SITE_URL}/typing-test/1-minute/`, label: "1 Minute Typing Test — the standard benchmark" },
      { href: `${SITE_URL}/typing-test/30-second/`, label: "30 Second Typing Test — quicker check" },
    ],
  },
  {
    slug: "typing-test/english",
    lang: "en",
    htmlLang: "en",
    ogLocale: "en_US",
    keyword: "english typing test",
    title: "English Typing Test – Free QWERTY Speed Test | Eletypes",
    description:
      "Free English typing test on QWERTY: check your WPM and accuracy with the most common English words. No sign-up.",
    h1: "English Typing Test",
    intro: [
      "The English typing test is the default benchmark of the typing world: QWERTY layout, common English words, WPM scored the standard way. It's the format behind job requirements (“60 WPM required”), typing certificates, and nearly every speed comparison you've ever seen — if someone quotes a WPM number without qualification, this is the test they mean.",
      "Eletypes runs it on the 200 most common English words — the same practical vocabulary your fingers meet in real writing — with 15 to 90-second timers and live stats as you type. Prefer realism over randomness? Switch to sentence mode for full sentences with capitals and punctuation.",
      "No account, no ads, no tracking. History lives in your browser and charts your trend; the opt-in leaderboard needs only a display name; challenge links let friends race the exact same text.",
    ],
    cta: { text: "Start the English typing test", href: `${SITE_URL}/?s=seoen&l=en&t=60` },
    faqs: [
      {
        q: "What words are used in the English typing test?",
        a: "The 200 most common English words — the, be, to, of, and so on. Common words keep the test about typing skill rather than vocabulary knowledge, and they mirror real-world writing.",
      },
      {
        q: "What is a good English typing speed?",
        a: "40 WPM is a solid baseline, 60 is strong, 80+ is fast, 100+ is professional. Most office work is comfortable at 50–60 WPM with 97%+ accuracy.",
      },
      {
        q: "How is this different from the sentence mode?",
        a: "Word mode uses random common words (pure typing skill); sentence mode uses real sentences with capitals and punctuation (closer to actual writing, slightly harder).",
      },
      {
        q: "Is there a Chinese version?",
        a: "Yes — Eletypes has a dedicated Chinese (Pinyin) typing test with its own word lists and stats.",
      },
    ],
    related: [
      { href: `${SITE_URL}/typing-test/1-minute/`, label: "1 Minute Typing Test — the classic format" },
      { href: `${SITE_URL}/typing-test/sentence/`, label: "Sentence Typing Test — real-world practice" },
    ],
  },
  {
    slug: "typing-test/sentence",
    lang: "en",
    htmlLang: "en",
    ogLocale: "en_US",
    keyword: "sentence typing test",
    title: "Sentence Typing Test – Real-World Practice | Eletypes",
    description:
      "Free sentence typing test: type real sentences with capitals and punctuation — closer to actual writing than random words.",
    h1: "Sentence Typing Test",
    intro: [
      "Random words test pure finger speed; real sentences test actual typing. Sentence mode serves complete sentences — capitals at the start, commas and periods in the middle — which means your Shift key, your punctuation reach, and your reading-ahead all get exercised. It's noticeably harder than word mode, and noticeably closer to the typing you do all day.",
      "That's what makes it the best practice format for real-world speed. Emails, essays, code comments, chat messages — none of them are random word salad. Training on sentences builds the exact coordination (capital → word → comma → space, without breaking rhythm) that word-mode tests never touch.",
      "Clicking through sets sentence mode in the app — no account needed, as always. Your sentence-mode scores are tracked separately from word mode, so both trends stay honest, and the full stats, leaderboard, and challenge links all work here too.",
    ],
    cta: { text: "Practice sentence typing", href: `${SITE_URL}/?mode=sentence` },
    faqs: [
      {
        q: "Why is sentence mode harder than word mode?",
        a: "Capitals require Shift coordination, punctuation breaks your rhythm, and you have to read ahead instead of reacting word by word. Most people score 5–15 WPM lower in sentence mode at first.",
      },
      {
        q: "Is sentence typing better practice than random words?",
        a: "For real-world speed, yes — it trains the exact patterns of actual writing. For pure finger speed and personal-best chasing, word mode is still king. Serious practicers do both.",
      },
      {
        q: "Does sentence mode change how WPM is calculated?",
        a: "No — the same standard formula applies. Punctuation and capitals count as characters like everything else, which is part of why scores run lower.",
      },
      {
        q: "Do I need an account?",
        a: "No. Sentence mode is one click, no sign-up, and your sentence-mode history is stored locally like everything else.",
      },
    ],
    related: [
      { href: `${SITE_URL}/typing-test/english/`, label: "English Typing Test — the word-mode benchmark" },
      { href: `${SITE_URL}/typing-test/1-minute/`, label: "1 Minute Typing Test — the classic format" },
    ],
  },
  {
    slug: "vocabulary",
    lang: "zh",
    htmlLang: "zh-CN",
    ogLocale: "zh_CN",
    keyword: "打字背单词",
    title: "打字背单词 - 用键盘记住拼写 | Eletypes",
    description:
      "用打字背单词：四级、六级、托福、GRE 词库分章节练习，拼对才算过，默写模式自测。免费免注册。",
    h1: "打字背单词",
    intro: [
      "背单词最大的坑是“认识但写不对”：阅读时眼熟，写作翻译时调不出来。只看不写练的是再认（recognition），而考试要的是回忆（recall）——打字背单词逼你完整输出每个字母的拼写，错一个就得重来，练的正好是输出通道。",
      "Eletypes 内置四套词库：CET-4、CET-6、TOEFL、GRE，全部按章节划分。每章单词配有释义和例句，敲对拼写才算通过；recite（默写）模式把单词藏起来只留释义，考前自测一测便知是真记住了还是“以为记住了”。",
      "全部免费、免注册，进度存在本地浏览器。建议节奏：每天一章新词 + 默写模式复习旧词；背完还能把词表当作打字测试的自定义词库，在计时模式里再练一轮速度。",
    ],
    cta: { text: "从四级单词开始", href: `${SITE_URL}/?deck=CET4` },
    faqs: [
      {
        q: "打字背单词适合我吗？",
        a: "如果你“看得懂但写不对”，特别适合。它主攻拼写输出，和百词斩这类主攻“认识”的 App 是互补关系，不冲突。",
      },
      {
        q: "有哪些词库？",
        a: "CET-4、CET-6、TOEFL、GRE 四套，全部按章节划分，可分章练习、跳章复习，默写模式通用。",
      },
      {
        q: "需要下载 App 或注册吗？",
        a: "都不需要。网页打开即用，学习进度保存在本地浏览器。",
      },
      {
        q: "完全免费吗？",
        a: "是。Eletypes 是开源项目（GPL-3.0），无广告、无内购。",
      },
    ],
    related: [
      { href: `${SITE_URL}/vocabulary/cet4/`, label: "打字背四级单词 — 从四级起步" },
      { href: `${SITE_URL}/vocabulary/toefl/`, label: "打字背托福单词 — 进阶词汇" },
    ],
  },
  {
    slug: "vocabulary/cet6",
    lang: "zh",
    htmlLang: "zh-CN",
    ogLocale: "zh_CN",
    keyword: "六级词汇",
    title: "打字背六级单词 - CET-6 词汇拼写训练 | Eletypes",
    description:
      "用打字背六级单词：CET-6 词库分章节练习，拼对才算过，默写模式自测。免费免注册，进度保存在本地。",
    h1: "打字背六级单词",
    intro: [
      "过了四级，六级的难不是多背两千个词，而是词变长了、变学术了、长得还都差不多：accommodate 和 accumulate、conscious 和 consensus——阅读时能蒙对，写作时一拼写就露馅。六级写作和翻译考的正是输出，恰恰是“认识但写不对”的重灾区。",
      "Eletypes 的 CET-6 词库按章节划分，每个单词配释义和例句。练习时必须完整敲出拼写，错一个字母就得重来，这种“错误阻断”逼你记住最容易混淆的字母组合；recite（默写）模式只给释义不给单词，适合考前检验是不是真记住了。",
      "建议从四级词库的默写模式热身，确认基础拼写没问题再进六级。全部免费、免注册，进度存在本地，每天 15–20 分钟，写作时能调出来的词才是真正记住的词。",
    ],
    cta: { text: "开始六级词汇练习", href: `${SITE_URL}/?deck=CET6` },
    faqs: [
      {
        q: "四级和六级词汇最大的区别是什么？",
        a: "六级词更长、更学术、形近词更多，对拼写输出的要求明显更高。这也是六级写作和翻译容易丢分的原因——不是没背过，是写不对。",
      },
      {
        q: "直接背六级还是先过四级？",
        a: "建议先用四级词库的默写模式自测：如果四级词能稳定拼对，再进六级；如果四级还有大量拼写错误，先补四级。",
      },
      {
        q: "有例句和释义吗？",
        a: "有。每个单词配有中文释义和英文例句/短语，默写模式下释义保留、单词隐藏。",
      },
      {
        q: "免费吗？要注册吗？",
        a: "免费，免注册。Eletypes 是开源项目（GPL-3.0），无广告。",
      },
    ],
    related: [
      { href: `${SITE_URL}/vocabulary/cet4/`, label: "打字背四级单词 — 先夯实基础" },
      { href: `${SITE_URL}/vocabulary/gre/`, label: "打字背GRE单词 — 继续进阶" },
    ],
  },
  {
    slug: "vocabulary/gre",
    lang: "zh",
    htmlLang: "zh-CN",
    ogLocale: "zh_CN",
    keyword: "GRE词汇",
    title: "打字背GRE单词 - GRE 词汇拼写训练 | Eletypes",
    description:
      "用打字背GRE单词：GRE 词库分章节练习，再长的词也得亲手拼对，默写模式自测。免费免注册。",
    h1: "打字背GRE单词",
    intro: [
      "GRE 词汇是背单词鄙视链的顶端：词长、抽象、还爱考那些平时根本见不到的词。更要命的是，GRE 对词汇的要求不只是“认识”——verbal 部分的填空和阅读都建立在精准辨义上，而写作部分则要求你完整准确地输出。拼错一个字母，意思可能就全变了。",
      "Eletypes 的 GRE 词库按章节划分，每个单词配释义和例句。再长的词，在这里也得亲手一个字母一个字母敲对，错了就重来——这种强制输出对 GRE 这种“长词重灾区”特别有效，因为它逼你记住的正是那些平时扫一眼就过的字母组合。recite（默写）模式只给释义，适合考前自测。",
      "建议的学习顺序：CET-4 → CET-6 → TOEFL → GRE，逐级用默写模式检验。全部免费、免注册，进度存在本地。",
    ],
    cta: { text: "开始GRE词汇练习", href: `${SITE_URL}/?deck=GRE` },
    faqs: [
      {
        q: "GRE 词汇用打字背有什么特别的好处？",
        a: "GRE 词普遍偏长，拼写错误率高。打字强制完整输出，能系统性消灭“大概记得但拼不对”的词——而这正是 GRE 写作和填空最容易丢分的地方。",
      },
      {
        q: "零基础可以直接背 GRE 吗？",
        a: "不建议。GRE 词库假设你已掌握四六级/托福基础。先用 CET-4/CET-6/TOEFL 的默写模式逐级检验，再进 GRE，效率高得多。",
      },
      {
        q: "单词有释义和例句吗？",
        a: "有。每个单词配有中文释义和英文例句/短语；默写模式下释义保留、单词隐藏，逼你凭记忆输出。",
      },
      {
        q: "免费吗？要注册吗？",
        a: "免费，免注册。Eletypes 是开源项目（GPL-3.0），无广告、无内购。",
      },
    ],
    related: [
      { href: `${SITE_URL}/vocabulary/toefl/`, label: "打字背托福单词 — 先过托福" },
      { href: `${SITE_URL}/vocabulary/cet6/`, label: "打字背六级单词 — 逐级进阶" },
    ],
  },
];
