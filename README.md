# Peça Certa — protótipo inicial

Um protótipo estático de catálogo automotivo, em português, para começar sem custo.

## O que funciona
- Seleção manual de marca, modelo, ano e motor/versão.
- Busca textual e filtro por categoria.
- Cartões e detalhes de peças.
- Cadastro local de referências.
- Exportação do catálogo local para JSON.
- PWA básico com service worker para hospedagem HTTPS.
- Layout responsivo para celular e computador.

## Limites importantes
- As peças incluídas são **exemplos ilustrativos** e não confirmam compatibilidade com nenhum veículo.
- Os cadastros são guardados apenas no navegador do dispositivo; não há login nem banco de dados compartilhado.
- O campo “verificada” é apenas uma marcação manual, não uma validação automática.
- Não consulta placas, preços, estoque nem catálogos OEM externos.
- Antes de uso público, integrar fonte licenciada e testar compatibilidades com referências de fabricantes.

## Publicar grátis com GitHub Pages
1. Crie uma conta no GitHub, se ainda não tiver.
2. Crie um repositório público chamado `peca-certa`.
3. Envie os arquivos desta pasta para a raiz do repositório.
4. Abra **Settings → Pages**.
5. Em “Build and deployment”, escolha “Deploy from a branch”, selecione `main` e `/ (root)`, e salve.
6. Aguarde a publicação. O endereço será parecido com `https://SEU-USUARIO.github.io/peca-certa/`.
7. Abra o link no Android e use o menu do navegador → **Adicionar à tela inicial**.

## Arquivos
- `index.html`: estrutura da interface.
- `styles.css`: estilo responsivo.
- `app.js`: busca e funções do protótipo.
- `manifest.json`: metadados PWA.
- `sw.js`: cache offline básico.
- `icon.svg`: ícone.

## Próxima etapa recomendada
Conectar a um backend (por exemplo, Supabase) e a uma fonte autorizada de catálogo de peças. Nunca marcar uma peça como compatível apenas por semelhança de nome ou modelo.
