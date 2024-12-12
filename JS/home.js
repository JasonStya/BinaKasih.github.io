const swiper = new Swiper('.card-wrapper', {
    loop: true,
    spaceBetween:30,

    // Pagination bullets
    pagination: {
        el: '.swiper-pagination',
        clickable:true,
        dyanamicBullets:true
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    breakpoints:{
        0:{
            slidesPerView:1
        },
        768:{
            slidesPerView:2
        },
        1024:{
            slidesPerView:3
        },
    }
});


