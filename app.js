const form = document.querySelector("#auth-form");
const signinTab = document.querySelector("#signin-tab");
const signupTab = document.querySelector("#signup-tab");
const title = document.querySelector("#form-title");
const subtitle = document.querySelector("#form-subtitle");
const submitLabel = document.querySelector("#submit-label");
const confirmField = document.querySelector("#confirm-field");
const confirmPassword = document.querySelector("#confirm-password");
const password = document.querySelector("#password");
const email = document.querySelector("#email");
const message = document.querySelector("#form-message");
const forgotButton = document.querySelector("#forgot-button");
let mode = "signin";

function showMessage(text, kind = "") {
  message.textContent = text;
  message.className = "message" + (kind ? " " + kind : "");
}
function setMode(nextMode) {
  mode = nextMode;
  const signup = mode === "signup";
  signinTab.classList.toggle("active", !signup);
  signupTab.classList.toggle("active", signup);
  signinTab.setAttribute("aria-selected", String(!signup));
  signupTab.setAttribute("aria-selected", String(signup));
  title.innerHTML = signup ? "CREATE ACCOUNT<span>.</span>" : "SIGN IN<span>.</span>";
  subtitle.textContent = signup ? "Create your fighter profile and get ready." : "Your squad is waiting. Get back in the arena.";
  submitLabel.textContent = signup ? "CREATE FIGHTER ACCOUNT" : "ENTER THE ARENA";
  confirmField.classList.toggle("visible", signup);
  confirmPassword.required = signup;
  password.autocomplete = signup ? "new-password" : "current-password";
  forgotButton.hidden = signup;
  showMessage("");
}
signinTab.addEventListener("click", () => setMode("signin"));
signupTab.addEventListener("click", () => setMode("signup"));
document.querySelector("#toggle-password").addEventListener("click", event => {
  const visible = password.type === "text";
  password.type = visible ? "password" : "text";
  event.currentTarget.setAttribute("aria-label", visible ? "Show password" : "Hide password");
});
forgotButton.addEventListener("click", () => showMessage("Password recovery will be available after account authentication is connected."));
document.querySelector("#guest-button").addEventListener("click", () => { window.location.href = "lobby.html"; });
form.addEventListener("submit", event => {
  event.preventDefault();
  showMessage("");
  if (!email.validity.valid || !email.value.trim()) {
    showMessage("Enter a valid email address.");
    email.focus();
    return;
  }
  if (password.value.length < 8) {
    showMessage("Password must contain at least 8 characters.");
    password.focus();
    return;
  }
  if (mode === "signup" && password.value !== confirmPassword.value) {
    showMessage("Your passwords do not match.");
    confirmPassword.focus();
    return;
  }
  showMessage("Interface ready — secure account sign-in is not connected yet. Next step: connect authentication.", "success");
});
