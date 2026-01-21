// Sticky header & scroll handling
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");
  const scrollTopBtn = document.querySelector(".scroll-top-btn");

  // Header shadow on scroll
  const handleScroll = () => {
    if (window.scrollY > 10) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }

    if (scrollTopBtn) {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Burger menu toggle
  if (burger && nav) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("open");
      nav.classList.toggle("open");
    });

    // Close menu on nav link click (mobile)
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        burger.classList.remove("open");
        nav.classList.remove("open");
      });
    });
  }

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href") || "";
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerOffset = header ? header.offsetHeight + 12 : 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });

  // Scroll-to-top
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Reveal on scroll using IntersectionObserver
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show all
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  // Language switcher placeholder
  const langButtons = document.querySelectorAll(".lang-btn");
  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      langButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (btn.dataset.lang === "en") {
        alert("Английская версия сайта будет доступна позже.");
      }
    });
  });

  // Simple contact form handler (no backend)
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = (formData.get("name") || "").toString();

      alert(
        `Спасибо, ${name || "коллега"}! Ваше сообщение отправлено.\nМы свяжемся с вами в ближайшее рабочее время.`
      );
      contactForm.reset();
    });
  }
});

