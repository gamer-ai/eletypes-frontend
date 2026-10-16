/**
 * landingParams — deep links from SEO landing pages into the app.
 *
 * Supported query params (all optional, validated):
 *   timer=15|30|60|90        -> timer preset ("timer-constant")
 *   lang=en|cn               -> English / Chinese pinyin mode ("language")
 *   mode=words|sentence      -> word / sentence game mode ("game-mode")
 *   deck=GRE|TOEFL|CET6|CET4 -> vocab deck, opens Words Card mode
 *                              ("DictionaryCatalog" + "IsInWordsCardMode")
 *
 * Mirrors the existing challenge-link pattern in App.jsx: validated values are
 * written to the same localStorage keys the app already reads, then the query
 * string is cleaned with history.replaceState. Challenge links (?s=...) take
 * precedence and skip this entirely.
 */

const VALID_TIMERS = [15, 30, 60, 90];
const VALID_DECKS = ["GRE", "TOEFL", "CET6", "CET4"];

export const applyLandingParams = () => {
  const params = new URLSearchParams(window.location.search);
  if (params.has("s")) return false; // challenge link wins
  const hasAny =
    params.has("timer") || params.has("lang") || params.has("mode") || params.has("deck");
  if (!hasAny) return false;

  const timer = parseInt(params.get("timer") || "", 10);
  if (VALID_TIMERS.includes(timer)) {
    window.localStorage.setItem("timer-constant", JSON.stringify(timer));
  }

  const lang = params.get("lang");
  if (lang === "cn") {
    window.localStorage.setItem("language", JSON.stringify("CHINESE_MODE"));
  } else if (lang === "en") {
    window.localStorage.setItem("language", JSON.stringify("ENGLISH_MODE"));
  }

  const mode = params.get("mode");
  if (mode === "sentence") {
    window.localStorage.setItem("game-mode", JSON.stringify("SENTENCE_MODE"));
  } else if (mode === "words") {
    window.localStorage.setItem("game-mode", JSON.stringify("WORD_MODE"));
  }

  const deck = (params.get("deck") || "").toUpperCase();
  if (VALID_DECKS.includes(deck)) {
    // Preselect the deck's first chapter so the user lands directly in practice.
    // (Same localStorage shape WordsCard itself writes.)
    window.localStorage.setItem("DictionaryCatalog", JSON.stringify({ [deck]: ["a"] }));
    window.localStorage.setItem("currChapter", JSON.stringify("a"));
    window.localStorage.setItem("currIndex", JSON.stringify(0));
    window.localStorage.setItem("IsInWordsCardMode", JSON.stringify(true));
    window.localStorage.setItem("game-mode", JSON.stringify("WORD_MODE"));
  }

  window.history.replaceState({}, "", window.location.pathname);
  return true;
};
