# Ele types

<img width="1000" alt="Screen Shot 2022-08-28 at 9 15 36 AM" src="https://user-images.githubusercontent.com/39578778/187084111-97d69aa7-53e4-46b9-b156-3ecc4d180d08.png">

## [www.eletypes.com](https://www.eletypes.com) ![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/gamer-ai/eletype-frontend?include_prereleases) ![GitHub stars](https://img.shields.io/github/stars/gamer-ai/eletype-frontend?style=social) ![GitHub forks](https://img.shields.io/github/forks/gamer-ai/eletype-frontend?style=social)

An elegant typing test tool.

> Typing rule and interactions was inspired by the famous [monkeytype.com](www.monkeytype.com);

> The app was created purely in react.


## Feature Requests / Issues / Bug Reports

[![GitHub issues](https://img.shields.io/github/issues/gamer-ai/eletype-frontend)](https://github.com/gamer-ai/eletype-frontend/issues)

https://github.com/gamer-ai/eletype-frontend/issues

## Community Channel:

![Discord](https://img.shields.io/discord/993567075589181621?style=for-the-badge)

To join the community, please go to the website and hit "discord" icon.

## Current Features:

#### 1. Typing Test (words, sentence)

  - words mode
    - Eng Hard: Random blogs Words data source
    - Eng Normal: Top 1000 most frequent used English words
    - CHN Pinyin Hard: Chinese top 1500 idioms
    - CHN Pinyin Normal: Chinese top 5000 words/char
    - support four tests duration 90s, 60s, 30s, 15s
    - + Numbers: add random numbers from 0-99 at the end of the regenerated word
    - + Symbols: add random symbols at the end of the regenerated words
  - Sentence mode
    - CHN: Random chinese short sentences
    - ENG: Random English short sentences
    - Support three sentences count setting: 5, 10, 15
  - Stats:
    - WPM
    - KPM
    - Accuracy
    - Error analysis (correct/error/missing/extra chars count)
    - Visualizations
  - Pacing Style (word pulse/ character caret):
    - Pulse mode: the active word will have an underline pulse, which helps improve the speed typing habit.
    - Caret mode: a pacing caret, advancing character by character, which aligns normal typing habit.

#### 2. Words Card (for English learners)

  - Vocabulary Source
    - GRE vocab
    - TOEFL
    - CET6
    - CET4
  - Multi Chapters Selection
  - Words Card Navigation UI
  - Recite Mode (word visibility off while phrase shown)
  
#### 3. Coffee Mode

 - free typing mode for test typing anything

#### 4. QWERTY Keyboard touch-typing trainer 

 - A QWERTY keyboard layout UI populating random key for touch typing with stats

#### 5. Spotify player

 - A spotify player 
 
#### 6. Themes Collection

- Static Themes

  - Dark
  - Tokyo night
  - Piano
  - Aluminum
  - Terminal (matrix inspired)
  - Cyber (cyberpunk inspired)
  - Steam (steampunk inspired)
  - Light
  - Nintendo
  - Araki Nobuyoshi
  - Hero
  - Budapest
  - Cool Kid
  - EdgeRunner (cyberpunk 2077 edgerunners episodes inspired)

- Dynamic Themes (WebGL based, may degrade performance. experimental feature. Component Library used from [UV canvas](https://uvcanvas.com/))

  - Tranquiluxe,
  - Lumiflex,
  - Opulento,
  - Velustro

![dynamicThemesDemo](https://github.com/gamer-ai/eletypes-frontend/assets/39578778/d716a287-6f59-4568-8276-1ee6b5f5850a)

  
#### 7. LocalStorage persist for essential settings

  - Browser refresh will bring back to the localStorage stored settings

#### 8. Focus Mode

  - move header to footer. 
  - hide the setting menu. leave only timer, wpm stats. 
  - If music enabled, a compact spotify will be put in footer.

#### 9. Ultra Zen Mode

![image](https://github.com/user-attachments/assets/ab3e7c94-4f38-4607-86aa-1cd3d8296381)

toggle ![image](https://github.com/user-attachments/assets/b552b444-f411-4a1d-a40a-981b05e3e59d) to use the ultra zen mode when in words mode. The ultra zen mode can auto highlight and auto dim while you are typing. 

 
#### 10. Typing Sound Effect

  - default: cherry blue switch
  - optional: keyboard (hard)
  - optional: typewriter (soft)
  
  <img width="120" alt="Screen Shot 2022-09-29 at 2 01 51 AM" src="https://user-images.githubusercontent.com/39578778/192989337-637e1154-fbca-420b-babb-22846d5dbdb1.png">
  
#### 11. [Tab] key to Fast redo/reset

  - [Tab] + [Space] for quickly redo
  - [Tab] + [Enter] / [Tab] + [Tab] for quickly reset
  - [Tab] + [Any Key] to exit the dialog


### Some Themes

<img width="600" alt="EletypesThemes" src="https://user-images.githubusercontent.com/39578778/187084245-364b6c5f-97e4-42c9-a0c6-010505ad3283.png">

### Caps Lock Detection

<img width="400" alt="Screen Shot 2022-04-20 at 4 52 24 PM" src="https://user-images.githubusercontent.com/39578778/164343051-2de97570-fcec-49a4-893a-903afe94e5f4.png">

### Simplist typing stats is all your need

<img width="800" alt="Screen Shot 2022-08-28 at 9 24 55 AM" src="https://user-images.githubusercontent.com/39578778/187084372-a4d18d33-286e-4e7b-97d0-d069c7fd1d53.png">

### Words Card Demo

Regular Mode and Recite Mode

<img width="400" alt="Screen Shot 2022-08-23 at 12 47 53 AM" src="https://user-images.githubusercontent.com/39578778/186102023-7db8bfc2-f481-4a90-98c2-f47ad66c12cd.png"><img width="400" alt="Screen Shot 2022-08-23 at 12 48 22 AM" src="https://user-images.githubusercontent.com/39578778/186102059-cb7d43a4-a9d3-4728-90f9-2965038ed24c.png">

### QWERTY Touch-Typing Trainer Demo

<img width="800" alt="Screen Shot 2022-08-23 at 12 52 17 AM" src="https://user-images.githubusercontent.com/39578778/186102830-4c664e9a-adfa-48dc-ba8c-e03df4e22ade.png">


## For Devs

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the `build` folder.\

### Pull Requests

Create a branch with proper name example 'feat/your-cool-feature', create the pull request and add authors for reviews. Please include description with details.


## Sponsors

### Buy Me A Coffee:

https://www.buymeacoffee.com/daguozi

## Credits

Thanks [@rendi12345678](https://github.com/rendi12345678) for his continuous contributions and making the feature of data visualization for the typing stats!






