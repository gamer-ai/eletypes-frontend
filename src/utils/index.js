const getModeButtonClassName = (mode) => {
  if (mode) {
    return "zen-button";
  }
  return "zen-button-deactive";
};

export { getModeButtonClassName }
