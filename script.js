const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');

const observerOptions = {
  threshold: 0.2
};


/* =========================
   TYPEWRITER
========================= */

function handleTypewriter() {
  const element = document.querySelector('.typewriter');

  if (!element) return;

  const text = 'Python Developer';
  let index = 0;
  let deleting = false;

  setInterval(() => {

    if (!deleting) {
      element.textContent = text.slice(0, index) + '|';
      index++;

      if (index > text.length) {
        deleting = true;
      }

    } else {
      element.textContent = text.slice(0, index) + '|';
      index--;

      if (index < 0) {
        index = 0;
        deleting = false;
      }
    }

  }, 120);
}


/* =========================
   ACTIVE NAVIGATION
========================= */

function setActiveLink() {

  const scrollPos =
    window.scrollY + window.innerHeight / 3;

  sections.forEach((section) => {

    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    const link = document.querySelector(
      `.nav-link[href="#${id}"]`
    );

    if (
      scrollPos >= top &&
      scrollPos < top + height
    ) {

      navLinks.forEach((item) => {
        item.classList.remove('active');
      });

      if (link) {
        link.classList.add('active');
      }
    }

  });
}


/* =========================
   SCROLL ANIMATION
========================= */

function createObserver() {

  const blocks =
    document.querySelectorAll('.fade-up');

  if (!blocks.length) return;

  const observer =
    new IntersectionObserver((entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add('visible');

          observer.unobserve(entry.target);
        }

      });

    }, observerOptions);

  blocks.forEach((block) => {
    observer.observe(block);
  });
}


/* =========================
   CERTIFICATE MODAL
========================= */

function initModal() {

  const modal =
    document.getElementById('image-modal');

  if (!modal) return;

  const modalImage =
    modal.querySelector('img');

  const closeButton =
    modal.querySelector('.modal-close');

  if (!modalImage || !closeButton) return;


  document
    .querySelectorAll('.certificate-card')
    .forEach((button) => {

      button.addEventListener('click', () => {

        const imageUrl =
          button.dataset.image;

        if (!imageUrl) return;

        modalImage.src = imageUrl;

        modal.classList.add('active');

        modal.setAttribute(
          'aria-hidden',
          'false'
        );

      });

    });


  closeButton.addEventListener(
    'click',
    () => {

      modal.classList.remove('active');

      modal.setAttribute(
        'aria-hidden',
        'true'
      );

      modalImage.src = '';

    }
  );


  modal.addEventListener(
    'click',
    (event) => {

      if (event.target === modal) {
        closeButton.click();
      }

    }
  );

}


/* =========================
   CONTACT FORM
   MYSQL + FLASK
========================= */

function initForm() {

  const form =
    document.getElementById('contact-form');

  if (!form) {
    console.error('Contact form not found');
    return;
  }

  const feedback =
    form.querySelector('.form-feedback');

  const button =
    form.querySelector('button[type="submit"]');

  form.addEventListener(
    'submit',
    async (event) => {

      event.preventDefault();

      const name =
        document.getElementById('name')?.value.trim();

      const email =
        document.getElementById('email')?.value.trim();

      const message =
        document.getElementById('message')?.value.trim();


      /* Check fields */

      if (!name || !email || !message) {

        if (feedback) {
          feedback.textContent =
            'Please fill all fields.';
        }

        return;
      }


      /* Button loading */

      if (button) {
        button.disabled = true;
        button.textContent = 'Saving...';
      }

      if (feedback) {
        feedback.textContent =
          'Saving your message...';
      }


      try {

        const response =
          await fetch('/contact', {

            method: 'POST',

            headers: {
              'Content-Type': 'application/json'
            },

            body: JSON.stringify({
              name: name,
              email: email,
              message: message
            })

          });


        const result =
          await response.json();


        if (response.ok && result.success) {

          if (feedback) {
            feedback.textContent =
              'Message saved successfully! ✅';
          }

          form.reset();

        } else {

          if (feedback) {
            feedback.textContent =
              result.message ||
              'Something went wrong. Please try again.';
          }

        }


      } catch (error) {

        console.error(
          'Contact form error:',
          error
        );

        if (feedback) {
          feedback.textContent =
            'Unable to connect to server. Make sure Flask is running.';
        }

      }


      /* Enable button again */

      if (button) {
        button.disabled = false;
        button.textContent = 'Send Message';
      }

    }
  );

}


/* =========================
   MOBILE MENU
========================= */

function initMenu() {

  if (!navToggle || !navList) return;


  navToggle.addEventListener(
    'click',
    () => {

      const expanded =
        navToggle.getAttribute(
          'aria-expanded'
        ) === 'true';


      navToggle.setAttribute(
        'aria-expanded',
        String(!expanded)
      );


      navList.classList.toggle('open');

    }
  );


  navLinks.forEach((link) => {

    link.addEventListener(
      'click',
      () => {

        navList.classList.remove('open');

        navToggle.setAttribute(
          'aria-expanded',
          'false'
        );

      }
    );

  });

}


/* =========================
   PAGE LOAD
========================= */

window.addEventListener(
  'scroll',
  setActiveLink
);


window.addEventListener(
  'DOMContentLoaded',
  () => {

    handleTypewriter();

    createObserver();

    initModal();

    initForm();

    initMenu();

    setActiveLink();

  }
);