
   
import { createGlobalStyle } from 'styled-components';

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
    height: 100vh;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    padding: 0;
    margin: 0;
    font-family: ${({ theme }) => theme.fontFamily};
    transition: all 0.25s linear;
  }
  header {
    position: fixed;
    top: 5%;
    left:0;
    width: 100%;
    text-align: center;
  }
  footer {
    position: absolute;
    bottom: 5%;
    left: 5%;
  }
  .bottom-info {
    position: absolute;
    bottom: 5%;
    right: 5%;
    font-size: 12px;
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
    margin-top: 50px;
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
  .words{
    color: ${({ theme }) => theme.textTypeBox};
    font-size: 28px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    align-content: flex-start;
    user-select: none;
  }
  .word{
    margin: 4px 4px;
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
`;