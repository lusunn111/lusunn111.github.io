(() => {
  const button = document.querySelector(".academic-menu-button");
  const menu = document.querySelector(".academic-overflow-menu");

  if (!button || !menu) return;

  const closeMenu = () => {
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Open section navigation");
    menu.hidden = true;
  };

  const openMenu = () => {
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-label", "Close section navigation");
    menu.hidden = false;
  };

  button.addEventListener("click", () => {
    if (button.getAttribute("aria-expanded") === "true") {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!menu.hidden && !menu.contains(event.target) && !button.contains(event.target)) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      button.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1180) closeMenu();
  });
})();
