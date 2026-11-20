/* Settings for the game.
 * siteUrl:   the public GitHub Pages version (quick check, browser speech input).
 * classUrl:  the claude.ai version with the AI judge. Leave empty to hide the link.
 * scriptUrl: the class Google Apps Script web app URL (ends in /exec). It saves each finished
 *            activity to the score sheet and, once it has an Anthropic API key, runs the
 *            AI judge. Leave empty to turn both off. Setup steps are in apps-script/Code.gs. */
window.QUEST_CONFIG = {
  siteUrl: "https://sang-ute.github.io/ielts-bich-game/",
  classUrl: "https://claude.ai/artifact/WfkyKywkapCviNqJuL7cLR",
  scriptUrl: ""
};
