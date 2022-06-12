# Ele types

<img width="1109" alt="Screen Shot 2022-06-09 at 11 12 57 PM" src="https://user-images.githubusercontent.com/39578778/173113155-86dd9bdf-8d0a-4c6f-b26f-6e0ebd8a75b4.png">


## [www.eletypes.com](https://www.eletypes.com) ![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/gamer-ai/eletype-frontend?include_prereleases)

An elegant typing test tool.


[![GitHub issues](https://img.shields.io/github/issues/gamer-ai/eletype-frontend)](https://github.com/gamer-ai/eletype-frontend/issues)
[![GitHub stars](https://img.shields.io/github/stars/gamer-ai/eletype-frontend)](https://github.com/gamer-ai/eletype-frontend/stargazers)


> Typing rule and interactions was inspired by the famous [monkeytype.com](www.monkeytype.com);

> The app was created purely in react.

## Feature:

1. Type any to start
2. Typing error feed back
3. Extra input feed back
4. Random words generation (two sources, normal mode from top 1000 frequent words, hard mode from blog posts random words)
5. Rewind modification till the last correct word input
6. Caps Lock key detection
7. Tab key disabled
8. support three tests duration 60s, 30s, 15s
9. support difficulty level change
10. support different themes
11. support focus mode
12. support spotify (enable/disable, compact/full modes) (To Use the full feature of spotify, you will need to login to spotify in browser first)
13. WPM, Char (correct/incorrect/missing/extra) stats, accuracy stats, raw KPM stat
14. restart test with current settings
15. Stats to show at test finished
16. local persist storage for themes, difficulty mode, focused mode, timer settings.

### Themes:

<img width="789" alt="Screen Shot 2022-06-10 at 9 48 35 AM" src="https://user-images.githubusercontent.com/39578778/173113712-b2f0f1d0-7ca3-4ae6-b806-6cc3cbcbaf0d.png">

Current Themes:

- Dark
- Terminal (matrix inspired)
- Cyber (cyberpunk inspired)
- Steam (steampunk inspired)
- Light

### Caps Lock Detection

<img width="988" alt="Screen Shot 2022-04-20 at 4 52 24 PM" src="https://user-images.githubusercontent.com/39578778/164343051-2de97570-fcec-49a4-893a-903afe94e5f4.png">

### Simplist typing Stats is all your need

<img width="491" alt="Screen Shot 2022-06-10 at 9 50 46 AM" src="https://user-images.githubusercontent.com/39578778/173114000-a5f9aa89-6b3c-4e35-98e3-b410421a83c7.png">

### Focus Mode

Focus mode will move header to footer. hide the setting menu. leave only timer, wpm. If music enabled, a compact spotify will be put in footer.

### More to come

> Requests from the community brief*

#### Feature Request
1. Support CHN pinyin. (working)

#### Implementation improvements
1. Standalone source words file.

#### Done requests:
1. localStorage persist states for theme, timer, difficulty, focused mode settings.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


### `npm run build`


Builds the app for production to the `build` folder.\






