"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm( /* term */) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let response = await axios.get(`https://www.tvmaze.com/api#show-search`)

}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="http://static.tvmaze.com/uploads/images/medium_portrait/160/401704.jpg" 
              alt="Bletchly Circle San Francisco" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
const MISSING_IMAGE_URL = "https://static.thenounproject.com/png/82078-200.png"

async function searchShows(query) {
  let response = await axios.get(
    `http://api.tvmaze.com/search/shows?q=${query}`
  );
  let shows = response.data.map(results => {
    let show = results.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : MISSING_IMAGE_URL

    };
  });
  return shows;
}

/**Populate list of shows */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
     <div class="card" data-show-id="${show.id}">
       <img class="card-img-top" src="${show.image}">
       <div class="card-body">
         <h5 class="card-title">${show.name}</h5>
         <p class="card-text">${show.summary}</p>
         <button class="btn btn-primary get-episodes">Episodes</button>
       </div>
     </div>  
   </div>
  `) /**this is the outline */
    $showsList.append($item);
  }
}


/**Handle the Submission Form, hide ep. area and get the 
 * list of matching shows and shows in the show list
 */

$("search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episode-area").area();
  let shows = await searchShows(query);

  populateShows(shows);
});

async function getEpisodes(id) {
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  let episodes = response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
  }));
  return episode
}



/** give lists of episode and episodes to the DOM */

function populateEpisodes(episodes) {
  const $episodeList = $("#episode-list");
  $episodeList.empty();

  for (let episode of episodes) {
    let $item = $(`<li>
    ${episode.name}
    (season ${episode.season}, episode ${episode.number})
  </li>
    `);

    $episodesList.append($item);
  }

  $episodeList.append($item);

}

/**click handler for when clicking on show name */
$("#shows-list").on("click", ".get-episode", async function handleEpisodeClick(evt) {
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
})