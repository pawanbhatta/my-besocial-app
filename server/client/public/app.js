const arrow = document.querySelector('[id="arr"]');
const storyList = document.querySelector('[id="storyList"]');

let numOfStories = storyList.querySelectorAll('[class="story"]').length;
let clickCounter = 0;

arrow.addEventListener("click", () => {
  clickCounter++;

  if (numOfStories - (5 + clickCounter) >= 0) {
    storyList.style.transform = `translate(${
      storyList.computedStyleMap().get("transform")[0].x.value - 135
    }px)`;
  } else {
    storyList.style.transform = "translateX(0)";
    clickCounter = 0;
  }
});
