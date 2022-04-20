const lightTheme = {
    background: '#F5F5F5',
    text: '#000000',
    toggleBorder: '#FFF',
    gradient: 'linear-gradient(315deg, #74ebd5 0%, #ACB6E5 94%)',
    title: '#2979ff',
    textTypeBox: '#9E9E9E',
    stats: '#3D5AFE'
  };
  
const darkTheme = {
    background: '#121212',
    text: '#FAFAFA',
    toggleBorder: '#6B8096',
    gradient: 'linear-gradient(315deg, #F7971E 0%, #FFD200 94%)',
    title: '#ffc107',
    textTypeBox: '#706d6d',
    stats: '#BB86FC',
    alert: 'linear-gradient(315deg, #a40606 0%, #d98324 74%)'
    
  };

const cyberTheme = {
    background: '#272932',
    text: '#CB1DCD',
    toggleBorder: '#37EBF3',
    gradient: 'linear-gradient(315deg, #FDF500 0%, #CB1DCD 94%)',
    title: '#FDF500',
    textTypeBox: '#D1C5C0',
    stats: '#00ff9f'
};

const steamTheme = {
  background: '#6e2f3b',
  text: '#fdd978',
  toggleBorder: '#37EBF3',
  gradient: 'linear-gradient(315deg, #80acaa 0%, #fdd978 94%)',
  title: '#2b211e',
  textTypeBox: '#605542',
  stats: '#80acaa'
};


const defaultTheme = darkTheme;

const themesOptions = [
    { value: darkTheme, label: 'Dark' },
    { value: lightTheme, label: 'Light' },
    { value: cyberTheme, label: 'Cyber' },
    { value: steamTheme, label: 'Steam' },
  ];

export {
    lightTheme,
    darkTheme,
    cyberTheme,
    steamTheme,
    defaultTheme,
    themesOptions
}