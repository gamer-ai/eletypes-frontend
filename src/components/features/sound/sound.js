import typeSoft from "../../../assets/sound/typeSoft.wav";
import keyboard from "../../../assets/sound/keyboard.wav";
import cherryBlue from "../../../assets/sound/cherryBlue.wav";

const SOUND_MAP = {
    "keyboard" : keyboard,
    "typewriter": typeSoft,
    "cherry": cherryBlue
}

const soundOptions = [
  { label: "keyboard" },
  { label: "typewriter" },
  { label: "cherry" },
];

const DEFAULT_SOUND_TYPE = "cherry";
const SOUND_MODE = "sound";
const DEFAULT_SOUND_TYPE_KEY = "sound-type";
const SOUND_MODE_TOOLTIP = "typing sound";

export { soundOptions, DEFAULT_SOUND_TYPE, DEFAULT_SOUND_TYPE_KEY, SOUND_MODE, SOUND_MODE_TOOLTIP, SOUND_MAP };
