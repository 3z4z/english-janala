const levelNavs = document.getElementById("level-navs");
const levelNavsUrl = "https://openapi.programming-hero.com/api/levels/all";
const getLevelNavs = () => {
  fetch(levelNavsUrl)
    .then((res) => res.json())
    .then((levels) => showLevels(levels));
};
window.addEventListener("load", () => getLevelNavs());
const showLevels = (levels) => {
  levels.data.forEach((level) => {
    const levelBtn = document.createElement("button");
    levelBtn.classList.add("btn", "btn-outline", "btn-primary");
    levelBtn.setAttribute(
      "title",
      `Level ${level.level_no} - ${level.lessonName}`
    );
    levelBtn.setAttribute("onclick", `showTab(${level.level_no})`);
    levelBtn.innerHTML = `
        <i class="icon-book-open"></i>
        <span>Lesson - ${level.level_no}</span>
    `;
    levelNavs.appendChild(levelBtn);
  });
};

const levelTabsUrl = "https://openapi.programming-hero.com/api/level";
const levelTabs = document.getElementById("level-tabs");
const getLevelTabs = (id) => {
  fetch(`${levelTabsUrl}/${id}`)
    .then((res) => res.json())
    .then((levelTabs) => showLevelTabs(levelTabs));
};
const showLevelTabs = (tabCards) => {
  if (tabCards.data.length > 0) {
    levelTabs.innerHTML = "";
    tabCards.data.forEach((card) => {
      const levelCard = document.createElement("div");
      levelCard.classList.add(
        "bg-white",
        "p-12",
        "text-center",
        "rounded-lg",
        "flex",
        "flex-col",
        "justify-between"
      );
      levelCard.innerHTML = `
              <div>
                <h4 class="text-3xl font-bold">${
                  card.word ? card.word : "No data Found"
                }</h4>
                <p class="font-medium text-gray-700 my-6">Meaning / Pronounciation</p>
                <h4 class="font-bn text-3xl font-medium text-gray-700">"${
                  card.meaning ? card.meaning : "No data Found"
                } / ${
        card.pronunciation ? card.pronunciation : "No data Found"
      }"</h4>
              </div>
              <div class="mt-14 flex justify-between">
                  <button class="btn btn-soft btn-primary text-lg text-slate-700 hover:text-white">
                      <i class="icon-info"></i>
                  </button>
                  <button class="btn btn-soft btn-primary text-lg text-slate-700 hover:text-white">
                      <i class="icon-volume-2"></i>
                  </button>
              </div>
          `;
      levelTabs.appendChild(levelCard);
    });
  } else {
    levelTabs.innerHTML = `
        <div class="lg:py-11 py-4 text-center font-medium col-span-full">
            <figure class='w-max mx-auto mb-4'><img src='assets/alert-error.png'></figure>
            <p class="font-bn text-sm">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <p class="font-bn lg:text-4xl text-3xl mt-3">নেক্সট Lesson এ যান</p>
        </div>
    `;
  }
};
const showTab = (id) => {
  getLevelTabs(id);
};
