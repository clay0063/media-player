const UTILS = {
    warning: document.querySelector('.warning'),
    warningP: document.querySelector('.warning p'),
    popup: () =>{
        UTILS.warning.classList.remove('hidden');

        //click to clear
        UTILS.warning.addEventListener('click', (ev)=>{
            ev.preventDefault();
            UTILS.warning.classList.add("hidden");
        });

        //or clear automatically if not clicked
        setTimeout(() => {
            if (!UTILS.warning.classList.contains('hidden')) {
                UTILS.warning.classList.add('hidden');
            }
        }, 3500);
    }
}

export {UTILS};