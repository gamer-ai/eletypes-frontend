import GREWordsInterpretations from "../assets/Vocab/GREWords.json";
import TOEFLWordsInterpretations from "../assets/Vocab/TOEFLWords.json";
import CET6WordsInterpretations from "../assets/Vocab/CET6Words.json";
import CET4WordsInterpretations from "../assets/Vocab/CET4Words.json"

const GRE_WORDS = GREWordsInterpretations;
const TOEFL_WORDS = TOEFLWordsInterpretations;
const CET6_WORDS = CET6WordsInterpretations;
const CET4_WORDS = CET4WordsInterpretations;

const GRE_WORDS_CATALOG = {
  a: [0, 502],
  b: [503, 742],
  c: [743, 1382],
  d: [1383, 1836],
  e: [1837, 2171],
  f: [2172, 2436],
  g: [2437, 2637],
  h: [2638, 2813],
  i: [2814, 3231],
  j: [3232, 3275],
  k: [3276, 3294],
  l: [3295, 3471],
  m: [3472, 3771],
  n: [3772, 3858],
  o: [3859, 4021],
  p: [4022, 4576],
  q: [4577, 4605],
  r: [4606, 4954],
  s: [4955, 5584],
  t: [5585, 5834],
  u: [5835, 5959],
  v: [5960, 6095],
  w: [6096, 6176],
  x: [6177, 6178],
  y: [6179, 6186],
  z: [6187, 6192],
};

const TOEFL_WORDS_CATALOG = {
  a: [0, 288],
  b: [289, 414],
  c: [415, 741],
  d: [742, 998],
  e: [999, 1209],
  f: [1210, 1342],
  g: [1343, 1427],
  h: [1428, 1507],
  i: [1508, 1727],
  j: [1728, 1743],
  k: [1744, 1748],
  l: [1749, 1812],
  m: [1813, 1909],
  n: [1910, 1943],
  o: [1944, 2004],
  p: [2005, 2183],
  q: [2184, 2194],
  r: [2195, 2350],
  s: [2351, 2627],
  t: [2628, 2738],
  u: [2739, 2772],
  v: [2773, 2829],
  w: [2830, 2860],
  x: [4508, 4508],
  y: [2861, 2864],
  z: [4513, 4515],
};

const CET6_WORDS_CATALOG = {
  a: [0, 178],
  b: [179, 264],
  c: [265, 555],
  d: [556, 724],
  e: [725, 868],
  f: [869, 963],
  g: [964, 1014],
  h: [1015, 1066],
  i: [1067, 1210],
  j: [1211, 1216],
  k: [1217, 1222],
  l: [1223, 1277],
  m: [1278, 1381],
  n: [1382, 1411],
  o: [1412, 1478],
  p: [1479, 1667],
  q: [1668, 1679],
  r: [1680, 1831],
  s: [1832, 2072],
  t: [2073, 2167],
  u: [2168, 2188],
  v: [2189, 2239],
  w: [2240, 2267],
  x: [2273, 2273],
  y: [2268, 2272],
  z: [2272, 2272],
};

const CET4_WORDS_CATALOG = {
  a: [0, 292],
  b: [293, 518],
  c: [519, 951],
  d: [952, 1194],
  e: [1195, 1405],
  f: [1406, 1627],
  g: [1628, 1757],
  h: [1758, 1907],
  i: [1908, 2078],
  j: [2079, 2114],
  k: [2115, 2142],
  l: [2143, 2311],
  m: [2312, 2537],
  n: [2538, 2633],
  o: [2634, 2756],
  p: [2757, 3129],
  q: [3130, 3150],
  r: [3151, 3437],
  s: [3438, 4013],
  t: [4014, 4281],
  u: [4282, 4363],
  v: [4364, 4437],
  w: [4438, 4588],
  x: [4589, 4589],
  y: [4590, 4607],
  z: [4608, 4613],
};

const DICTIONARY_SOURCE_CATALOG = {
  GRE: GRE_WORDS_CATALOG,
  TOEFL: TOEFL_WORDS_CATALOG,
  CET6: CET6_WORDS_CATALOG,
  CET4: CET4_WORDS_CATALOG
};

const VOCAB_DICTIONARIES = {
  GRE: GRE_WORDS,
  TOEFL: TOEFL_WORDS,
  CET6: CET6_WORDS,
  CET4: CET4_WORDS
};

const VOCAB_ORDER_OPTIONS = ["random", "alphabet"];

export {
  GRE_WORDS,
  GRE_WORDS_CATALOG,
  DICTIONARY_SOURCE_CATALOG,
  VOCAB_ORDER_OPTIONS,
  VOCAB_DICTIONARIES,
};
