// Featured clip(s) for the podcast case study, picked by Mark. Add one entry per clip:
//   { id: "file-name", title: "Episode 28 — Reel 1", type: "Vertical Reel · 0:45", orientation: "vertical" }
// Files live in videos/<id>.mp4 with a poster at videos/posters/<id>.jpg (web-compressed, ~10 MB).
// preload="none" means nothing downloads until a visitor presses play, so page speed is unaffected.
const FEATURED_CLIPS = [];

function createReel(clip) {
  const fig = document.createElement('figure');
  fig.className = `reel card ${clip.orientation}`;
  fig.innerHTML = `
    <div class="reel-media">
      <video src="videos/${clip.id}.mp4" poster="videos/posters/${clip.id}.jpg" preload="none" playsinline></video>
      <button class="reel-play" type="button" aria-label="Play ${clip.title}">
        <span class="play-badge"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span>
      </button>
    </div>
    <figcaption><strong>${clip.title}</strong><span>${clip.type}</span></figcaption>
  `;

  const video = fig.querySelector('video');
  fig.querySelector('.reel-play').addEventListener('click', () => {
    video.controls = true;
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
