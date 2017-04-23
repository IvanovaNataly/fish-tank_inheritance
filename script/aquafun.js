// Fish-tank project by Ivanova Natalia
// version 5:  ES6, inheritance, Tank, Fish, GoldFish and Catfish classes, ui script is separated

let $container = document.querySelector(".container");
let pictureGold = "img/babelfish.png";
let pictureCat = "img/catfish.png";
let goldMax = 3;
let catMax = 7;
let tank;

class Fish {
    constructor (imageUrl, $container) {
        this.$container = $container;
        this.imageUrl = imageUrl;
        this.$fishImg = this.createFishImg(this.imageUrl);
    }

    createFishImg (imageUrl) {
        let $fishImg = document.createElement("img");
        $fishImg.setAttribute("src", imageUrl);
        $fishImg.className = 'fish';
        $fishImg.style.width = "80px"; 
        $fishImg.style.height = "80px"; 
        this.$container.appendChild($fishImg);
        return $fishImg;
    }

    swim () {
        this.$fishImg.style.top = this.topOffset;
        this.$fishImg.style.right = this.rightOffset; 
       
        setInterval (() => {
            let right = parseInt(this.$fishImg.style.right, 10);

            if (right >= (this.tankWidth-(parseInt(this.$fishImg.style.width,10))) && this.$fishImg.className === 'fish') {
                this.$fishImg.className = 'fish-back';
            } else if (right <= 50 && this.$fishImg.className === 'fish-back') {
                this.$fishImg.className = 'fish';
            } else if (this.$fishImg.className.includes('fish-dead')) {
                return;
            }

            if (this.$fishImg.className === 'fish-back') {
                this.$fishImg.style.right = (right - this.fishSpeed) + "px";
            } else {
                this.$fishImg.style.right = (right + this.fishSpeed) + "px";
            }
        },50) 
    }

    eat () {
        let width = parseInt(this.$fishImg.style.width,10);
        let height = parseInt(this.$fishImg.style.height,10);
        let top = parseInt(this.$fishImg.style.top, 10);
        if (width < 160) {
            this.$fishImg.style.width = (width + 20) + "px";
            this.$fishImg.style.height = (height + 20) + "px";
            this.$fishImg.style.top = (top - this.shiftTop) + "px";
        }
    }

    die () {
        this.$fishImg.classList.add("fish-dead");
        setTimeout(() => { 
            this.$container.removeChild(this.$fishImg); 
        }, 6000);
    }
};

class GoldFish extends Fish {
     constructor (imageUrl, $container, tankWidth, tankHeight) {
        super(imageUrl, $container);
        this.tankWidth = tankWidth;
        this.tankHeight = tankHeight;

        let maxTop = tankHeight - 160 - 5; // tank's height - max fish height - padding;
        this.topOffset = Math.floor(Math.random() * (maxTop - 50 + 1)) + 50 + "px";
        this.rightOffset = "50px";
        let maxSpeed = 20;
        this.fishSpeed = Math.floor(Math.random() * (maxSpeed - 1)) + 1;
        this.shiftTop = 0;

        super.swim();
    }
}

class Catfish extends Fish{
    constructor (imageUrl, $container, tankWidth, tankHeight) {
        super(imageUrl, $container);
        this.tankWidth = tankWidth;
        this.tankHeight = tankHeight;

        let maxTop = tankHeight - 80; // tank's height - max catfish height;
        this.topOffset = maxTop + "px";
        this.rightOffset = Math.floor(Math.random() * ((this.tankWidth - 80 - 10) + 1)) + "px"; // tank's width -  catfish width - padding;
        let maxSpeed = 5;
        this.fishSpeed = Math.floor(Math.random() * (maxSpeed - 1)) + 1;
        this.shiftTop = 12;

        super.swim();
    }

}

class Tank {
    constructor ($container) {
        this.$container = $container;
        this.tankWidth = parseInt(window.getComputedStyle(document.querySelector(".container")).width, 10);
        this.tankHeight = parseInt(window.getComputedStyle(document.querySelector(".container")).height, 10);

        this.fishArr = [];
        this.catfishArr = [];

        this.$modal = document.querySelector(".modal-background");
        this.styleEl = document.createElement('style');
        document.head.appendChild(this.styleEl);
        this.styleSheet = this.styleEl.sheet;
        this.styleSheet.insertRule('.container:after {opacity:0.05;}', 0);
        this.opacity = parseFloat(window.getComputedStyle(document.querySelector('.container'), ':after').getPropertyValue('opacity')); 
    }

    addFishFunc (event) {
        var fishType = event.currentTarget.className;
        try {
            this.checkFishType(fishType);
        } catch (e) {
            this.displayModal(e.message);
        }
    }

    checkFishType (fishType) {
        if (fishType.includes('add-btn')) {
            fishType = pictureGold;
            this.addFish(fishType);
        } else {
            fishType = pictureCat;
            this.addCatfish(fishType);
        }
    }

    addFish (fishType) {
        if (this.fishArr.length % 3 == 0 && this.fishArr.length/this.catfishArr.length > 3 && this.fishArr.length) {
           throw new Error("There are too many Goldfish in the tank. Please, add a Catfish.");
        } else {
            var fish = new GoldFish(fishType, this.$container, this.tankWidth, this.tankHeight);  
            this.fishArr.push(fish);
        }
    }

    addCatfish (fishType) {
        var count = this.catfishArr.length / this.fishArr.length;
        if (count >= catMax) {
            throw new Error("There are too many Catfish in the tank. Please, add a Goldfish.");
        } else {
            var catfish = new Catfish(fishType, this.$container, this.tankWidth, this.tankHeight);    
            this.catfishArr.push(catfish);
        }
    }

    displayModal (e) {
        let $error = document.querySelector(".error-msg");
        this.$modal.style.display = "block";
        $error.textContent = e;
    }

    closeModal () {
        this.$modal.style.display = "";
    }

    feed () {
        let deadArr = [];
        let deadCatfishArr = [];

        for (let i = this.fishArr.length-1; i >= 0; i--) {
            if (i >= (this.fishArr.length-goldMax)) {
                this.fishArr[i].eat();
                this.dirt();
            } else {
                deadArr.push(this.fishArr[i]);
                this.fishArr[i].die();
            }
        }
        this.fishArr.splice(0, deadArr.length);

        for (let i = this.catfishArr.length-1; i >= 0; i--) {
            if (this.opacity >  0.05) {
                this.catfishArr[i].eat();
                this.clearing();
            } else {
                deadCatfishArr.push(this.catfishArr[i]);
                this.catfishArr[i].die();
            }
        }
        this.catfishArr.splice(0, deadCatfishArr.length);
    }

    onDirt(callback){
        this.onDirtCallback = callback;
    }

    dirt () {
        if (this.opacity >= 0.1) {
            this.displayModal("Your tank is too dirty. All fish are dead. The game is over.");
            while (this.$container.firstChild) {
                this.$container.removeChild(this.$container.firstChild);
            }
            this.fishArr = [];
            this.catfishArr = [];
            this.onDirtCallback();
        } else {
            this.opacity = Math.round((this.opacity + 0.01)*100)/100; 
            this.styleSheet.cssRules[0].style.opacity = this.opacity;   
        }
    }

    clearing () {
        this.opacity = Math.round((this.opacity - 0.01)*100)/100; 
        this.styleSheet.cssRules[0].style.opacity = this.opacity;
    }
}

tank = new Tank($container);