# Paulistear · Site

Site estático (HTML + CSS + JavaScript), sem dependências de build.

## Páginas
- `index.html` · Início (hero, O que é + Quádrupla Hélice, Somos a trama, Por que Paulista)
- `como-atua.html` · Do desafio à solução, trilhas do núcleo, governança
- `agenda.html` · Oportunidades, divulgação e newsletter
- `ecossistema.html` · Mapa e recursos
- `faca-parte.html` · Perfis e formulário

## Arquivos compartilhados
- `styles.css` · tokens (cores, espaçamentos, raio dos botões, espessura das faixas) e todos os componentes
- `script.js` · cabeçalho e rodapé (iguais em todas as páginas), tecido da hélice, agenda, mapa e formulário
- `assets/` · fotos, marca e `assets/logos/` (instituições do núcleo)

## Onde editar
- Menu, rodapé e logos dos parceiros: `PAGES` e `PARTNERS`, no início de `script.js`
- Oportunidades da agenda: `const OPP` em `script.js` (itens com data passada vão sozinhos para "Encerradas")
- Pontos do mapa: `const PTS` em `script.js`
- Cores de destaque dos títulos: `--accent-on-light` e `--accent-on-dark` em `styles.css`
- Espessura das faixas coloridas: `--band` em `styles.css`

## Como ver localmente
Abra `index.html` no navegador (duplo clique) ou sirva a pasta com um servidor local.
