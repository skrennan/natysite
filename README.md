
# PRONTINHOS BR — versão estática (sem painel)

Site 100% estático: lê os dados de `./data/categories.json` e `./data/products.json`.
Funciona em **GitHub Pages** ou **Netlify** sem backend.

## Estrutura
- index.html / style.css / script.js → página principal (categorias estilo "links da bio")
- categoria.html / categoria.js → listagem de produtos por categoria
- data/categories.json → categorias (com `label`, `slug`, `desc`, `previewImage`, `colorClass`)
- data/products.json → produtos (veja formato abaixo)
- favicon.svg

## Formato de produto
```json
{
  "id": "uuid-ou-qualquer-string",
  "title": "Tênis leve",
  "category": "ROUPAS E ACESSÓRIOS",
  "categorySlug": "roupas-e-acessorios",
  "price": "R$ 129,90",
  "primaryLink": "https://sualoja.com/item",
  "links": {
    "shopee": "https://shopee...",
    "aliexpress": "https://aliexpress...",
    "amazon": "https://amazon..."
  }
}
```

## Como editar os dados
1. Edite `data/categories.json` e `data/products.json` localmente.
2. Faça **commit** e **push** para o GitHub.
3. Publique via GitHub Pages ou Netlify (drop/import do repo).

> Observação: na página inicial **não exibimos fotos dos produtos**, apenas a imagem de _preview_ por categoria (hover). Na página da categoria, cada item tem apenas título, preço e o botão "Ver na loja".
