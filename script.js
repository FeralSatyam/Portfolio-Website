// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing...")

  // Ensure content is visible first
  ensureContentVisibility()

  // Initialize all components
  initializeNetworkAnimation()
  initializeTypingAnimation()
  initializeNavigation()
  initializeScrollAnimations()
  initializeContactForm()
})

// Network Animation
function initializeNetworkAnimation() {
  try {
    const canvas = document.getElementById("networkCanvas")
    if (!canvas) {
      console.log("Canvas not found, creating one...")
      const newCanvas = document.createElement("canvas")
      newCanvas.id = "networkCanvas"
      newCanvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0a0a0a;
        z-index: -1;
        pointer-events: none;
      `
      document.body.insertBefore(newCanvas, document.body.firstChild)
      new NetworkAnimation(newCanvas)
    } else {
      new NetworkAnimation(canvas)
    }
  } catch (error) {
    console.log("Network animation failed:", error)
  }
}

class NetworkAnimation {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext("2d")
    this.particles = []
    this.mouse = { x: 0, y: 0 }

    this.init()
    this.animate()
    this.setupEventListeners()
  }

  init() {
    this.resizeCanvas()
    this.createParticles()
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  createParticles() {
    const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000)
    this.particles = []

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      })
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx
      particle.y += particle.vy

      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1
      }

      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x))
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y))
    })
  }

  drawParticles() {
    this.particles.forEach((particle) => {
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      this.ctx.fillStyle = "#00d4aa"
      this.ctx.fill()
    })
  }

  drawConnections() {
    const maxDistance = 150

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x
        const dy = this.particles[i].y - this.particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance) {
          const opacity = (maxDistance - distance) / maxDistance
          this.ctx.beginPath()
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y)
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y)
          this.ctx.strokeStyle = `rgba(0, 212, 170, ${opacity * 0.3})`
          this.ctx.lineWidth = 1
          this.ctx.stroke()
        }
      }
    }
  }

  drawMouseConnections() {
    const maxDistance = 200

    this.particles.forEach((particle) => {
      const dx = this.mouse.x - particle.x
      const dy = this.mouse.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < maxDistance) {
        const opacity = (maxDistance - distance) / maxDistance
        this.ctx.beginPath()
        this.ctx.moveTo(particle.x, particle.y)
        this.ctx.lineTo(this.mouse.x, this.mouse.y)
        this.ctx.strokeStyle = `rgba(0, 212, 170, ${opacity * 0.5})`
        this.ctx.lineWidth = 2
        this.ctx.stroke()
      }
    })
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.updateParticles()
    this.drawConnections()
    this.drawParticles()
    this.drawMouseConnections()

    requestAnimationFrame(() => this.animate())
  }

  setupEventListeners() {
    window.addEventListener("resize", () => {
      this.resizeCanvas()
      this.createParticles()
    })

    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
    })
  }
}

// Typing Animation
function initializeTypingAnimation() {
  const typedElement = document.getElementById("typed-text")
  if (typedElement) {
    new TypingAnimation(typedElement, [
      "Student & Aspiring Developer",
      "AI & Machine Learning Enthusiast",
      "Problem Solver & Innovator",
      "Programming Passionate",
    ])
  }
}

class TypingAnimation {
  constructor(element, texts, speed = 100) {
    this.element = element
    this.texts = texts
    this.speed = speed
    this.textIndex = 0
    this.charIndex = 0
    this.isDeleting = false

    this.type()
  }

  type() {
    const currentText = this.texts[this.textIndex]

    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1)
      this.charIndex--
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1)
      this.charIndex++
    }

    let typeSpeed = this.speed

    if (this.isDeleting) {
      typeSpeed /= 2
    }

    if (!this.isDeleting && this.charIndex === currentText.length) {
      typeSpeed = 2000
      this.isDeleting = true
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false
      this.textIndex = (this.textIndex + 1) % this.texts.length
      typeSpeed = 500
    }

    setTimeout(() => this.type(), typeSpeed)
  }
}

// Navigation
function initializeNavigation() {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }

      // Close mobile menu
      if (hamburger && navMenu) {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      }

      // Update active link
      navLinks.forEach((navLink) => navLink.classList.remove("active"))
      link.classList.add("active")
    })
  })

  // Update active link on scroll
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section[id]")
    const scrollPos = window.scrollY + 100

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active")
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active")
          }
        })
      }
    })
  })
}

// Scroll Animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")

        // Animate skill bars
        if (entry.target.classList.contains("skill-category")) {
          animateSkillBars(entry.target)
        }
      }
    })
  }, observerOptions)

  // Make sure all sections are visible by default
  const allSections = document.querySelectorAll(".section")
  allSections.forEach((section) => {
    section.style.opacity = "1"
    section.style.transform = "translateY(0)"
  })

  // Observe elements for animations (but don't hide them)
  const fadeElements = document.querySelectorAll(".section-title, .about-text, .contact-info")
  const projectCards = document.querySelectorAll(".project-card")
  const skillCategories = document.querySelectorAll(".skill-category")

  fadeElements.forEach((el) => {
    observer.observe(el)
  })

  projectCards.forEach((card, index) => {
    // Remove the transition delay for hover animations
    // card.style.transitionDelay = `${index * 0.1}s`
    observer.observe(card)
  })

  skillCategories.forEach((category) => {
    observer.observe(category)
  })
}

function animateSkillBars(skillCategory) {
  // Add a simple fade-in animation for skill tags instead
  const skillTags = skillCategory.querySelectorAll(".skill-tag")
  skillTags.forEach((tag, index) => {
    setTimeout(() => {
      tag.style.opacity = "0"
      tag.style.transform = "translateY(20px)"
      tag.style.transition = "all 0.5s ease"

      setTimeout(() => {
        tag.style.opacity = "1"
        tag.style.transform = "translateY(0)"
      }, 50)
    }, index * 100)
  })
}

// Contact Form
function initializeContactForm() {
  const form = document.getElementById("contactForm")
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      // Show success message
      const messageDiv = document.createElement("div")
      messageDiv.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 8px;
        background: rgba(0, 212, 170, 0.2);
        color: #00d4aa;
        border: 1px solid #00d4aa;
        text-align: center;
      `
      messageDiv.textContent = "Thank you for your message! I'll get back to you soon."

      form.appendChild(messageDiv)
      form.reset()

      setTimeout(() => {
        messageDiv.remove()
      }, 5000)
    })
  }
}

// Performance optimization
window.addEventListener("load", () => {
  document.body.classList.add("loaded")
})

// Add this function after the DOMContentLoaded event listener
function ensureContentVisibility() {
  // Make sure all sections are visible
  const sections = document.querySelectorAll(".section, .hero-section")
  sections.forEach((section) => {
    section.style.display = "block"
    section.style.opacity = "1"
    section.style.transform = "translateY(0)"
  })

  // Ensure hero content is visible
  const heroContent = document.querySelector(".hero-content")
  if (heroContent) {
    heroContent.style.opacity = "1"
    heroContent.style.transform = "translateY(0)"
  }

  console.log("Content visibility ensured")
}
