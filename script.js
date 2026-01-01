const allEpisodes = getAllEpisodes();

function createEpisodeCard(episode) {
  const episodeCard = document
    .getElementById("episode-card")
    .content.cloneNode(true);
  episodeCard.querySelector("h3").textContent = episode.name;
  episodeCard.querySelector("p").textContent = episode.season;
  episodeCard.querySelector("[data-number]").textContent = episode.number;
  episodeCard.querySelector("[data-summary]").textContent = episode.summary;


  return episodeCard;
}

document.body.append(createEpisodeCard(allEpisodes));

const episodeCards = [];
for (const episode of allEpisodes) {
  const card = createEpisodeCard(episode);
  document.body.appendChild(card);
  episodeCards.push(card);
}

document.body.append(...episodeCards);


window.onload = setup;
