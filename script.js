const allEpisodes = getAllEpisodes ; //we get the data from all episodes
const state = {                          //we created a const state with an object with our episodes and with an empty string value to storage the user input.
  valuesFromFunction : getAllEpisodes(),
  
  searchTerm : ""
};

function createEpisodeCard(episode) { 
  const episodeCard = document      // we created a const to clone the template from the html file
    .getElementById("episode-card")
    .content.cloneNode(true);

  const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`; 
  const titleEl = episodeCard.querySelector("[data-name]"); // we mix the name of the episode with the code episode as a title
  titleEl.textContent = `${episode.name} - ${episodeCode}`; 
  episodeCard.querySelector("[data-summary]").textContent = episode.summary.replace(/<\/?p>/gi, ""); //using replace method and regex to eliminate the <p> tags from the summary
  const img = episodeCard.querySelector("[data-image]");
  img.src = episode.image.medium;
  img.alt = episode.name;
  
  return episodeCard;
}

function render() {
  // with this function we render the website each time we do a search

  const filteredEpisodes = state.valuesFromFunction.filter(function (episode) {
    //we filter all the data making sure the input is a string and case insensitive
    return (
      String(episode.name).toLowerCase().includes(state.searchTerm) ||
      String(episode.summary).toLowerCase().includes(state.searchTerm)
    );
  });

  const episodeCards = filteredEpisodes.map(createEpisodeCard); //For every episode that matched the search, create a DOM element (a card) for it
  document.getElementById("episodes-container").append(...episodeCards);
};

render(); //render the website with the new DOM elements

const input = document.querySelector("input"); //select the input tag and stores it in the variable input
input.addEventListener("input", function () { //fires every time the input changes (typing, pasting, deleting text)
  state.searchTerm = input.value.toLowerCase(); //stores the input value with case-insensitive in the state.searchTerm 

  document.getElementById("episodes-container").innerHTML = ""; //clear the previous list of episodes and render then creates and append the matching episodes
  render();
});


window.onload = setup;
