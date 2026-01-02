const allEpisodes = getAllEpisodes();

function createEpisodeCard(episode) {
  const episodeCard = document
    .getElementById("episode-card")
    .content.cloneNode(true);

  const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
  const titleEl = episodeCard.querySelector("[data-name]");
  titleEl.textContent = `${episode.name} - ${episodeCode}`; 
  episodeCard.querySelector("[data-summary]").textContent = episode.summary.replace(/<\/?p>/gi, "");
  const img = episodeCard.querySelector("[data-image]");
  img.src = episode.image.medium;
  img.alt = episode.name;
  
  return episodeCard;
}

const container = document.getElementById("episodes-container");


for (const episode of allEpisodes) {
  const card = createEpisodeCard(episode);
  container.appendChild(card);
}


window.onload = setup;
