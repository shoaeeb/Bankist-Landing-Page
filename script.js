'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to'); //the learnmore button
const section1 = document.querySelector('#section--1'); //section1
const operations = document.querySelector('.operations'); //the operations section
const nav = document.querySelector('.nav'); //the nav bar

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//smooth scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  section1.scrollIntoView({ behavior: 'smooth' });
});

//smooth scrolling for the links to navigate to its respective
//section //Page Navigation
// document.querySelectorAll('.nav__link').forEach(link => {
//   link.addEventListener('click', function (e) {
//     e.preventDefault();
//     //logic for smooth scrolling
//     const id = this.getAttribute('href'); //returns the relative url not the absolut one
//     document.querySelector(id).scrollIntoView({
//       behavior: 'smooth',
//     });
//   });
// });

//event delegation
//addEventListener to a common parent element
//determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  if (!e.target.classList.contains('nav__links')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});
//defining a tabbed component
//in the operation section
//code by my own
operations.addEventListener('click', function (e) {
  //Guard Clause
  if (!e.target.dataset.tab) {
    return;
  }
  const dataTab = e.target.dataset.tab;
  const allChildren = [...operations.children];
  let operationTab = allChildren.filter(child =>
    child.classList.contains('operations__tab-container')
  );
  operationTab = [...operationTab[0].children].forEach(tab => {
    tab.classList.remove('operations__tab--active');
    if (tab.classList.contains(`operations__tab--${dataTab}`)) {
      tab.classList.add('operations__tab--active');
    }
  });

  //get the element with the operations__content;
  let operationsContent = allChildren
    .filter(child => child.classList.contains('operations__content'))
    .map(child => child);
  operationsContent.forEach(content => {
    content.classList.remove('operations__content--active');
    if (content.classList.contains(`operations__content--${dataTab}`)) {
      content.classList.add('operations__content--active');
    }
  });
});

// ends here

//Menu fade animation
//mouseenter does not bubble up

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target; //returns the link
    console.log(e.target);
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    // siblings.forEach(el => {
    //   if (el !== link) {
    //     el.style.opacity = 0.5;
    //   }
    // });
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));
const intialCoords = section1.getBoundingClientRect();
//implementing sticky navigation whenever the users scroll
// window.addEventListener('scroll', function () {
//   if (this.window.pageYOffset > intialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });
//sticky navigation using Intersection API
// const callBackFn = (entries, observer) => {
//   entries.forEach(entry => console.log(entry));
// };

// const observerOptions = {
//   root: null, //entries
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(callBackFn, observerOptions);
// observer.observe(section1);
const header = document.querySelector('.header');
//console.log(nav.getBoundingClientRect().height)
const navBarHeight = getComputedStyle(nav).height;
const stickyNav = function (entries) {
  let [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const options = {
  root: null,
  threshold: 0,
  rootMargin: `-${navBarHeight}`,
};
const observer = new IntersectionObserver(stickyNav, options);
observer.observe(header);
//ends here
//reveal sections as we scroll near them

//1.selecting all the elements
const allSections = document.querySelectorAll('.section');

//InterSection API Observer
const revealSection = function (entries, observer) {
  const [entry] = entries; //getting the first entry
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); //if the section is passed then just unobserve that section
};
const revealObs = {
  root: null,
  threshold: 0.2, //10%
};
const sectionObserver = new IntersectionObserver(revealSection, revealObs);
//loop over each section so the intersection observer can observe
allSections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});
//ends here

//Lazy loading of images
//select all the images
const allImages = document.querySelectorAll('img[data-src]');
const lazyImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //replace with src with the new one
  //and remove the class
  entry.target.src = entry.target.dataset.src; //this happens behind the scenes
  //remove the class lazy-img

  //this function only execute when the whole image is loaded
  //then only remove the filter background;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  //get the image name from data-src

  observer.unobserve(entry.target);
};
const imgObserverObject = {
  root: null,
  threshold: 0,
  rootMargin: '200px',
};
const imgObserver = new IntersectionObserver(lazyImg, imgObserverObject);

allImages.forEach(img => imgObserver.observe(img));
console.log(allImages);

//ends here

//implementing slider
//selecting the slider class
const allSlides = document.querySelectorAll('.slide');
//seleting the left and right button
const prevBtn = document.querySelector('.slider__btn--left');
const nextBtn = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
//Logic
let currSlide = 0;
const maxSlide = allSlides.length;

const createDots = function () {
  allSlides.forEach((_, i) =>
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    )
  );
};
const slider = document.querySelector('.slider');
const getSlide = function (currSlide) {
  allSlides.forEach((slide, index) => {
    slide.style.transform = `translateX(${100 * (index - currSlide)}%)`;
  });
};
const activateDots = function (currSlide) {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });
  document
    .querySelector(`.dots__dot[data-slide="${currSlide}"]`)
    .classList.add('dots__dot--active');
};

//addEventListner
nextBtn.addEventListener('click', function () {
  if (currSlide === maxSlide - 1) {
    currSlide = 0;
  } else {
    currSlide++;
  }
  getSlide(currSlide);
  activateDots(currSlide);
});

prevBtn.addEventListener('click', function () {
  if (currSlide === 0) {
    currSlide = maxSlide - 1;
  } else {
    currSlide--;
  }
  getSlide(currSlide);
  activateDots(currSlide);
});

dotContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;
  const slideNumber = e.target.dataset.slide;
  currSlide = slideNumber;
  getSlide(currSlide);
  activateDots(currSlide);
});

//call the function
createDots();
getSlide(0);
activateDots(0);

//ends here
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const randomColor = () => {
  return `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
};

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   //e.target//where the event is originated and not the event with which
//   //is attached to
//   //e.currentTarget//represents the element where the event is attached to
//   //stop the event propagation
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// });
