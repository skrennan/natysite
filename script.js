
document.getElementById('year').textContent = new Date().getFullYear();

const linksEl = document.getElementById('links');
fetch('./data/categories.json?_=' + Date.now())
  .then(r => r.json())
  .then(cats => {
    cats.forEach(cat => {
      const a = document.createElement('a');
      a.className = 'link-card ' + (cat.colorClass || '');
      a.href = './categoria.html?cat=' + encodeURIComponent(cat.slug);
      a.setAttribute('aria-label', cat.label);

      const bg = document.createElement('div');
      bg.className = 'preview-image';
      if (cat.previewImage) bg.style.backgroundImage = `url('${cat.previewImage}')`;
      a.appendChild(bg);

      const label = document.createElement('div');
      label.className = 'btn-label';
      label.textContent = cat.label;
      a.appendChild(label);

      linksEl.appendChild(a);
    });
  });
