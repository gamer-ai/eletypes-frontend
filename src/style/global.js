import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }
  body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    padding: 0;
    margin: 0;
    font-family: ${({ theme }) => theme.fontFamily};
    transition: all 0.25s linear;
  }
  .canvas {
      align-items: center;
      display: grid;
      gap: 0.5rem;
      grid-auto-flow: row;
      grid-template-rows: auto 1fr auto;
      min-height: 100vh;
      padding: 1rem;
      transition: padding-top .125s;
      width: 100vw;
  }
  .header {
    position: relative;
    display: block;
    align-items: center;
    justify-content: center;
    padding-bottom: 3%;
    top: 0;
    left:0;
    width: 100%;
    text-align: center;
  }
  .footer {
    font-size: .75rem;
    line-height: 1rem;
    padding: 0;
    position: relative;
    text-align: center;
  }
  .bottom-info {
    color: ${({ theme }) => theme.title};
    margin: 4px;
  }
  small {
    display: block;
  }
  button {
    display: block;
  }
  h1 {
    color: ${({ theme }) => theme.title};
    opacity: 0.9;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  h3{
    margin-right: 10px;
  }
  h4{
    margin-right: 10px;
    opacity: 0.7;
  }
  .stats {
    display: block;
    max-width: 1000px;
    margin-top: 50px;
    margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
    color: ${({ theme }) => theme.stats};
    bottom: 10%;
  }
  .sub-header {
    color: ${({ theme }) => theme.textTypeBox};
    opacity: 0.5;
    border-right: 2px solid;
    animation: blinkingCursor 2s infinite;;
    @keyframes blinkingCursor{
      0%		{ border-right-color: ${({ theme }) => theme.stats};}
      25%		{ border-right-color: white;}
      50%		{ border-right-color: ${({ theme }) => theme.stats};}
      75%		{border-right-color: white;}
      100%	{border-right-color: ${({ theme }) => theme.stats};}
    }
  }
  .type-box {
    display: block;
    max-width: 1000px;
    height: 140px;
    overflow: hidden;
    margin-left: auto;
    margin-right: auto;
    position: relative
    top: 10%;
    @media only screen 
    and (min-device-width: 375px) 
    and (max-device-width: 812px) 
    and (-webkit-min-device-pixel-ratio: 3) { 
      top:200px;
      width: 60%;
    }
  }
  .type-box-chinese {
    display: block;
    max-width: 1000px;
    height: 240px;
    overflow: hidden;
    margin-left: auto;
    margin-right: auto;
    position: relative
    top: 10%;
    @media only screen 
    and (min-device-width: 375px) 
    and (max-device-width: 812px) 
    and (-webkit-min-device-pixel-ratio: 3) { 
      top:200px;
      width: 60%;
    }
  }
  .words{
    color: ${({ theme }) => theme.textTypeBox};
    font-size: 28px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    align-content: center;
    user-select: none;
  }
  .word{
    margin: 5px 5px;
    display: flex;
    padding-right: 2px;
    border-bottom: 1px solid transparent;
    border-top: 1px solid transparent;
    scroll-margin: 4px;
  }
  .active-word{
    animation: blinkingBackground 2s infinite;
    border-bottom: 1px solid;
    @keyframes blinkingBackground{
      0%		{ border-bottom-color: ${({ theme }) => theme.stats};}
      25%		{ border-bottom-color: white;}
      50%		{ border-bottom-color: ${({ theme }) => theme.stats};}
      75%		{border-bottom-color: white;}
      100%	        {border-bottom-color: ${({ theme }) => theme.stats};}
    }
  }
  .error-word{
    border-bottom: 1px solid red;
    scroll-margin: 4px;
  }
  .char{
    padding-right: 1px;
  }
  .correct-char{
    color: ${({ theme }) => theme.text};
    padding-right: 1px;
  }
  .error-char{
    color: red;
    padding-right: 1px;
  }

  .hidden-input{
    opacity:0;
    filter:alpha(opacity=0);
  }
  .select {
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.background};
    border: none;
    min-width: 5%;
  }
  .restart-button{
    margin-left: auto;
    margin-right: auto;
    width: 8em
  }
  .alert{
    opacity: 0.3;
    background-image: ${({ theme }) => theme.gradient};
  }
  .correct-char-stats{
    color: ${({ theme }) => theme.text};
  }
  .incorrect-char-stats{
    color: red;
  }
  .missing-char-stats{
    color: ${({ theme }) => theme.textTypeBox};
  }
  .speedbar{
    opacity: 0.3;
    color:  ${({ theme }) => theme.stats};
  }
  .active-button{
    color: ${({ theme }) => theme.stats};
  }
  .inactive-button{
    color: ${({ theme }) => theme.textTypeBox};
  }
  .zen-button{
    color: ${({ theme }) => theme.stats};
  }
  .zen-button-deactive{
    color: ${({ theme }) => theme.textTypeBox};
  }
  .support-me{
    color : #FF4081;
    animation: blinkingColor 10s infinite;
    @keyframes blinkingColor{
      0%		{ color: #F48FB1;}
      25%		{ color: #FF4081;}
      50%		{ color: #F48FB1;}
      75%		{color: #FF4081;}
      100%	 {color: #F48FB1;}
    }
  }
  .support-me-image{
    height: 75%;
    width: 75%;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 8px;
    margin-bottom: 8px;
    border-radius: 16px;
  }
  .menu-separater{
    color: ${({ theme }) => theme.textTypeBox};
    background-color: none;
    font-size: 16px;
  }
  .chinese-word{
    margin-left: 4px;
    margin-right: 4px;
    display: flex;
    padding-right: 2px;
    border-bottom: 1px solid transparent;
    border-top: 1px solid transparent;
  }
  .chinese-word-key{
    margin: 4px 4px;
    color: ${({ theme }) => theme.textTypeBox};
    background-color: none;
    font-size: 20px;
    scroll-margin: 4px;
    text-align: center;
  }
  .error-chinese{
    color: red;
  }
  .active-chinese{
    color: ${({ theme }) => theme.stats};
  }
  .dialog{
    background: ${({ theme }) => theme.background};
  }
  .key-type{
    background: ${({ theme }) => theme.textTypeBox};
    color: ${({ theme }) => theme.stats};
    border-radius: 4px;
  }
  .key-note{
    color: ${({ theme }) => theme.stats};
    background: transparent;
  }
  .textarea{
    color: ${({ theme }) => theme.textTypeBox};
    font-size: 28px;
    background: transparent;
    border: none;
    width: 80%;
    height: 80%;
    caret-color: ${({ theme }) => theme.stats};
    overflow: auto;
    resize: none;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    outline: none;
    border-radius: 4px;
    @media only screen 
    and (min-device-width: 375px) 
    and (max-device-width: 812px) 
    and (-webkit-min-device-pixel-ratio: 3) { 
      top:200px;
      width: 60%;
    }
  }
  .active-game-mode-button{
    color: ${({ theme }) => theme.stats};
    font-size: 16px;
  }
  .inactive-game-mode-button{
    color: ${({ theme }) => theme.textTypeBox};
    font-size: 16px;
  }
  .error-sentence-char{
    color: red;
  }
  .sentence-char{
    color: ${({ theme }) => theme.textTypeBox};
  }
  .correct-sentence-char{
    color: ${({ theme }) => theme.text};
  }
  .sentence-input-field{
    color: ${({ theme }) => theme.textTypeBox};
    font-size: 28px;
    background: transparent;
    border: none;
    caret-color: ${({ theme }) => theme.stats};
    outline: none;
    padding: 0;
    font-family: ${({ theme }) => theme.fontFamily};
  }
  .sentence-display-field{
    font-size: 28px;
  }
  .next-sentence-display{
    font-family: ${({ theme }) => theme.fontFamily};
    color: ${({ theme }) => theme.textTypeBox};
    display: block;
    margin-top: 10px;
    font-size: 16px;
  }
  .type-box-sentence {
    display: block;
    max-width: 1000px;
    height: 240px;
    overflow: hidden;
    margin-left: auto;
    margin-right: auto;
    position: relative
    top: 10%;
    @media only screen 
    and (min-device-width: 375px) 
    and (max-device-width: 812px) 
    and (-webkit-min-device-pixel-ratio: 3) { 
      top:200px;
      width: 60%;
    }
  }
`;
