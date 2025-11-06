import { getStore } from 'netlify:blobs';
export default async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });
  const url = new URL(req.url);
  const table = (url.searchParams.get('table') || '').toLowerCase();
  if (!['products','categories'].includes(table)) return json({ error:'table required: products|categories' }, 400);
  const ADMIN_PIN = '0192';
  const store = getStore('prontinhos-db'); const key = `${table}.json`;
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
    return json({ error:'method not allowed' }, 405);
  }catch(e){ return json({ error:String(e) }, 500); }
};
export const config = { path:'/api/db' };
function cors(){ return { 'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type, x-admin-pin','Access-Control-Allow-Methods':'GET,POST,PUT,PATCH,DELETE,OPTIONS' }; }
function json(payload, status=200){ return new Response(JSON.stringify(payload), { status, headers:{ ...cors(), 'Content-Type':'application/json; charset=utf-8' } }); }
