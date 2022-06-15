const lightTheme = {
    label: 'Light', 
    background: '#F5F5F5',
    text: '#000000',
    gradient: 'linear-gradient(315deg, #74ebd5 0%, #ACB6E5 94%)',
    title: '#2979ff',
    textTypeBox: '#9E9E9E',
    stats: '#3D5AFE',
  };
  
const darkTheme = {
    label: 'Dark', 
    background: '#121212',
    text: '#FAFAFA',
    gradient: 'linear-gradient(315deg, #F7971E 0%, #FFD200 94%)',
    title: '#ffc107',
    textTypeBox: '#706d6d',
    stats: '#BB86FC'
  };

const cyberTheme = {
    label: 'Cyber', 
    background: '#272932',
    text: '#CB1DCD',
    gradient: 'linear-gradient(315deg, #FDF500 0%, #CB1DCD 94%)',
    title: '#FDF500',
    textTypeBox: '#D1C5C0',
    stats: '#00ff9f',
    fontFamily: 'Tomorrow'
};

const steamTheme = {
  label: 'Steam',
  background: '#6e2f3b',
  text: '#fdd978',
  gradient: 'linear-gradient(315deg, #80acaa 0%, #fdd978 94%)',
  title: '#2b211e',
  textTypeBox: '#605542',
  stats: '#80acaa',
  fontFamily: 'Tomorrow'
};

const terminalTheme = {
  label: 'Terminal',
  background: '#0D0208',
  text: '#39ff14',
  gradient: 'linear-gradient(315deg, #39ff14 0%, #008F11 94%)',
  title: '#008F11',
  textTypeBox: '#706d6d',
  stats: '#39ff14',
  fontFamily: 'Tomorrow'
};

const nintendoTheme = {
  label: 'Nintendo',
  background: '#000000',
  text: '#00c3e3',
  gradient: 'linear-gradient(90deg, 	#dd2020 0%, #00c3e3 100%)',
  title: '#dd2020',
  textTypeBox: '#a5a2a2',
  stats: '#00c3e3',
  fontFamily: 'Tomorrow'
};

const arakiNobuyoshiTheme = {
  label: 'Araki Nobuyoshi',
  background: '#232335',
  text: '#086063',
  gradient: 'linear-gradient(90deg, 	#232335 0%, #0a4951 100%)',
  title: '#B42D2C',
  textTypeBox: '#CCB1B0',
  stats: '#1a5426'
};


const defaultTheme = darkTheme;

const themesOptions = [
    { value: darkTheme, label: 'Dark' },
    { value: terminalTheme, label: 'Terminal' },
    { value: nintendoTheme, label: 'Nintendo'},
    { value: cyberTheme, label: 'Cyber' },
    { value: steamTheme, label: 'Steam' },
    { value: lightTheme, label: 'Light' },
    { value: arakiNobuyoshiTheme, label: 'Araki Nobuyoshi'}
  ];

export {
    lightTheme,
    darkTheme,
    cyberTheme,
    steamTheme,
    terminalTheme,
    nintendoTheme,
    arakiNobuyoshiTheme,
    defaultTheme,
    themesOptions
}