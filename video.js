// Video players that never slow the page down:
// - Each clip starts as a lazy-loaded poster image with a play button. No <video> element exists
//   until a visitor clicks, so a page with many clips downloads zero video bytes on load.
// - Files are web-compressed with scripts/webclip.swift (720p H.264, fast-start, ~10 MB per minute)
//   and live in videos/<id>.mp4, with a poster at videos/posters/<id>.jpg (~100 KB).

// Featured clip(s) for the podcast case study, picked by Mark. Add one entry per clip:
//   { id: "file-name", title: "Episode 28 — Reel 1", type: "Vertical Reel · 0:45", orientation: "vertical" }
const FEATURED_CLIPS = [];

function createReel(clip) {
  const [w, h] = clip.orientation === 'vertical' ? [540, 960] : [960, 540];
  const fig = document.createElement('figure');
  fig.className = `reel card ${clip.orientation}`;
  fig.innerHTML = `
    <div class="reel-media">
      <button class="reel-play" type="button" aria-label="Play ${clip.title}">
        <img src="videos/posters/${clip.id}.jpg" alt="" width="${w}" height="${h}" loading="lazy" decoding="async">
        <span class="play-badge"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span>
      </button>
    </div>
    <figcaption><strong>${clip.title}</strong><span>${clip.type}</span></figcaption>
  `;

  fig.querySelector('.reel-play').addEventListener('click', (e) => {
    const video = document.createElement('video');
    video.src = `videos/${clip.id}.mp4`;
    video.poster = `videos/posters/${clip.id}.jpg`;
    video.controls = true;
    video.playsInline = true;
    e.currentTarget.replaceWith(video);
    fig.classList.add('is-playing');
    video.play();
  });
  return fig;
}

// Renders the clips into rootId, or removes the whole wrapping section when none are set yet.
function renderClips(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;
  if (!FEATURED_CLIPS.length) {
    (root.closest('[data-clip-section]') || root).remove();
    return;
  }
  FEATURED_CLIPS.forEach(clip => root.appendChild(createReel(clip)));
}

// Renders grouped clips (video.html): each group gets a header, optional notes, and a row of players.
function renderVideoGroups(rootId, groups) {
  const root = document.getElementById(rootId);
  if (!root) return;

  groups.forEach(group => {
    const groupEl = document.createElement('div');
    groupEl.className = 'gallery-group';
    groupEl.innerHTML = `
      <div class="gallery-group-header"><h3>${group.name}</h3><span class="gallery-group-client">${group.client}</span></div>
      ${group.notes ? `<p class="video-notes">${group.notes}</p>` : ''}
    `;

    const row = document.createElement('div');
    row.className = 'reel-row';
    group.clips.forEach(clip => row.appendChild(createReel({ ...clip, orientation: group.orientation })));
    groupEl.appendChild(row);
    root.appendChild(groupEl);
  });
}

// Click-to-load YouTube players: <div class="yt-embed" data-yt="VIDEO_ID" data-title="..."> holding a
// .yt-play button with a poster image. YouTube's player scripts only load after the click.
function initYouTubeEmbeds() {
  document.querySelectorAll('.yt-embed').forEach(box => {
    box.querySelector('.yt-play').addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${box.dataset.yt}?autoplay=1&rel=0`;
      iframe.title = box.dataset.title || 'YouTube video';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      box.replaceChildren(iframe);
    });
  });
}

// Only one clip plays at a time.
document.addEventListener('play', (e) => {
  document.querySelectorAll('.reel video').forEach(video => {
    if (video !== e.target) video.pause();
  });
}, true);
