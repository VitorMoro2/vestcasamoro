# VestCasaMoro — Loja de Decoração e Utilidades

Site e-commerce premium, elegante e minimalista para a marca **VestCasaMoro**, especializada em decoração e utilidades para casa.

## Como abrir

Basta abrir o arquivo `index.html` em qualquer navegador moderno.
Para uma experiência completa (carregamento de fontes e imagens), recomenda-se um servidor local:

```bash
# Opção 1 — Node
npx serve .

# Opção 2 — Python
python -m http.server 4321
```

E acesse `http://localhost:4321`.

## Estrutura

```
Site VestCasaMoro/
├── index.html              # Página principal (todas as seções)
├── assets/
│   ├── css/styles.css       # Estilos personalizados e animações
│   ├── js/
│   │   ├── hero-frames.js    # Hero: sequência de frames em canvas controlada por scroll
│   │   └── main.js           # Dados, renderização das seções e interações gerais
│   └── frames/
│       ├── frame-001.jpg ... frame-190.jpg   # Sequência de imagens do hero
└── README.md
```

## Tecnologias

- **HTML5** semântico
- **Tailwind CSS** (via CDN, com configuração de marca personalizada)
- **JavaScript** moderno (ES6, sem dependências) — vanilla, sem build step
- **Canvas API** para a animação do hero controlada por scroll
- **Google Fonts** — Playfair Display (títulos) + Inter (textos)

## Hero com sequência de frames (estilo Apple/Tesla)

O hero (`assets/js/hero-frames.js`) renderiza uma sequência de imagens em um `<canvas>`,
trocando o frame exibido de acordo com a posição do scroll — sem vídeo, sem autoplay.

**Como funciona:**
- A seção `#hero` tem `height: 400vh`; o canvas fica `position: sticky` durante esse espaço.
- A cada evento de `scroll`, calcula-se o progresso (0→1) e mapeia para um índice de frame.
- O primeiro frame é carregado com prioridade; os demais carregam em segundo plano
  (`requestIdleCallback`) sem bloquear a interação.
- Se o usuário rolar rápido antes do preload terminar, o frame mais próximo já
  carregado é exibido (nunca fica em branco).
- **Mobile** (`< 768px`): carrega 1 a cada 3 frames; **tablet** (`< 1024px`): 1 a cada 2;
  **desktop**: todos os frames — reduz dados/memória sem perder fluidez perceptível.
- Texto principal desaparece nos primeiros 35% do scroll; os números de destaque
  (+2.500 clientes etc.) surgem entre 40–55% e somem entre 70–85%.

**Como adicionar/trocar os frames:**
1. Coloque as imagens em `assets/frames/`, nomeadas `frame-001.jpg`, `frame-002.jpg`, ...
   (3 dígitos; ajuste o `pad` no config se precisar de mais).
2. Abra `assets/js/hero-frames.js` e atualize `FRAME_CONFIG.count` para o novo total.
3. Pronto — nenhum outro arquivo precisa ser tocado.

> Por usar imagens (não vídeo), funciona até abrindo o `index.html` direto pelo
> navegador, sem precisar de servidor com suporte a Range Requests.

## Identidade visual

| Cor | Hex | Uso |
|-----|-----|-----|
| Vermelho vinho | `#6B1F2B` | Botões, destaques, títulos |
| Dourado elegante | `#C8A96B` | Detalhes, ícones, CTA |
| Bege claro | `#F5EFE6` | Fundos de seção |
| Branco suave | `#FAF8F5` | Fundo geral |
| Preto suave | `#1F1F1F` | Textos |

## Seções

Header fixo · Hero · Faixa de benefícios · Categorias em destaque · Produtos em destaque · Seção institucional · Newsletter · Footer completo.

## Funcionalidades

- Totalmente **responsivo** (desktop, tablet, mobile) com menu hambúrguer
- **Animações** de fade-in ao rolar a página, hover suave e microinterações (200–300ms)
- Contadores de **carrinho** e **favoritos** com toast de confirmação
- **Lazy loading** de imagens com fallback automático
- Categorias e produtos renderizados a partir de dados em `assets/js/main.js`

## Personalização

- **Produtos / categorias:** edite os arrays `products` e `categories` no início de `assets/js/main.js`.
- **Cores e fontes:** ajuste `tailwind.config` no `<head>` do `index.html`.
- **Imagens:** os produtos usam fotos do Unsplash como exemplo. Substitua os IDs/URLs pelas fotos reais do seu catálogo (mantendo as cores reais dos produtos).

> As cores da paleta são usadas **apenas na identidade visual** (botões, menus, detalhes). As fotos dos produtos mantêm suas cores reais.
