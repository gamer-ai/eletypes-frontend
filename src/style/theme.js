const lightTheme = {
  label: "Light",
  background: "#F5F5F5",
  text: "#000000",
  gradient: "linear-gradient(315deg, #74ebd5 0%, #ACB6E5 94%)",
  title: "#2979ff",
  textTypeBox: "#9E9E9E",
  stats: "#3D5AFE",
  fontFamily: "sans-serif",
};

const darkTheme = {
  label: "Dark",
  background: "#121212",
  text: "#FAFAFA",
  gradient: "linear-gradient(315deg, #F7971E 0%, #FFD200 94%)",
  title: "#ffc107",
  textTypeBox: "#706d6d",
  stats: "#BB86FC",
  fontFamily: "sans-serif",
};

const cyberTheme = {
  label: "Cyber",
  background: "#272932",
  text: "#CB1DCD",
  gradient: "linear-gradient(315deg, #FDF500 0%, #CB1DCD 94%)",
  title: "#FDF500",
  textTypeBox: "#D1C5C0",
  stats: "#00ff9f",
  fontFamily: "Tomorrow",
};

const steamTheme = {
  label: "Steam",
  background: "#6e2f3b",
  text: "#fdd978",
  gradient: "linear-gradient(315deg, #80acaa 0%, #fdd978 94%)",
  title: "#2b211e",
  textTypeBox: "#605542",
  stats: "#80acaa",
  fontFamily: "Tomorrow",
};

const terminalTheme = {
  label: "Terminal",
  background: "#0D0208",
  text: "#39ff14",
  gradient: "linear-gradient(315deg, #39ff14 0%, #008F11 94%)",
  title: "#008F11",
  textTypeBox: "#706d6d",
  stats: "#39ff14",
  fontFamily: "Tomorrow",
};

const nintendoTheme = {
  label: "Nintendo",
  background: "#000000",
  text: "#00c3e3",
  gradient: "linear-gradient(90deg, 	#dd2020 0%, #00c3e3 100%)",
  title: "#dd2020",
  textTypeBox: "#a5a2a2",
  stats: "#00c3e3",
  fontFamily: "Tomorrow",
};

const arakiNobuyoshiTheme = {
  label: "Araki Nobuyoshi",
  background: "#232335",
  text: "#086063",
  gradient: "linear-gradient(90deg, 	#232335 0%, #0a4951 100%)",
  title: "#B42D2C",
  textTypeBox: "#CCB1B0",
  stats: "#1a5426",
  fontFamily: "sans-serif",
};

const heroTheme = {
  label: "Hero",
  background: "#440402",
  text: "#3A3E47",
  gradient: "linear-gradient(90deg, 	#70A960 0%, #76C9A5 100%)",
  title: "#B80100",
  textTypeBox: "#CD6A5A",
  stats: "#6A839D",
  fontFamily: "sans-serif",
};

const budapestTheme = {
  label: "Budapest",
  background:
    "linear-gradient(to right, #d48fa2,#d48fa2 15%,#74647f 15%, #74647f 85%,#d48fa2 85%);",
  text: "#b1b7cd",
  gradient: "linear-gradient(90deg, 	#d48fa2 0%, #74647f 100%)",
  title: "#647e99",
  textTypeBox: "#ecca9c",
  stats: "#be9198",
  fontFamily: "sans-serif",
};

const eva01Theme = {
  label: "EVA-01",
  background: "#6d45a1",
  text: "#1d1a2f",
  gradient: "linear-gradient(90deg, 	#3f6d4e 0%, #52d053 100%)",
  title: "#52d053",
  textTypeBox: "#50b349",
  stats: "#1d1a2f",
  fontFamily: "Tomorrow",
};

const aluminiumTheme = {
  label: "Aluminium",
  background: "linear-gradient(to left top, rgba(0, 0, 0, 0.25),  #888B8D)",
  text: "#353535",
  gradient: "linear-gradient(90deg, #888B8D 0%, #FAF9F6 100%)",
  title: "#2f2f2f",
  textTypeBox: "#FAF9F6",
  stats: "#2D3436",
  fontFamily: "Rufina",
  textShadow: "0px -1px 0px rgba(0,0,0,0.3)"
};

const pianoTheme = {
  label: "Piano",
  background: "linear-gradient(to bottom,  #000, #222)",
  text: "#FAF9F6",
  gradient: "linear-gradient(90deg, #000 0%, #222 100%)",
  title: "#f5f2e7",
  textTypeBox: "#555",
  stats: "#FAF9F6",
  fontFamily: "Rufina",
  textShadow: "0px -1px 0px rgba(0,0,0,0.3)"
};

const coolKidTheme = {
  label: "Cool Kid",
  background: "#112E96",
  text: "#EA00BA",
  gradient: "linear-gradient(to top,  #16C4ED, #EA00BA)",
  title: "#ECECEC",
  textTypeBox: "#090261",
  stats: "#EA00BA",
  fontFamily: "Tomorrow",
  textShadow: "0px -1px 0px rgba(0,0,0,0.3)"
};

const edgeRunnerTheme = {
  label: "Edgerunner",
  background: "#FCEE09",
  text: "#FE00FE",
  gradient: "linear-gradient(to top,  #59F13F, #FE00FE)",
  title: "#FE00FE",
  textTypeBox: "#D1C5C0",
  stats: "#FE00FE",
  fontFamily: "Tomorrow",
  textShadow: "0 0 2vw #E7E7E3"
};

const defaultTheme = darkTheme;

const themesOptions = [
  { value: darkTheme, label: "Dark" },
  { value: aluminiumTheme, label: "Aluminium" },
  { value: pianoTheme, label: "Piano" },
  { value: terminalTheme, label: "Terminal" },
  { value: nintendoTheme, label: "Nintendo" },
  { value: cyberTheme, label: "Cyber" },
  { value: edgeRunnerTheme, label: "Edgerunner" },
  { value: eva01Theme, label: "EVA-01" },
  { value: steamTheme, label: "Steam" },
  { value: arakiNobuyoshiTheme, label: "Araki Nobuyoshi" },
  { value: heroTheme, label: "Hero" },
  { value: coolKidTheme, label: "Cool Kid" },
  { value: budapestTheme, label: "Budapest" },
  { value: lightTheme, label: "Light" }
];

export {
  lightTheme,
  darkTheme,
  cyberTheme,
  eva01Theme,
  steamTheme,
  terminalTheme,
  nintendoTheme,
  arakiNobuyoshiTheme,
  heroTheme,
  coolKidTheme,
  budapestTheme,
  aluminiumTheme,
  pianoTheme,
  defaultTheme,
  themesOptions,
  edgeRunnerTheme
};
