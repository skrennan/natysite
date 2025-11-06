export default async (req, context) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });
  const url = new URL(req.url);
  const table = (url.searchParams.get('table') || '').toLowerCase();
  if (!['products','categories'].includes(table)) return json({ error:'table required: products|categories' }, 400);
  const ADMIN_PIN = '1234';
  const store = await context.blobs.getStore('prontinhos-db');
  const key = `${table}.json`;
  try{
    if (req.method === 'GET') {
      const text = (await store.get(key, { type:'text' })) ?? '[]';
      return new Response(text, { status:200, headers:{ ...cors(), 'Content-Type':'application/json; charset=utf-8' } });
    }
    if (req.method === 'PUT') {
      const pin = req.headers.get('x-admin-pin') || '';
      if (pin !== ADMIN_PIN) return json({ error:'unauthorized' }, 401);
      const raw = await req.text(); let data; try{ data = JSON.parse(raw) }catch{ return json({ error:'invalid json' }, 400); }
      await store.set(key, JSON.stringify(data, null, 2), { contentType:'application/json' });
      return json({ ok:true });
    }
    if (req.method === 'PATCH') {
      const pin = req.headers.get('x-admin-pin') || '';
      if (pin !== ADMIN_PIN) return json({ error:'unauthorized' }, 401);
      const action = url.searchParams.get('action') || 'upsert';
      const currentText = (await store.get(key, { type:'text' })) ?? '[]';
      let current; try { current = JSON.parse(currentText); } catch { current = []; }
      if (action === 'delete') {
        const id = url.searchParams.get('id');
        if (!id) return json({ error:'id required' }, 400);
        const next = current.filter(x => String(x.id) != String(id));
        await store.set(key, JSON.stringify(next, null, 2), { contentType:'application/json' });
        return json({ ok:true, count: next.length });
      }
      const { item } = await req.json();
      if (!item || typeof item !== 'object') return json({ error:'item required' }, 400);
      if (!item.id) item.id = crypto.randomUUID();
      const idx = current.findIndex(x => String(x.id) === String(item.id));
      const next = [...current];
      if (idx >= 0) next[idx] = item; else next.push(item);
      await store.set(key, JSON.stringify(next, null, 2), { contentType:'application/json' });
      return json({ ok:true, item });
    }
    return json({ error:'method not allowed' }, 405);
  }catch(e){ return json({ error:String(e) }, 500); }
};
export const config = { path:'/api/db' };
function cors(){ return { 'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type, x-admin-pin','Access-Control-Allow-Methods':'GET,POST,PUT,PATCH,DELETE,OPTIONS' }; }
function json(payload, status=200){ return new Response(JSON.stringify(payload), { status, headers:{ ...cors(), 'Content-Type':'application/json; charset=utf-8' } }); }
