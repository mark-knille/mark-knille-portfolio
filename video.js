// Featured clip(s) for the podcast case study, picked by Mark. Add one entry per clip:
//   { id: "file-name", title: "Episode 26 — Clip", type: "Vertical Reel · 0:45", orientation: "vertical" }
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
        <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span>
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

// Only one clip plays at a time.
document.addEventListener('play', (e) => {
  document.querySelectorAll('.reel video').forEach(video => {
    if (video !== e.target) video.pause();
  });
}, true);
