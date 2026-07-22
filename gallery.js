const galleries = {};

function renderGallery(rootId, groups, ratios, galleryName) {
  const root = document.getElementById(rootId);
  if (!root) return [];
  const flat = [];

  groups.forEach(group => {
    const groupEl = document.createElement('div');
    groupEl.className = 'gallery-group';

    const header = document.createElement('div');
    header.className = 'gallery-group-header';
    header.innerHTML = `<h3>${group.name}</h3><span class="gallery-group-client">${group.client}</span>`;
    groupEl.appendChild(header);

    if (group.palette || group.meta || group.download) {
      const metaRow = document.createElement('div');
      metaRow.className = 'gallery-meta-row';
      (group.palette || []).forEach(hex => {
        const sw = document.createElement('span');
        sw.className = 'swatch';
        sw.innerHTML = `<i style="background:${hex};"></i>${hex}`;
        metaRow.appendChild(sw);
      });
      if (group.meta) {
        const specSpan = document.createElement('span');
        specSpan.textContent = group.meta;
        metaRow.appendChild(specSpan);
      }
      if (group.download) {
        const dl = document.createElement('a');
        dl.className = 'gallery-download';
        dl.href = group.download.href;
        dl.target = '_blank';
        dl.rel = 'noopener noreferrer';
        dl.textContent = group.download.label || 'Download PDF';
        metaRow.appendChild(dl);
      }
      groupEl.appendChild(metaRow);
    }

    group.rows.forEach(row => {
      if (row.label) {
        const label = document.createElement('div');
        label.className = 'gallery-subhead';
        label.textContent = row.label;
        groupEl.appendChild(label);
      }

      const rowEl = document.createElement('div');
      rowEl.className = 'gallery-row';

      row.items.forEach(item => {
        const preset = ratios[item.preset] || { aspect: '4/3', fit: 'cover', basis: '320px', max: '380px' };
        const idx = flat.length;
        flat.push(item);

        const card = document.createElement('div');
        card.className = 'gallery-item card';
        card.style.flex = `1 1 ${preset.basis}`;
        card.style.maxWidth = preset.max;

        const badgeHtml = item.badge ? `<span class="gallery-badge ${item.badge}">${item.badge.toUpperCase()}</span>` : '';
        card.innerHTML = `
          ${badgeHtml}
          <div class="gallery-visual${preset.fit === 'contain' ? ' contain' : ''}" style="aspect-ratio:${preset.aspect};">
            <img src="${item.src}" alt="${item.title}" style="object-fit:${preset.fit};object-position:${preset.position || 'center'};" loading="lazy">
            <div class="gallery-scrim">
              <div>
                <strong>${item.title}</strong>
                <span>${item.type}</span>
              </div>
            </div>
          </div>
        `;
        card.addEventListener('click', () => openLightbox(galleryName, idx));
        rowEl.appendChild(card);
      });

      groupEl.appendChild(rowEl);
    });

    root.appendChild(groupEl);
  });

  return flat;
}

const lightbox = document.getElementById('lightbox');
const lbMedia = document.getElementById('lbMedia');
const lbImg = document.getElementById('lbImg');
const lbZoom = document.getElementById('lbZoom');
const lbTitle = document.getElementById('lbTitle');
const lbType = document.getElementById('lbType');
let activeGallery = null;
let activeIdx = 0;

function openLightbox(name, idx) {
  activeGallery = name;
  activeIdx = idx;
  renderLightbox();
  lightbox.classList.add('open');
}

function renderLightbox() {
  const item = galleries[activeGallery][activeIdx];
  lbImg.src = item.src;
  lbImg.alt = item.title;
  lbTitle.textContent = item.title;
  lbType.textContent = item.type;
  setZoom(false);
}

function setZoom(on) {
  if (!lbMedia || !lbZoom) return;
  lbMedia.classList.toggle('scroll-mode', on);
  lbZoom.classList.toggle('active', on);
  lbZoom.setAttribute('aria-label', on ? 'Switch to fit-to-screen view' : 'Switch to full-size scroll view');
  lbMedia.scrollTop = 0;
}

function toggleZoom(e) {
  e.stopPropagation();
  setZoom(!lbMedia.classList.contains('scroll-mode'));
}

function closeLightbox() { lightbox.classList.remove('open'); }

function prevImage(e) {
  e.stopPropagation();
  const items = galleries[activeGallery];
  activeIdx = (activeIdx - 1 + items.length) % items.length;
  renderLightbox();
}

function nextImage(e) {
  e.stopPropagation();
  const items = galleries[activeGallery];
  activeIdx = (activeIdx + 1) % items.length;
  renderLightbox();
}

if (lightbox) {
  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  if (lbZoom) lbZoom.addEventListener('click', toggleZoom);
  document.getElementById('lbPrev').addEventListener('click', prevImage);
  document.getElementById('lbNext').addEventListener('click', nextImage);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage(e);
    if (e.key === 'ArrowLeft') prevImage(e);
  });
}
