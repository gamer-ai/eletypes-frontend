const lightTheme = {
    background: '#E2E2E2',
    text: '#363537',
    toggleBorder: '#FFF',
    gradient: 'linear-gradient(#39598A, #79D7ED)',
    title: '#2979ff',
    textTypeBox: '#8f8f8f',
    stats: '#3E7C17'
  };
  
const darkTheme = {
    background: '#121212',
    text: '#FAFAFA',
    toggleBorder: '#6B8096',
    gradient: 'linear-gradient(#091236, #1E215D)',
    title: '#ffc107',
    textTypeBox: '#706d6d',
    stats: '#BB86FC'
  };

const cyberTheme = {
    background: '#272932',
    text: '#CB1DCD',
    toggleBorder: '#37EBF3',
    gradient: 'linear-gradient(#091236, #1E215D)',
    title: '#FDF500',
    textTypeBox: '#D1C5C0',
    stats: '#00ff9f'
};


const defaultTheme = darkTheme;

const themesOptions = [
    { value: darkTheme, label: 'Dark' },
    { value: lightTheme, label: 'Light' },
    { value: cyberTheme, label: 'Cyber' }
  ];

export {
    lightTheme,
    darkTheme,
    defaultTheme,
    themesOptions
}