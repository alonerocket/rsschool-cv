document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const languageSwitcher = document.getElementById("language-switcher");
    const burgerMenu = document.getElementById("burger-menu");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileMenuContent = document.querySelector(".mobile-menu-content");
    const desktopNav = document.getElementById("desktop-nav");

    // Проверка наличия всех необходимых элементов
    if (!themeToggle || !languageSwitcher || !burgerMenu || !mobileMenu || !mobileMenuContent || !desktopNav) {
        console.error("One or more required elements are missing in the DOM.");
        return;
    }

    // === СМЕНА ИЗОБРАЖЕНИЙ ПРИ КЛИКЕ ===
    // Переключает изображение на другое при клике (туда-обратно)
    document.querySelectorAll(".toggle-image").forEach((img) => {
        img.addEventListener("click", function () {
            this.src = this.src.includes("logo.png") ? "./assets/img/logo2.png" : "./assets/img/logo.png";
        });
    });

    // === ТЕМА (светлая/тёмная) ===
    try {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            document.documentElement.classList.add("light-theme");
            console.log("Light theme loaded from localStorage");
        } else {
            console.log("Dark theme loaded (default or from localStorage)");
        }
    } catch (e) {
        console.error("Error accessing localStorage for theme:", e);
    }

    themeToggle.addEventListener("click", () => {
        document.documentElement.classList.toggle("light-theme");
        const newTheme = document.documentElement.classList.contains("light-theme") ? "light" : "dark";
        try {
            localStorage.setItem("theme", newTheme);
            console.log(`Theme switched to: ${newTheme}`);
        } catch (e) {
            console.error("Error setting theme in localStorage:", e);
        }
    });

    // === ЯЗЫК ===
    let currentLanguage = "en";
    try {
        currentLanguage = localStorage.getItem("language") || "en";
    } catch (e) {
        console.error("Error accessing language from localStorage:", e);
    }
    languageSwitcher.textContent = currentLanguage === "en" ? "RU" : "EN";
    updateLanguage();

    function updateLanguage() {
        document.querySelectorAll("[data-ru],[data-en]").forEach((el) => {
            const targetText = el.getAttribute(`data-${currentLanguage}`);
            if (targetText) {
                el.innerHTML = targetText;
            }
        });
    }

    languageSwitcher.addEventListener("click", () => {
        currentLanguage = currentLanguage === "en" ? "ru" : "en";
        languageSwitcher.textContent = currentLanguage === "en" ? "RU" : "EN";
        try {
            localStorage.setItem("language", currentLanguage);
        } catch (e) {
            console.error("Error setting language in localStorage:", e);
        }
        updateLanguage();
    });

    // === БУРГЕР-МЕНЮ ===
    const desktopLinks = desktopNav.querySelectorAll("a");
    mobileMenuContent.innerHTML = "";
    desktopLinks.forEach((link) => {
        const mobileLinkClone = link.cloneNode(true);
        mobileMenuContent.appendChild(mobileLinkClone);
    });

    burgerMenu.addEventListener("click", () => {
        burgerMenu.classList.toggle("active");
        mobileMenu.classList.toggle("active");
        document.body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : "";
    });

    mobileMenuContent.addEventListener("click", (e) => {
        if (e.target.closest("a")) {
            burgerMenu.classList.remove("active");
            mobileMenu.classList.remove("active");
            document.body.style.overflow = "";
        }
    });

    // === ПОДСВЕТКА АКТИВНОЙ СЕКЦИИ ===
    const navLinks = document.querySelectorAll("#desktop-nav a");
    const sections = document.querySelectorAll(".main-content section");
    const allNavLinks = [...navLinks, ...mobileMenuContent.querySelectorAll("a")];

    function removeActiveStates() {
        allNavLinks.forEach((link) => link.classList.remove("active-link"));
        sections.forEach((section) => section.classList.remove("active-section"));
    }

    function setActiveStates(sectionId) {
        removeActiveStates();
        const desktopLink = document.querySelector(`#desktop-nav a[href="#${sectionId}"]`);
        const mobileLink = document.querySelector(`#mobile-menu a[href="#${sectionId}"]`);
        const targetSection = document.getElementById(sectionId);
        if (desktopLink) desktopLink.classList.add("active-link");
        if (mobileLink) mobileLink.classList.add("active-link");
        if (targetSection) targetSection.classList.add("active-section");
    }

    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -80% 0px",
        threshold: 0,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setActiveStates(entry.target.id);
            }
        });
    }, observerOptions);

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });

    allNavLinks.forEach((link) => {
        link.addEventListener("click", function () {
            const sectionId = this.getAttribute("href").substring(1);
            setActiveStates(sectionId);
        });
    });
});
