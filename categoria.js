document.getElementById('year').textContent = new Date().getFullYear();

const listEl = document.getElementById('list');
const titleEl = document.getElementById('catTitle');
const descEl = document.getElementById('catDesc');

const params = new URLSearchParams(location.search);
const slug = params.get('cat') || '';

Promise.all([
  fetch('./data/categories.json?_=' + Date.now()).then(r=>r.json()),
  fetch('./data/products.json?_=' + Date.now()).then(r=>r.json())
]).then(([cats, products]) => {
  const cat = cats.find(c => c.slug === slug);
  if(!cat){ 
    titleEl.textContent='Categoria';
    descEl.textContent='Categoria não encontrada.'; 
    return; 
  }
  titleEl.textContent = cat.label;
  descEl.textContent = cat.desc || '';

  const items = products.filter(p => 
    (p.categorySlug || '').toLowerCase() === slug.toLowerCase() || p.category === cat.label
  );
  render(items);
});

function render(items){
  listEl.innerHTML='';
  if(!items.length){
    listEl.innerHTML='<p style="color:#b8a9d6">Nenhum item por aqui…</p>';
    return;
  }
  items.forEach(item => {
    const it = document.createElement('div'); it.className='item';
    const t  = document.createElement('div'); t.className='item-title'; t.textContent=item.title;
    const meta = document.createElement('div'); meta.className='item-meta';
    const c = document.createElement('span'); c.textContent=item.category||'';
    const p = document.createElement('span'); p.textContent=item.price||'';
    meta.append(c,p);

    const actions = document.createElement('div'); actions.className='item-actions';
    const a = document.createElement('a'); a.className='btn'; a.textContent='Ver na loja';
    a.href = item.primaryLink || (item.links ? Object.values(item.links).find(Boolean) : '#');
    a.target='_blank'; a.rel='nofollow noopener';
    actions.appendChild(a);

    it.append(t, meta, actions);
    listEl.appendChild(it);
  });
}