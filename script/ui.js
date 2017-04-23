( function () { 
    'use strict';

    var $addGold = document.querySelector(".add-btn");
    var $addCat = document.querySelector(".cat-btn");
    var $feed = document.querySelector(".feed-btn");
    var $closeModal = document.querySelector(".err-btn");

    function addFish(e){
        tank.addFishFunc(e);
    }

    $addGold.addEventListener("click", addFish);

    $addCat.addEventListener("click", addFish);


    $feed.addEventListener("click", function() {
        tank.feed();
    })

    $closeModal.addEventListener("click", function() {
        tank.closeModal();
    })

    tank.onDirt(function(){
        $addGold.removeEventListener("click", addFish);
        $addCat.removeEventListener("click", addFish);
        $feed.removeEventListener("click", function() {
            tank.feed();
        })
    });

}) ();