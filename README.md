
# PRONTINHOS BR — versão estática (preview com imagem + botões de lojas)

Site 100% estático. Lê `./data/categories.json` e `./data/products.json`.
Cada produto pode ter:
- `image`: URL da imagem de preview (opcional)
- `primaryLink`: link padrão do botão "Ver na loja"
- `links.shopee`, `links.aliexpress`, `links.amazon`: geram botões específicos se existirem

## Formato do produto
```json
{
  "id": "p1",
  "title": "Exemplo",
  "category": "CASA E DECORAÇÃO",
  "categorySlug": "casa-e-decoracao",
  "price": "R$ 00,00",
  "primaryLink": "https://...",
  "image": "https://...",
  "links": {
    "shopee": "https://...",
    "aliexpress": "https://...",
    "amazon": "https://..."
  }
}
```
