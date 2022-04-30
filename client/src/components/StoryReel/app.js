const arrow = document.querySelector('[id="arr"]');
const storyList = document.querySelector('[id="storyList"]');

let numOfStories = storyList.querySelectorAll('[class="story"]').length;
let clickCounter = 0;
let transform = 0;

arrow.addEventListener("click", () => {
  clickCounter++;

  if (numOfStories - (5 + clickCounter) >= 0) {
    transform -= 125;
    storyList.style.transform = `translateX(${transform}px)`;
    //   storyList.computedStyleMap().get("transform")[0].x.value - 135
    // }px)`;
  } else {
    storyList.style.transform = "translateX(0)";
    clickCounter = 0;
  }
});
