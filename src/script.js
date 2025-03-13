import gsap from 'gsap';
import Lenis from 'lenis'
import CustomEase from 'gsap/CustomEase';
import Flip from 'gsap/Flip';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { retrieveHeight, retrieveRootVariables, retrieveWidth, textToSpanLetters } from './utils/dom';

gsap.registerPlugin(CustomEase)
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(Flip)

console.log(ScrollTrigger, Flip)

CustomEase.create("primary-ease", "0.62, 0.05, 0.01, 0.99")

const BASIC_DURATION = 1.2

function initDom() {
    const pIntoLetters = document.querySelectorAll('[data-transform-letters]')
    
    pIntoLetters.forEach(element => {
        textToSpanLetters(element);
    });
}

function initLoader() {
    const rootS = retrieveRootVariables(document.body, "--s");
    console.log('loader', rootS)

    const tl = gsap.timeline({
        defaults: {
            duration: BASIC_DURATION,
            ease: "primary-ease"
        }
    })

    tl.to('.header__logo.linemask p span.letter', {
        y: 0,
        stagger: 0.02
    })

    tl.to('.transition', {
        y: '-100%'
    }, '>')

    tl.to('.header', {
        top: rootS,
        transform: 'translateY(0%)'
    }, '<')

    localStorage.setItem('loaded', 'true')
}

function initNormal() {
    const rootS = retrieveRootVariables(document.body, "--s");

    const tl = gsap.timeline({
        defaults: {
            duration: BASIC_DURATION,
            ease: "primary-ease"
        }
    })

    tl.set('.header', {
        top: rootS,
        transform: 'translateY(0%)'
    }, '<')

    tl.set('.transition', {
        y: '-100%'
    }, '>')

    tl.to('.header__logo.linemask p span.letter', {
        y: 0,
        stagger: 0.02
    })
}

function initLenis() {
    scroll = new Lenis( {
        duration: 1
    })

    scroll.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time)=>{
        scroll.raf(time * 1000);
    })

    gsap.ticker.lagSmoothing(0)
}

function initScrollServices() {
    const frontElement = document.querySelector('[data-front-element]');
    const gridContainer = document.querySelector('.services__grid');
    const finalContainerEl = document.querySelector('.service-destination[data-destination-for="2-2"]');
    const services = document.querySelectorAll('[data-translate]');
    const titleServices = document.querySelector('[data-opacity]');

    if (!frontElement || !gridContainer || !finalContainerEl) return;

    const frontElementState = Flip.getState(frontElement);

    finalContainerEl.appendChild(frontElement);

    Flip.fit(frontElement, finalContainerEl, { scale: true, absolute: true });

    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: gridContainer,
            start: 'top top',
            end: 'bottom 10%',
            scrub: true,
            onUpdate: (e) => {
                console.log(e.progress);
            }
        },
    });

    tl.add(Flip.from(frontElementState, {
        absolute: true,
        scale: true,
        duration: 1,
        ease: "primary-ease",
        onComplete: () => console.log('completed')
    }));

    services.forEach(service => {
        const column = parseInt(service.style.gridColumn);
        const row = parseInt(service.style.gridRow);
        const destination = document.querySelector(`[data-destination-for="${column}-${row}"]`);

        if (destination) {
            const serviceState = Flip.getState(service);

            destination.appendChild(service);

            Flip.fit(service, destination, { scale: true, absolute: true });

            let translateX = 0, translateY = 0;
            const value = 150;

            if (column < 2) translateX = -value;
            else if (column > 2) translateX = value;

            if (row < 2) translateY = -value;
            else if (row > 2) translateY = value;

            gsap.set(service, {
                x: translateX,
                y: translateY,
            });

            tl.add(Flip.from(serviceState, {
                absolute: true,
                scale: true,
                duration: 1,
                ease: "primary-ease",
            }), 0);
        }
    });

    tl.to(titleServices, {
        opacity: 0,
        duration: 1,
        ease: "primary-ease",
    }, 0);

}


function initFunctions() {
    initDom()
    initLenis()

    const isLoaded = localStorage.getItem('loaded')
    console.log(isLoaded, isLoaded === 'false')

    if (isLoaded !== 'true') {
        initLoader()
    } else {
        // initNormal()
        initLoader()
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('dom content loaded')
    initLenis()
    initScrollServices()
    // initFunctions();
})
