const state = {
  shows: [], //storage the shows

  selectedShowId: null, //storage the user input for the selected show

  episodes: [], //storage the episodes

  selectedEpisodeId: [], //storage the user input for the selected episode

  searchTerm: "",

  showsError: null, // we create properties to charge different messages on the UI.

  episodesLoading: false,

  episodesError: null,
};
const input = document.querySelector("input");
const showDropdown = document.getElementById("show-select");
const episodeDropdown = document.getElementById("episode-select");
const backToShows = document.getElementById("back-to-shows");



function stripHTML(html) {        //function to delete the tags in the summary

  if (!html) {
    return "No summary available";
  } else {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || "";
  }
};


function populateShowDropdown(shows) {
  showDropdown.innerHTML = '<option value="">Select a show</option>';

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showDropdown.appendChild(option);
  });
};

function populateEpisodeDropdown(episodes) {  // Populate episode dropdown after fetching episodes
  episodeDropdown.innerHTML = '<option value="">Select an episode</option>';
  episodes.forEach((ep) => {
    const option = document.createElement("option");
    option.value = ep.id;
    option.textContent = `${ep.name} - S${String(ep.season).padStart(2, "0")}E${String(ep.number).padStart(2, "0")}`;
    episodeDropdown.appendChild(option);
  });
};


function createShowCard(show) {
  const showCard = document.getElementById("show-card").content.cloneNode(true);

  showCard.querySelector("[data-name]").textContent = show.name;
  showCard.querySelector("[data-summary]").textContent = stripHTML(show.summary);
  
  const img = showCard.querySelector("[data-image]");
  const placeholder = "https://via.placeholder.com/210x295?text=No+Image+Available";
  img.src = show.image?.medium || placeholder;
  img.alt = show.name || "show poster";
 
  showCard.querySelector("[data-rating]").textContent = show.rating?.average || "N/A";
  
  const genres = Array.isArray(show.genres) && show.genres.length > 0 ? show.genres.join(" ") : "no genres";
  showCard.querySelector("[data-genres]").textContent = genres;
  
  showCard.querySelector("[data-status]").textContent = show.status || "Unknown";
  showCard.querySelector("[data-runtime]").textContent = show.runtime ? `${show.runtime} mins`: "N/A";

  showCard.querySelector(".show-card").addEventListener("click", function () {
    state.selectedShowId = show.id;

    document.querySelector("input").value = "";
    state.searchTerm = "";

    fetchEpisodes(show.id);

  });
  return showCard;
};



function createEpisodeCard(episode) {
  const episodeCard = document // we created a const to clone the template from the html file
    .getElementById("episode-card")
    .content.cloneNode(true);

  const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
  const titleEl = episodeCard.querySelector("[data-name]"); // we mix the name of the episode with the code episode as a title
  titleEl.textContent = `${episode.name} - ${episodeCode}`;
  episodeCard.querySelector("[data-summary]").textContent = stripHTML(episode.summary);
  const img = episodeCard.querySelector("[data-image]");
  img.src = episode.image?.medium || "";
  img.alt = episode.name;

  return episodeCard;
};

function isValidShow(show) {
  return (show.name && show.id);
}

function renderShows() {
  const showsContainer = document.getElementById("shows-container");
  const episodesContainer = document.getElementById("episodes-container");

  showsContainer.innerHTML = "";
  episodesContainer.innerHTML = "";

  if (state.showsError) {
    //rendering error message for the user
    showsContainer.textContent = `Error: ${state.showsError}`;
    return;
  } 

  const filteredShows = state.shows.filter(function (show) {
    //we filter all the data making sure the input is a string and case insensitive
    return (
      String(show.name).toLowerCase().includes(state.searchTerm) ||
      String(show.summary).toLowerCase().includes(state.searchTerm)
    );
  });

  const showCards = filteredShows.map(createShowCard);
  showsContainer.append(...showCards);
}

function renderEpisodes() {
  // with this function we render the website each time we do a search
  const showsContainer = document.getElementById("shows-container");
  const container = document.getElementById("episodes-container"); // created to load the messages in case the data is still not there.

  showsContainer.innerHTML = "";
  container.innerHTML = "";

  if (state.episodesLoading) {
    // rendering loading message for the user
    container.textContent = "loading episodes...";
    return;
  }

  if (state.episodesError) {
    //rendering error message for the user
    container.textContent = `Error: ${state.episodesError}`;
    return;
  }

  const filteredEpisodes = state.episodes.filter(function (episode) {
    //we filter all the data making sure the input is a string and case insensitive
    return (
      String(episode.name).toLowerCase().includes(state.searchTerm) ||
      String(episode.summary).toLowerCase().includes(state.searchTerm)
    );
  });

  const episodeCards = filteredEpisodes.map(createEpisodeCard); //For every episode that matched the search, create a DOM element (a card) for it
  document.getElementById("episodes-container").append(...episodeCards);
};

const endpoint = "https://api.tvmaze.com/shows";

const fetchShows = async () => {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error("error fetching shows");
    }
    return await response.json();
  } catch (error) {
    state.showsError = error.message;
    return [];
  }
};

const fetchEpisodes = async (showId) => {
  state.episodesLoading = true;
  state.episodesError = null;
  state.episodes = [];
  renderEpisodes();

  try {
    const response = await fetch(
      `https://api.tvmaze.com/shows/${showId}/episodes`
    );
    if (!response.ok) {
      throw new Error("error fetching episodes");
    }
    const episodes = await response.json(); // if the async function returns the response, show the data, if not, throw an error.
    state.episodes = episodes;
    state.episodesLoading = false;
    populateEpisodeDropdown(episodes); 
    renderEpisodes();
  } catch (error) {
    state.episodesError = error.message;
    state.episodesLoading = false;
    renderEpisodes();
  }
};

backToShows.addEventListener("click", () => {
  // 1. Reset the state so the logic knows we are back on the "Shows" view
  state.selectedShowId = null;
  state.episodes = [];
  state.searchTerm = "";

  // 2. Clear UI elements
  input.value = "";
  showDropdown.value = "";
  clearEpisodeDropdown();

  // 3. Trigger the render
  renderShows();
});


input.addEventListener("input", function () {  //select the input tag and stores it in the variable input
  //fires every time the input changes (typing, pasting, deleting text)
  state.searchTerm = input.value.toLowerCase(); //stores the input value with case-insensitive in the state.searchTerm

  if (!state.selectedShowId) {
    renderShows();
  } else {
    const episodesContainer = document.getElementById("episodes-container");
    episodesContainer.innerHTML = ""; //clear the previous list of episodes and render then creates and append the matching episodes
    renderEpisodes(); // render after the user input changes
  }
});

function clearEpisodeDropdown() {
  const episodeDropdown = document.getElementById("episode-select");
  episodeDropdown.innerHTML = '<option value="">Select an episode</option>';
};



showDropdown.addEventListener("change", (event) => {
  const selectedId = event.target.value;

  if (selectedId) {
    state.selectedShowId = Number(selectedId);
    state.searchTerm = "";
    input.value = "";

    fetchEpisodes(state.selectedShowId);
  } else {
    state.selectedShowId = null;
    state.episodes = [];
    clearEpisodeDropdown();
    renderShows();
  }
});

episodeDropdown.addEventListener("change", (event) => {
  const selectedEpisodeId = Number(event.target.value);

  if (selectedEpisodeId) {
    const episode = state.episodes.find((ep) => ep.id === selectedEpisodeId);
    if (episode) {  // Only render the selected episode
      const container = document.getElementById("episodes-container");
      container.innerHTML = "";
      container.append(createEpisodeCard(episode));
    }
  } else {
    renderEpisodes(); // If "Select an episode" is chosen, show all episodes
  }
});



fetchShows().then(function (shows) {

  const validShows = shows.filter(isValidShow);
  console.log(`Total shows fetched: ${shows.length}`);
  console.log(
    `Shows removed due to invalid format: ${shows.length - validShows.length}`
  );
  state.shows = validShows;
  state.shows.sort((a, b) => a.name.localeCompare(b.name));
  populateShowDropdown(state.shows);
  renderShows();
});
