const levelNavs = document.getElementById("level-navs");
const levelNavsUrl = "https://openapi.programming-hero.com/api/levels/all";

const levelTabsUrl = "https://openapi.programming-hero.com/api/level";
const levelTabs = document.getElementById("level-tabs");
const loader = document.getElementById("loader");

const isLoading = (status) => {
  status
    ? [
        loader.classList.remove("hidden"),
        loader.classList.add("flex"),
        levelTabs.classList.add("hidden"),
      ]
    : [
        loader.classList.add("hidden"),
        loader.classList.remove("flex"),
        levelTabs.classList.remove("hidden"),
      ];
};

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
    levelBtn.setAttribute("id", `nav-btn-${level.level_no}`);
    levelBtn.innerHTML = `
        <i class="icon-book-open"></i>
        <span>Lesson - ${level.level_no}</span>
    `;
    levelNavs.appendChild(levelBtn);
  });
};

const removeActive = () => {
  const navBtns = document.querySelectorAll("#level-navs button");
  navBtns.forEach((navBtn) => {
    navBtn.classList.remove("active");
  });
};

const getLevelTabs = (id) => {
  isLoading(true);
  fetch(`${levelTabsUrl}/${id}`)
    .then((res) => res.json())
    .then((levelTabs) => {
      showLevelTabs(levelTabs);
      removeActive();
      // This click Button active class here because, the button is linked with the specific tab, and the tabs are paired with the individual buttons (id parameter links). So, we did it here.
      const clickBtn = document.getElementById(`nav-btn-${id}`);
      clickBtn.classList.add("active");
    });
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
                  <button 
                    class="btn btn-soft btn-primary text-lg text-slate-700 hover:text-white"
                    onclick="showCardModal(${card.id})"
                  >
                      <i class="icon-info"></i>
                  </button>
                  <button class="btn btn-soft btn-primary text-lg text-slate-700 hover:text-white">
                      <i class="icon-volume-2"></i>
                  </button>
              </div>
          `;
      levelTabs.appendChild(levelCard);
      isLoading(false);
    });
  } else {
    levelTabs.innerHTML = `
        <div class="lg:py-11 py-4 text-center font-medium col-span-full">
            <figure class='w-max mx-auto mb-4'><img src='assets/alert-error.png'></figure>
            <p class="font-bn text-sm">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <p class="font-bn lg:text-4xl text-3xl mt-3">নেক্সট Lesson এ যান</p>
        </div>
    `;
    isLoading(false);
  }
};
const wordUrl = "https://openapi.programming-hero.com/api/word";
const showCardModal = (id) => {
  fetch(`${wordUrl}/${id}`)
    .then((res) => res.json())
    .then((detail) => getWordDetail(detail.data));
};
const getWordDetail = (word) => {
  const wordModal = document.getElementById("word_modal");
  wordModal.innerHTML = `
    <div class="modal-box p-5">
      <div class='border border-gray-200 p-5 rounded-md'>
        <h4 class='text-4xl font-semibold mb-8 flex items-center'>
        ${word.word}
          (<div class='flex items-center'>
            <i class='icon-mic'></i>:
            <span class='ms-2'>${word.pronunciation}</span>
          </div>)
        </h4>
        <h5 class='font-semibold mb-8'>Meaning
         <span class='block font-bn font-medium mt-2'>${word.meaning}</span>
        </h5>
        <h5 class='font-semibold mb-8'>Example
         <span class='block font-medium mt-2'>${word.sentence}</span>
        </h5>
        <h5 class='font-semibold'>
         <span class='font-bn'>সমার্থক শব্দ গুলো</span>
         <div class='mt-2 flex gap-3'>${word.synonyms
           .map(
             (synonym) =>
               `<span class='badge badge-soft badge-primary badge-lg font-normal rounded-sm p-4'>${synonym}</span>`
           )
           .join("")}</div>
        </h5>
        
      </div>
      <div class="modal-action justify-start">
          <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn btn-primary rounded-lg">Complete Learning</button>
          </form>
      </div>          
    </div>
  `;
  wordModal.showModal();
};

const showTab = (id) => {
  getLevelTabs(id);
};
