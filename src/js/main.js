window.addEventListener("DOMContentLoaded", () => {
    const selector = (item) => document.querySelector(item);
    const selectorAll = (item) => document.querySelectorAll(item);

    //Отступ при скролле к ID
    document.querySelectorAll('#mobile-menu a').forEach(link => {

        link.addEventListener('click', function (e) {
            e.preventDefault();

            let href = this.getAttribute('href').substring(1);

            const scrollTarget = document.getElementById(href);

            const topOffset = document.querySelector('header').offsetHeight;
            const elementPosition = scrollTarget.getBoundingClientRect().top;
            const offsetPosition = elementPosition - topOffset;

            window.scrollBy({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    //Функция вычисления offsetTop
    const getOffsetTop = (element) => {
        let offsetTop = 0;
        while (element) {
            offsetTop += element.offsetTop;
            element = element.offsetParent;
        }
        return offsetTop;
    };

    //Высота 100vh
    const documentHeight = () => {
        const doc = document.documentElement
        doc.style.setProperty('--doc-height', `${window.innerHeight}px`);
    }
    window.addEventListener('resize', documentHeight);
    documentHeight();

    //accordion
    const accordions = document.querySelectorAll(".accordion");

    if (accordions) {
        accordions.forEach((accordion) => {
            accordion.children[0].classList.add("active");
            accordion.children[0].children[1].style.maxHeight =
                accordion.children[0].children[1].scrollHeight + "px";

            function toggle(e) {
                e.preventDefault();
                e.stopPropagation();

                const heightHeader = document.querySelector(".header").scrollHeight;

                Array.from(accordion.children).forEach((accItem) => {
                    const content = accItem.querySelector(
                        ".accordion__item__content"
                    );

                    function onTransitionEnd(e) {
                        scrollTo({top: getOffsetTop(accItem) - heightHeader});
                    }

                    if (e.currentTarget === accItem) {
                        if (window.innerWidth < 980 && !accordion.closest('.section-mortgage__items__item')) {
                            content.addEventListener(
                                "transitionend",
                                onTransitionEnd,
                                {once: true}
                            );
                        }
                        content.style.maxHeight = content.scrollHeight + "px";
                        accItem.classList.add("active");
                    } else {
                        content.style.maxHeight = "0px";
                        accItem.classList.remove("active");
                    }
                });
            }

            Array.from(accordion.children).forEach((accItem) => {
                accItem.addEventListener("click", toggle);
            });
        });
    }

    //Модальные окна
    const modal = () => {
        const backdrop = document.querySelector("#modal-backdrop");

        const disableScroll = () => {
            let pagePosition = window.scrollY;
            document.body.classList.add("disable-scroll");
            document.body.dataset.position = pagePosition;
            document.body.style.top = -pagePosition + "px";
        };

        const enableScroll = () => {
            let pagePosition = parseInt(document.body.dataset.position, 10);
            document.body.style.top = "auto";
            document.body.classList.remove("disable-scroll");
            window.scroll({top: pagePosition, left: 0});
            document.body.removeAttribute("data-position");
        };

        function modalHandler(e) {
            const modalBtnOpen = e.target.closest(".js-modal");
            if (modalBtnOpen) {
                // open btn click
                const modalSelector = modalBtnOpen.dataset.modal;
                showModal(document.querySelector(modalSelector));
            }

            const modalBtnClose = e.target.closest(".js-modal__close");

            if (modalBtnClose) {
                // close btn click
                e.preventDefault();
                hideModal(modalBtnClose.closest(".modal"));
            }

            if (e.target.matches("#modal-backdrop")) {
                // backdrop click
                hideModal(document.querySelector(".modal.show"));
            }
        }

        function showModal(modalElem) {
            disableScroll();
            modalElem.classList.add("show");
            backdrop?.classList.remove("modal__backdrop--hidden");
        }

        function hideModal(modalElem) {
            enableScroll();
            const hideBackdrop = () => {
                modalElem.classList.remove("show");
                backdrop?.classList.add("modal__backdrop--hidden");
            };

            hideBackdrop();
        }

        document.addEventListener("click", modalHandler);

        const modalBtnMobileClose = document.querySelectorAll("#mobile-menu a");
        modalBtnMobileClose.forEach((item) => {
            if (item) {
                item.addEventListener("click", () => {
                    document.querySelector('#modal__menu').classList.remove("show");
                    backdrop?.classList.add("modal__backdrop--hidden");
                })
            }
        });
    };
    modal();

    //Gsap
    const collageImages = selectorAll('.section-faq');

    if (collageImages) {
        collageImages.forEach((item) => {
            gsap.to(item.querySelector('.section-faq__images__img-1'), {
                duration: 3,
                rotationZ: -5,
                y: "10%",
                x: "-80%",
                ease: "sine",
                scrollTrigger: {
                    trigger: item,
                    scrub: true,
                    start: "top 60%",
                    end: "bottom bottom",
                    toggleActions: "restart pause reverse pause",
                    // markers: true,
                }
            });

            gsap.to(item.querySelector('.section-faq__images__img-2'), {
                duration: 3,
                rotationZ: 5,
                y: "10%",
                x: "80%",
                ease: "sine",
                scrollTrigger: {
                    trigger: item,
                    scrub: true,
                    start: "top 60%",
                    end: "bottom bottom",
                    toggleActions: "restart pause reverse pause",
                    // markers: true,
                }
            });
        })
    }

    const blockParallax = selectorAll(".block-parallax");

    if (blockParallax) {
        blockParallax.forEach((item) => {
            item.addEventListener("mousemove", mouseMoveFunc);
        });
    }

    const itemsParallax = gsap.utils.toArray(".block-parallax");

    function mouseMoveFunc(e) {
        itemsParallax.forEach((item, index) => {
            const depth = 100;
            const moveX = (e.pageX - window.innerWidth / 2) / depth;
            const moveY = (e.pageY - window.innerHeight / 2) / depth / 6;
            index++;

            gsap.to(item, {
                x: moveX * index,
                y: moveY * index,
            });
        });
    }

    //Link More
    const moreBlocks = selectorAll(".more");

    if (moreBlocks) {
        moreBlocks.forEach((item) => {
            const moreLink = item.querySelector(".more__link");
            const moreContent = item.querySelector(".more__content");

            moreLink.addEventListener("click", () => {
                item.classList.toggle("visible");
            });
        });
    }

    //Слайдеры
    const galleryTwo = new Swiper('.slider-two', {
        loop: true,
        slidesPerView: 1,
        centeredSlides: false,
        spaceBetween: 16,
        speed: 800,
        autoplay: {
            delay: 3000,
        },
        on: {
            init() {
                this.el.addEventListener('mouseenter', () => {
                    this.autoplay.stop();
                });

                this.el.addEventListener('mouseleave', () => {
                    this.autoplay.start();
                });
            }
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
        },
        breakpoints: {
            // when window width is >= 320px
            320: {
                slidesPerView: "auto",
                freeMode: true,
                // autoplay: false
            },
        }
    });

    const galleryInnovative = new Swiper('.section-innovative__slider', {
        loop: true,
        slidesPerView: 1,
        centeredSlides: false,
        speed: 800,
        on: {
            init() {
                this.el.addEventListener('mouseenter', () => {
                    this.autoplay.stop();
                });

                this.el.addEventListener('mouseleave', () => {
                    this.autoplay.start();
                });
            }
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
        },
        breakpoints: {
            // when window width is >= 320px
            320: {
                loop: false,
                slidesPerView: "auto",
                freeMode: true,
                autoplay: false,
            },
            538: {
                autoplay: {
                    delay: 3000,
                },
            }
        }
    });


    const galleryPortfolio = new Swiper('.section-portfolio__slider', {
        loop: true,
        slidesPerView: 3,
        slidesPerColumn: 1,
        centeredSlides: true,
        spaceBetween: 40,
        speed: 800,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    const mySwiper = new Swiper('.section-style__slider', {
        // centeredSlides: true,
        slidesPerView: "auto",
        speed: 3500,
        loop: true,
        allowTouchMove: false,
        disableOnInteraction: true,
        waitForTransition: false,
        // freeMode: true,
        autoplay: {
            delay: 1,
            disableOnInteraction: false,
            pauseOnMouseEnter: false
        }
    });

    //Fancybox
    Fancybox.bind('[data-fancybox="gallery-1"]', {
        hideScrollbar: false,
        Thumbs: false,
        Hash: false,
    });

    Fancybox.bind('[data-fancybox="gallery-2"]', {
        hideScrollbar: false,
        Thumbs: false,
        Hash: false,
        autoStart: true,
    });

    Fancybox.bind('[data-fancybox="gallery-3"]', {
        hideScrollbar: false,
        Thumbs: false,
        Hash: false,
    });

    Fancybox.bind('[data-fancybox="video"]', {
        hideScrollbar: false,
        Thumbs: false,
        Hash: false,
    });

    Fancybox.bind('[data-fancybox="video-1"]', {
        hideScrollbar: false,
        Thumbs: false,
        Hash: false,
    });

    //Animation
    const parentNodeHoverItems = selectorAll(".js-hover__items");

    const addingClassHover = () => {
        if (parentNodeHoverItems) {
            parentNodeHoverItems.forEach((item) => {

                const nodeHoverItems = item.querySelectorAll(".js-hover__item");
                nodeHoverItems[1].classList.add("active");
                let currentActive = nodeHoverItems[1];

                nodeHoverItems.forEach((subItem) => {
                    subItem.addEventListener("mouseenter", (e) => {
                        let thisItem = e.target;

                        currentActive?.classList.remove("active");
                        thisItem.classList.add("active");

                        currentActive = thisItem;

                    });
                });
            })
        }
    };

    // addingClassHover();

    const plotsItems = document.querySelectorAll(".plots__slider");

    if (plotsItems.length && window.innerWidth > 540) {
        plotsItems.forEach((e) => {
            const logoSlider = new Swiper(e, {
                centeredSlides: false,
                slidesPerView: "auto",
                speed: 800,
                // loop: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                scrollbar: {
                    el: ".swiper-scrollbar",
                },
            });
        });
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth < 980) {
            const plotsItems = document.querySelectorAll(".plots__slider");

            if (plotsItems.length) {
                plotsItems.forEach((e) => {
                    const logoSlider = new Swiper(e, {
                        centeredSlides: false,
                        slidesPerView: "auto",
                    });
                });
            }
        }

        if (window.innerWidth < 770) {
            const logosItems = document.querySelectorAll(".section-innovative__slider");

            if (logosItems.length) {
                logosItems.forEach((e) => {
                    const logoSlider = new Swiper(e, {
                        slidesPerView: "auto",
                        freeMode: true,
                        direction: "horizontal",
                        mousewheel: true,
                        scrollbar: {
                            el: ".swiper-scrollbar",
                            hide: false,
                            draggable: true,
                        },
                    });
                });
            }
        }
    });

    const plotsSections = document.querySelectorAll(".section-plots");
    if (plotsSections) {
        plotsSections.forEach((item) => {
            const plotsLength = item.querySelectorAll(".plot").length;
            const btnNext = item.querySelector(".swiper-button-next");
            const btnPrev = item.querySelector(".swiper-button-prev");
            const scrolbar = item.querySelector(".swiper-scrollbar");
            if (plotsLength <= 3) {
                btnNext.style.display = 'none';
                btnPrev.style.display = 'none';
                scrolbar.style.display = 'none';
            }
        });
    }

    //Lazy load for video
    function initVideoLazyLoadingObserver() {
        const lazyVideos = document.querySelectorAll('video.lazy-video');

        if ('IntersectionObserver' in window) {
            const lazyVideoObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((video) => {
                        if (video.isIntersecting) {
                            for (const source in video.target.children) {
                                const videoSource = video.target.children[source];

                                if (typeof videoSource.tagName === 'string' && videoSource.tagName === 'SOURCE') {
                                    videoSource.src = videoSource.dataset.src;
                                }
                            }

                            video.target.load();
                            video.target.classList.remove('lazy');
                            lazyVideoObserver.unobserve(video.target);
                        }
                    });
                },
                {
                    rootMargin: '1000px',
                }
            );

            lazyVideos.forEach((lazyVideo) => lazyVideoObserver.observe(lazyVideo));
        }
    }

    initVideoLazyLoadingObserver();

    //Кнопка длинная, разбитие текста
    const longBtnText = document.querySelectorAll('.lid span.b-2');
    if (longBtnText) {
        longBtnText.forEach((item) => {
            const arr = item.innerHTML.split(/\s+/);
            let str = '';

            for (let i = 0; i < arr.length; i++) {
                if (arr[i]) {
                    arr[i] = '<span>' + arr[i] + '</span>';
                }
            }

            item.innerHTML = arr.join(' ');
        });
    }

    //Genplan
    const genplanIframe = selector(".section-genplan__iframe");
    const btnForm = selector(".btn__genplan-form");

    const currentURL = window.location.href;

    function detectWebGLContext() {
        try {
            const gl = document.createElement('canvas').getContext('webgl2');
            if (!gl) {
                console.log('your browser/OS/drivers do not support WebGL2');
                return false
            } else {
                console.log('webgl2 works!');
                return true
            }
        } catch(e) {
            console.error(e)
        }
    }

    const getDeviceType = () => {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "Tablet";
        }
        if (
            /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
                ua
            )
        ) {
            return "Mobile";
        }
        return "Desktop";
    };

    const  syncQueryParams = () => {
        const urlParams = new URLSearchParams(window.location.search);

        const openLandForm = urlParams.get('open-land-form');

        if (openLandForm) {

            setTimeout(() => btnForm.click(), 1000)
        }
    };

    syncQueryParams();

    const genplanIframeEvents = {
        ['genplan:fullSize']() {
            genplanIframe.classList.add("fullscreen");
        },
        ['genplan:defaultSize']() {
            genplanIframe.classList.remove("fullscreen");
        },
        ['genplan:landDetail']() {
        },
        ['genplan:submitApplication']() {
            btnForm.click();
        },
        ['genplan:request-visit']: async() => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const { ip } = await response.json()

                genplanIframe.contentWindow.postMessage({
                    eventName: 'genplan:response-visit',
                    payload: {
                        site: currentURL,
                        ip,
                        hasWebGl: detectWebGLContext(),
                        deviceType: getDeviceType(),
                    }
                }, '*')
            } catch(e) {
                console.error(e)
            }
        }
    };

    // function mouseEnterGenplan() {
    //     genplanIframe.contentWindow.postMessage(
    //         {
    //             eventName: 'genplan:mouse-enter',
    //         },
    //         '*'
    //     );
    // }
    //
    // function mouseExitGenplan() {
    //     genplanIframe.contentWindow.postMessage(
    //         {
    //             eventName: 'genplan:mouse-exit',
    //         },
    //         '*'
    //     );
    // }
    //
    // genplanIframe.addEventListener('mouseenter', mouseEnterGenplan)
    // genplanIframe.addEventListener('mouseleave', mouseExitGenplan)

    function openGenplan() {
        genplanIframe.contentWindow.postMessage(
            {
                eventName: 'genplan:open-genplan',
            },
            '*'
        );
    }

    const btnGenplanMob = document.querySelector('.btn-genplanMob');
    btnGenplanMob.addEventListener('click', () => {
        genplanIframeEvents["genplan:fullSize"]();
        genplanIframe.contentWindow.postMessage('genplan:setSize:full', '*');
        openGenplan();
    })

    window.addEventListener('message', (event) => {
        if (event.origin !== "https://lk.stage.lokeodata.ru") return;

        if (event.data && event.data.includes('genplan:landDetail')) {
            const message = event.data;

            if (message.split(':').length > 2) {
                window.open(message.split(':').slice(-2).join(':'), '_blank');
            }
        }

        genplanIframeEvents[event.data]?.();
    });

    const btnGenplan = document.querySelectorAll(".btn-genplan");

    btnGenplan.forEach((item) => {
        const villageId = item.dataset.villageid;
        const landId = item.dataset.landid;

        item.addEventListener("click", () => {
            sendIframeMessage(villageId, landId);
        })

        if (window.innerWidth < 941) {
            item.addEventListener("click", () => {
                genplanIframeEvents["genplan:fullSize"]();
                genplanIframe.contentWindow.postMessage('genplan:setSize:full', '*');
            })
        }
    });

    function sendIframeMessage(villageId, landId) {
        genplanIframe.contentWindow.postMessage(`genplan:openLand:${villageId}:${landId}`, '*');
    }

    const linkGenplan = document.querySelector(".nav__list .link-genplan");
    const linkGallery = document.querySelector(".nav__list .link-gallery");
    const linkEnvironment = document.querySelector(".nav__list .link-environment");
    const linkInnovative = document.querySelector(".nav__list .link-innovative");

    const linkMobGenplan = document.querySelector("#mobile-menu .link-genplan");
    const linkMobGallery = document.querySelector("#mobile-menu .link-gallery");
    const linkMobEnvironment = document.querySelector("#mobile-menu .link-environment");
    const linkMobInnovative = document.querySelector("#mobile-menu .link-innovative");

    const linkFooterGenplan = document.querySelector(".footer__list .link-genplan");
    const linkFooterGallery = document.querySelector(".footer__list .link-gallery");
    const linkFooterEnvironment = document.querySelector(".footer__list .link-environment");
    const linkFooterInnovative = document.querySelector(".footer__list .link-innovative");

    const blockGenplan = document.querySelector("#genplan");
    const blockGallery = document.querySelector("#gallery");
    const blockEnvironment = document.querySelector("#environment");
    const blockInnovative = document.querySelector("#innovative");

    const hideLink = (link, block) => {
        if (!block) {
            link.style.display = 'none';
        }
    }

    hideLink(linkGenplan, blockGenplan);
    hideLink(linkGallery, blockGallery);
    hideLink(linkEnvironment, blockEnvironment);
    hideLink(linkInnovative, blockInnovative);

    hideLink(linkMobGenplan, blockGenplan);
    hideLink(linkMobGallery, blockGallery);
    hideLink(linkMobEnvironment, blockEnvironment);
    hideLink(linkMobInnovative, blockInnovative);

    hideLink(linkFooterGenplan, blockGenplan);
    hideLink(linkFooterGallery, blockGallery);
    hideLink(linkFooterEnvironment, blockEnvironment);
    hideLink(linkFooterInnovative, blockInnovative);

    const hrefLinkAcs = 'https://www.s-sols.com/ru/products/wordpress/accelerator';
    const linkAks = document.querySelector(`a[href*="${hrefLinkAcs}"]`);
    if (linkAks) {
        linkAks.style.display = 'none';
    }
});