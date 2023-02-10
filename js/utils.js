const UTILS = {
    warning: document.getElementsByClassName('warning')[0],
    warningP: document.getElementsByClassName('warning')[0].getElementsByTagName('p')[0],
    popup: () =>{
        UTILS.warning.classList.remove('hidden');

        UTILS.warning.addEventListener('click', (ev)=>{
            ev.preventDefault();
            UTILS.warning.classList.add("hidden");
        });

        
        setTimeout(() => {
            if (!UTILS.warning.classList.contains('hidden')) {
                UTILS.warning.classList.add('hidden');
            }
        }, 3500);
    }
}

export {UTILS};