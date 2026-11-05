const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNavigation = document.querySelector("#site-navigation");

function setMenu(open) {
  if (!menuToggle || !siteNavigation) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  siteNavigation.classList.toggle("is-open", open);
}

if (menuToggle && siteNavigation) {
  menuToggle.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  siteNavigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (header && event.target instanceof Node && !header.contains(event.target)) setMenu(false);
  });
}

// El encabezado toma fondo cuando la página deja de estar arriba de todo.
if (header) {
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 16);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  // Al entrar con un ancla (#contacto) el navegador baja después de cargar el script.
  window.addEventListener("load", updateHeader);
  window.addEventListener("hashchange", updateHeader);
}

// Resalta en el menú la sección que se está viendo.
const navLinks = siteNavigation
  ? [...siteNavigation.querySelectorAll('a[href^="#"]:not(.nav-cta)')]
  : [];
// Se observan todas las secciones: en las que no están en el menú, ningún enlace queda resaltado.
const sections = [...document.querySelectorAll("main section[id]")];

if ("IntersectionObserver" in window && sections.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of navLinks) {
          const current = link.getAttribute("href") === `#${entry.target.id}`;
          if (current) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        }
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  sections.forEach((section) => observer.observe(section));
}

// Copiar el email al portapapeles.
const copyButton = document.querySelector(".copy-email");
const copyStatus = document.querySelector(".copy-status");

if (copyButton && copyStatus) {
  copyButton.addEventListener("click", async () => {
    const email = copyButton.dataset.email ?? "";
    try {
      await navigator.clipboard.writeText(email);
      copyStatus.textContent = "Email copiado.";
    } catch {
      copyStatus.textContent = `Cópialo a mano: ${email}`;
    }
    window.setTimeout(() => {
      copyStatus.textContent = "";
    }, 3000);
  });
}

const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}
