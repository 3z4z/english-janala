const levelNavs = document.getElementById("level-navs");
const levelNavsUrl = "https://openapi.programming-hero.com/api/levels/all";

const levelTabsUrl = "https://openapi.programming-hero.com/api/level";
const levelTabs = document.getElementById("level-tabs");
const loader = document.getElementById("loader");

const faqData = [
  {
    id: 1,
    question: "How can I start learning English on this website?",
    answer:
      "You can start by exploring our beginner lessons, interactive exercises, and quizzes. We also offer structured courses to guide you step by step.",
  },
  {
    id: 2,
    question: "Is this website free to use?",
    answer:
      "Yes! Our website is completely free to use, and you can start learning right away without any hidden charges.",
  },
  {
    id: 3,
    question: "Do I need to create an account?",
    answer:
      "No, you don’t need an account to get started. However, creating one gives you extra benefits like saving progress and personalized recommendations.",
  },
  {
    id: 4,
    question: "How can I build my English vocabulary?",
    answer:
      "You can grow your vocabulary through our fun exercises, word lists, and practice activities. We make learning new words simple, interactive, and enjoyable.",
  },
  {
    id: 5,
    question: "Do you offer certificates for completed courses?",
    answer:
      "Yes, once you complete a course, you’ll receive a certificate to celebrate your achievement and showcase your progress. 🎉",
  },
];
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
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}
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
  const faqContainer = document.getElementById("faq-container");
  faqData.map((faq) => {
    const faqCard = document.createElement("div");
    faqCard.innerHTML = `
    <div class="bg-base-100 border-base-300 shadow-sm shadow-gray-300 collapse border mb-5">
          <input type="checkbox" class="peer" />
          <div class="collapse-title bg-slate-100 peer-checked:bg-slate-200">
              <span class='me-2'>${faq.id}.</span> ${faq.question}
          </div>
          <div
              class="collapse-content bg-slate-100 text-gray-600 peer-checked:bg-slate-200 peer-checked:text-gray-600">
              ${faq.answer}
          </div>
      </div>
    `;
    faqContainer.appendChild(faqCard);
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
      showLevelTabs(levelTabs.data);
      removeActive();
      // This click Button active class here because, the button is linked with the specific tab, and the tabs are paired with the individual buttons (id parameter links). So, we did it here.
      const clickBtn = document.getElementById(`nav-btn-${id}`);
      clickBtn.classList.add("active");
    });
};

const showLevelTabs = (tabCards) => {
  if (tabCards.length > 0) {
    levelTabs.innerHTML = "";
    tabCards.forEach((card) => {
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
                  <button onclick=pronounceWord('${
                    card.word
                  }') class="btn btn-soft btn-primary text-lg text-slate-700 hover:text-white">
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
    .then((detail) => getModal(detail.data));
};
const getModal = (word) => {
  const wordModal = document.getElementById("word_modal");
  wordModal.innerHTML = `
    <div class="modal-box p-6">
      <div class='border border-gray-200 p-5 rounded-md'>
        <h4 class='text-4xl font-semibold mb-8 flex items-center flex-wrap'>
        ${word.word}
          <div class='flex items-center'>
            (<i class='icon-mic'></i>:
            <span class='ms-2'>${word.pronunciation})</span>
          </div>
        </h4>
        <h5 class='font-semibold mb-8'>Meaning
         <span class='block font-bn font-medium mt-2'>${word.meaning}</span>
        </h5>
        <h5 class='font-semibold mb-8'>Example
         <span class='block font-medium mt-2'>${word.sentence}</span>
        </h5>
        <h5 class='font-semibold'>
         <span class='font-bn'>সমার্থক শব্দ গুলো</span>
         <div class='mt-2 flex gap-3 flex-wrap'>${word.synonyms
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

const searchBtn = document.getElementById("search-btn");
const allWordsUrl = "https://openapi.programming-hero.com/api/words/all";
const searchInput = document.getElementById("search-input");

searchBtn.addEventListener("click", () => {
  isLoading(true);
  fetch(allWordsUrl)
    .then((res) => res.json())
    .then((words) => {
      const result = words.data.filter((word) =>
        word.word.includes(searchInput.value.toLowerCase())
      );
      result.length > 0
        ? searchInput.value.length > 0
          ? [showLevelTabs(result), (searchInput.value = "")]
          : (levelTabs.innerHTML = emptyTab)
        : (levelTabs.innerHTML = noResult);
    })
    .finally(() => isLoading(false));
  removeActive();
});
const emptyTab = `
<div class='h-[10rem] col-span-full flex items-center justify-center flex-col'>
    <i class='icon-search-x text-gray-600' style='font-size: 4rem'></i>
    <p class='text-gray-800'>Type something to search or select a <span class='text-primary font-semibold'>lesson</span></p>
</div>
`;

const noResult = `
<div class='h-[10rem] col-span-full flex items-center justify-center flex-col'>
    <i class='icon-triangle-alert text-red-700' style='font-size: 4rem'></i>
    <p class='text-red-700'>No Result found!</p>
</div>
`;
searchInput.addEventListener("keydown", (e) => {
  e.key === " " ? e.preventDefault() : e;
});
