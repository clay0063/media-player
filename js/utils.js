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
    },
    
}

//Adds the method to the Array prototype so no need to export
Array.prototype.shuffle = function () {
    this.forEach(function (item, index, arr) {
    let other = Math.floor(Math.random() * arr.length);
    [arr[other], arr[index]] = [arr[index], arr[other]];
    });
    return this;
};
// Example usage
// let myArr = ['Mulder', 'Scully', 'Skinner'];
// myArr.shuffle();
// now myArr is shuffled.

export {UTILS};