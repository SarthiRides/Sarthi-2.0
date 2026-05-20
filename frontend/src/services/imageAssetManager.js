export const getProviderLogo = (fileName) => {
  switch (fileName) {
    case 'ola.png':
      return require('../../assets/ola.png');
    case 'uber.png':
      return require('../../assets/uber.png');
    case 'rapido.png':
      return require('../../assets/rapido.png');
    case 'namma_yatri.png':
      return require('../../assets/namma_yatri.png');
    default:
      return null;
  }
};
