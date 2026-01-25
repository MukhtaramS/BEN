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
  const revealElements = document.querySelectorAll(".reveal, .reveal-stagger > *");
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
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show all
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  // Language switcher - handled by onclick in HTML
  // No JavaScript handler needed as we use direct onclick attributes

  // Contact form handler with EmailJS
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    // EmailJS configuration
    const serviceID = "service_gqs5nlg";
    const templateID = "template_jrr7vkq";
    const publicKey = "gREF7LFMHzeYIS28W";
    
    // Function to initialize EmailJS
    const initEmailJS = () => {
      if (typeof emailjs !== 'undefined') {
        try {
          emailjs.init(publicKey);
          console.log("✅ EmailJS initialized successfully");
          return true;
        } catch (error) {
          console.error("❌ EmailJS initialization error:", error);
          return false;
        }
      }
      return false;
    };
    
    // Try to initialize EmailJS when page loads
    if (typeof emailjs !== 'undefined') {
      initEmailJS();
    } else {
      // Wait for EmailJS to load
      const checkEmailJS = setInterval(() => {
        if (typeof emailjs !== 'undefined') {
          clearInterval(checkEmailJS);
          initEmailJS();
        }
      }, 100);
      
      // Stop checking after 5 seconds
      setTimeout(() => clearInterval(checkEmailJS), 5000);
    }
    
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      
      // Disable button and show loading state
      submitButton.disabled = true;
      submitButton.textContent = submitButton.textContent.includes('Отправить') ? 'Отправка...' : 'Sending...';
      
      const formData = new FormData(contactForm);
      const name = (formData.get("name") || "").toString().trim();
      const email = (formData.get("email") || "").toString().trim();
      const message = (formData.get("message") || "").toString().trim();
      
      const isEnglish = window.location.pathname.includes('-en.html');
      
      // Validate form data
      if (!name || !email || !message) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        alert(isEnglish 
          ? "Please fill in all fields."
          : "Пожалуйста, заполните все поля.");
        return;
      }
      
      // Check if EmailJS is loaded
      if (typeof emailjs === 'undefined') {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        console.error("❌ EmailJS library not loaded");
        alert(isEnglish 
          ? "Email service is not available. Please contact us directly via phone or email."
          : "Служба отправки email недоступна. Пожалуйста, свяжитесь с нами напрямую по телефону или email.");
        return;
      }
      
      // Initialize EmailJS if not already initialized
      if (!initEmailJS()) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        console.error("❌ Failed to initialize EmailJS");
        alert(isEnglish 
          ? "Email service initialization failed. Please try again or contact us directly."
          : "Не удалось инициализировать службу отправки email. Пожалуйста, попробуйте ещё раз или свяжитесь с нами напрямую.");
        return;
      }
      
      // Prepare email parameters (must match your EmailJS template variables: from_name, from_email, message)
      const templateParams = {
        from_name: name,
        from_email: email,
        message: message
      };
      
      console.log("📧 Attempting to send email with params:", templateParams);
      
      try {
        // Send email using EmailJS
        const response = await emailjs.send(serviceID, templateID, templateParams);
        console.log("✅ Email sent successfully:", response);
        
        // Success message
        const successMessage = isEnglish 
          ? `Thank you, ${name || "colleague"}! Your message has been sent.\nWe will contact you during the next business hours.`
          : `Спасибо, ${name || "коллега"}! Ваше сообщение отправлено.\nМы свяжемся с вами в ближайшее рабочее время.`;
        alert(successMessage);
        contactForm.reset();
      } catch (error) {
        console.error("Email sending failed:", error);
        console.error("Error details:", {
          status: error.status,
          text: error.text,
          serviceID: serviceID,
          templateID: templateID
        });
        
        let errorMessage = isEnglish
          ? "Sorry, there was an error sending your message. Please try again or contact us directly via phone or email."
          : "Извините, произошла ошибка при отправке сообщения. Пожалуйста, попробуйте ещё раз или свяжитесь с нами напрямую по телефону или email.";
        
        // More specific error messages
        if (error.text) {
          if (error.text.includes("Invalid") || error.text.includes("invalid")) {
            errorMessage = isEnglish
              ? "Configuration error. Please contact the website administrator."
              : "Ошибка конфигурации. Пожалуйста, свяжитесь с администратором сайта.";
          }
        }
        
        alert(errorMessage);
      } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }
});

