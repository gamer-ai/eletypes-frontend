import { clip } from "versioncam";

// Types the first sentence of a sentence test, then switches to the Moss
// theme, one of the new ones, dark so the caption stays readable on it.
export default clip("type-and-switch-theme", { title: "Type a sentence, switch the theme", seed: 9 }, async (s) => {
  // The sentences and the local user tag come from Math.random, so two
  // recordings would show different ones. A seeded Math.random, installed
  // before the app loads, gives the same ones every time, the way the
  // recorder already fixes the page's clock.
  await s.offCamera(async (page) => {
    await page.addInitScript(() => {
      let state = 20261110;
      Math.random = () => {
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    });
  });

  await s.open("/");
  s.caption("Type a sentence, and Eletypes times you and shows your speed");
  await s.hold(1000);

  await s.click(s.byRole("button", { name: "sentence", exact: true }));
  await s.settle({ label: "sentence mode" });
  await s.hold(1000);

  // The sentence field has focus once the mode is on.
  await s.type("Life is a pretty chessy game, but at least it has good graphics.");
  await s.settle({ label: "typed" });
  await s.hold(1600);

  s.caption("Switch the theme");
  await s.click(s.byText(/^Dark$/));
  await s.settle({ label: "theme list" });
  await s.hold(1200);

  await s.click(s.byText("Moss"));
  await s.settle({ label: "theme switched" });
  await s.moveTo([1180, 600]);
  await s.hold(2400);
});
