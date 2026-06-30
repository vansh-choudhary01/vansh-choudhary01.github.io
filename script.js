// Small progressive enhancements for the otherwise static portfolio.
const root = document.documentElement;
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme) {
  root.dataset.theme = savedTheme;
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();

document.querySelector("[data-theme-toggle]").addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
});

document.querySelector("[data-print]").addEventListener("click", () => {
  window.print();
});

const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  root.style.setProperty("--scroll-progress", `${Math.min(progress, 100)}%`);
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  {
    rootMargin: "-20% 0px -58% 0px",
    threshold: [0.08, 0.22, 0.4]
  }
);

sections.forEach((section) => sectionObserver.observe(section));
window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

document.querySelector("[data-copy-email]").addEventListener("click", async (event) => {
  const email = event.currentTarget.dataset.copyEmail;
  const toast = document.querySelector("[data-toast]");

  try {
    await navigator.clipboard.writeText(email);
    toast.textContent = "Email copied";
  } catch {
    toast.textContent = email;
  }

  toast.hidden = false;
  clearTimeout(window.emailToastTimer);
  window.emailToastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2200);
});
