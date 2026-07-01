// Small progressive enhancements for the otherwise static portfolio.
const root = document.documentElement;
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const sections = navLinks
  .map((link) => document.getElementById(link.dataset.target))
  .filter(Boolean);

function smoothScrollTo(targetY, duration = 700) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let startTime = null;

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + diff * easeInOut(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const id = link.dataset.target;
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    smoothScrollTo(top);
  });
});


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
      link.classList.toggle("is-active", link.dataset.target === visible.target.id);
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
