
   
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
    font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    transition: all 0.25s linear;
  }
  header {
    position: absolute;
    top: 0;
    left:0;
    width: 100%;
    text-align: center;
  }
  footer {
    position: absolute;
    bottom: 5%;
    left: 5%;
  }
  small {
    display: block;
  }
  button {
    display: block;
  }
  h1 {
    color: ${({ theme }) => theme.title};
  }
  .stats {
    color: ${({ theme }) => theme.stats};
    bottom: 10%;
  }
  a {
    color: ${({ theme }) => theme.text};
  }
  .type-box {
    display: block;
    width: 800px;
    height: 120px;
    overflow: hidden;
    margin: auto;
  }
  .words{
    color: ${({ theme }) => theme.textTypeBox};
    font-size: 24px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    align-content: flex-start;
    user-select: none;

  }
  .word{
    margin: 5px 5px;
    display: flex;
  }
  .error-word{
    border-bottom: 1px solid red
}
  .correct-char{
    color: ${({ theme }) => theme.text};
  }
  .error-char{
    color: red;
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
`;