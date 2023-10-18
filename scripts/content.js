const button = document.createElement("button");
button.textContent = `Login`;
const out = document.createElement("p");
out.textContent = "Please log in";

button.addEventListener("click", async () => {
  const response = await chrome.runtime.sendMessage({ action: "login" });
  if (!!response?.user?.email) {
    out.textContent = `Hello ${response.user.email}`;
  } else {
    out.textContent = `Something went wrong!`;
    console.warn(response?.error);
  }
});

document.querySelector("body > div").insertAdjacentElement("beforeend", button);
document.querySelector("body > div").insertAdjacentElement("beforeend", out);
