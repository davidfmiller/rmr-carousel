
(function _() {
  'use strict';

  const
  RMR = require('rmr-util'),
  modulo = (number, mod) => {
    let result = number % mod;
    if (result < 0) {
      result += mod;
    }
    return result;
  }

  const Carousel = function(config) {

    this.carousel = RMR.Node.get(config.node);
    const self = this;

    this.wrap = false;

    if (! this.carousel) {
      console.error('Invalid carousel configuration', config);
      return;
    }

    this.container = this.carousel.querySelector('.rmr-carousel-container');
    if (! this.container) {
      console.error('No carousel container', config);
      return;
    }

    if (config.duration) {
      this.container.style.transitionDuration = config.duration + 's';
    }

    this.buttonPrevious = this.carousel.querySelector('.rmr-prev');
    this.buttonNext = this.carousel.querySelector('.rmr-next');

    this.slides = Array.from(this.carousel.querySelectorAll('.rmr-carousel-page'));
    this.indicators = Array.from(this.carousel.parentNode.querySelectorAll('.rmr-page-indicators li'));

    if (this.buttonPrevious) {
      this.buttonPrevious.addEventListener('click', function(e) { self.previous(); });
    }

    if (this.buttonNext) {
      this.buttonNext.addEventListener('click', function(e) { self.next(); });
    }

    this.indicators = Array.from(this.carousel.querySelectorAll('.rmr-page-indicators li'));

    const pager = e => {
      self.showSlide(parseInt(e.target.closest('li').dataset.index, 10));
    }

    for (let i = 0; i < this.indicators.length; i++) {
      this.indicators[i].setAttribute('data-index', i);
      this.indicators[i].querySelector('button').addEventListener('click', pager);
    }

    this.carousel.setAttribute('aria-role', 'group');
    this.carousel.setAttribute('aria-roledescription', 'carousel');

    this.showSlide(0);
  };

  Carousel.prototype.showSlide = function(index) {

    if (index < 0 || index >= this.slides.length) {
      console.error('Invalid slide index', index);
      return;
    }

    this.container.style.setProperty('--current-slide', index);

    const
      previousSlide = this.slides[modulo(index - 1, this.slides.length)],
      currentSlide = this.slides[index],
      nextSlide = this.slides[modulo(index + 1, this.slides.length)];

    this.slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', i === index ? false : true);
      slide.setAttribute('aria-role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
    });


    this.indicators.forEach((node, i) => {
      if (i === index) {
        node.classList.add('rmr-active');
      } else {
        node.classList.remove('rmr-active');
      }
    });

    if (this.buttonPrevious) {
      if (index > 0) {
        this.buttonPrevious.removeAttribute('disabled');
      } else {
        this.buttonPrevious.setAttribute('disabled', true);
      }
    }

    if (this.buttonNext) {
      if (index < this.slides.length - 1) {
        this.buttonNext.removeAttribute('disabled');
      } else {
        this.buttonNext.setAttribute('disabled', true);
      }
    }

    this.index = index;
  }

  Carousel.prototype.next = function() {

    if (this.wrap) {
      const next = modulo(this.index + 1, this.slides.length);
      this.showSlide(next);
    }
    else if (this.index < this.slides.length - 1) {
      this.showSlide(this.index + 1);
    }
  }

  Carousel.prototype.previous = function() {
    if (this.wrap) {
      const prev = modulo(this.index - 1, this.slides.length)
      this.showSlide(prev);
    } else if (this.index > 0) {
      this.showSlide(this.index - 1);
    }
  }

  module.exports = Carousel;
})();
