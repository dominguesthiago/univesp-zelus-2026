# Guia de Mídias, Imagens e Assets — Sistema ZELUS

**Documento:** Guia de Diretrizes Técnicas para Mídias e Ilustrações  
**Módulo:** `frontend/src/assets/images/`  
**Versão:** 1.0  
**Data:** 19 de outubro de 2026  
**Responsabilidade:** Engenharia de Frontend & Equipe de UI/UX Design  
**Status:** Vigente  

---

## 1. Visão Geral

Este documento estabelece o contrato técnico de comunicação entre a equipe de **Design (UI/UX)** e a equipe de **Engenharia de Frontend** para o sistema **ZELUS**. Ele lista os nomes exatos de arquivos, proporções recomendadas, limites de peso e formatos esperados pelos componentes da aplicação React, com ênfase na tela inicial (*landing page*).

---

## 2. Nomenclatura Exata dos Arquivos (Tela Inicial e Identidade)

Para evitar erros de compilação durante o empacotamento (*build*) do React (`Module not found`), os arquivos de imagem inseridos nesta pasta devem utilizar rigorosamente as nomenclaturas em *kebab-case* padronizadas abaixo:

| Arquivo Esperado | Formato Recomendado | Componente React Alvo | Finalidade / Propósito na Interface |
| :--- | :--- | :--- | :--- |
| **`logo-zelus.png`** | PNG (transparência) / WebP | `Navbar.jsx` / `Header.jsx` | Logotipo oficial do ZELUS (combinação do símbolo cívico com a marca tipográfica). |
| **`logo-zelus.svg`** | SVG (vetorial) | `Navbar.jsx` | Versão vetorial alternativa para telas de altíssima densidade (Retina/HiDPI). |
| **`ilustracao-cidadao.png`** | WebP / PNG | `CardPerfilCidadao.jsx` | Ilustração temática da seção de acesso do munícipe (representando colaboração e zelo comunitário). |
| **`ilustracao-prefeitura.png`** | WebP / PNG | `CardPerfilPrefeitura.jsx` | Ilustração temática da seção de acesso do servidor e gestor público (representando planejamento urbano e serviços de campo). |
| **`hero-zeladoria.png`** | WebP / PNG | `HeroSection.jsx` | Imagem ilustrativa ou banner panorâmico que ambienta a cidade conectada e bem cuidada na tela inicial. |

---

## 3. Especificações Técnicas e Performance Web (Core Web Vitals)

Para garantir carregamento ultrarrápido em redes móveis (3G/4G) e alcançar pontuação superior a **95 no Google Lighthouse**, todas as mídias devem seguir os parâmetros técnicos:

### 3.1 Formatos Suportados
1. **WebP (Preferencial):** Proporciona taxa de compressão cerca de 30% superior ao JPEG/PNG com preservação de transparência alfa.
2. **SVG (Para vetores):** Recomendado para logotipos e ícones. Deve passar previamente pelo otimizador [SVGO](https://github.com/svg/svgo) para remoção de metadados inúteis do software de edição.
3. **PNG (Fallback):** Utilizado com compressão sem perdas (*lossless*) caso o formato WebP não possa ser gerado.

### 3.2 Dimensões e Orçamento de Peso (*Performance Budget*)

| Tipo de Imagem | Dimensões Sugeridas (Largura x Altura) | Peso Máximo Aceito |
| :--- | :--- | :--- |
| **Logotipo (`logo-zelus`)** | `400 x 120 px` (renderizado em ~`160 x 48 px`) | **≤ 50 KB** |
| **Ilustrações de Cards (`ilustracao-*`)** | `600 x 450 px` (proporção 4:3) ou `500 x 500 px` (1:1) | **≤ 150 KB** |
| **Banner Hero (`hero-zeladoria`)** | `1200 x 600 px` (proporção 2:1) | **≤ 250 KB** |

---

## 4. Diretrizes de Acessibilidade Digital (WCAG 2.1 AA / eMAG)

A inclusão de imagens nas interfaces do ZELUS deve atender rigorosamente aos critérios de acessibilidade:

### 4.1 Imagens Informativas vs. Decorativas
* **Imagens Informativas:** Se a imagem comunica uma ideia essencial ou faz parte de um link interativo (ex: card clicável para o Cidadão), a tag `<img>` deve possuir um atributo `alt` descritivo e contextual:
  ```jsx
  // Exemplo no componente React:
  <img 
    src={ilustracaoCidadao} 
    alt="Ilustração de cidadãos interagindo e reportando melhorias para o bairro"
    width="500"
    height="375"
  />
  ```
* **Imagens Decorativas:** Se a imagem for meramente estética e vier acompanhada de títulos e textos explicativos redundantes, utilize `alt=""` acompanhado de `aria-hidden="true"` para que o leitor de tela (NVDA/Orca) a ignore suavemente:
  ```jsx
  <img 
    src={ilustracaoPrefeitura} 
    alt="" 
    aria-hidden="true" 
    width="500"
    height="375"
  />
  ```

### 4.2 Prevenção de Deslocamento de Layout (CLS - *Cumulative Layout Shift*)
Sempre especifique os atributos numéricos `width` e `height` na tag da imagem ou reserve a caixa via CSS com `aspect-ratio`, prevenindo que a página dê saltos visuais abruptos durante o carregamento.

---

## 5. Exemplo de Importação no React

```jsx
import React from 'react';
import logoZelus from '../assets/images/logo-zelus.png';
import ilustracaoCidadao from '../assets/images/ilustracao-cidadao.png';
import ilustracaoPrefeitura from '../assets/images/ilustracao-prefeitura.png';

export const ExemploCardPerfil = () => {
  return (
    <div className="card-perfil">
      <img 
        src={ilustracaoCidadao} 
        alt="" 
        aria-hidden="true" 
        width="400" 
        height="300" 
      />
      <h3>Portal do Cidadão</h3>
      <p>Abra ocorrências de zeladoria urbana com poucos cliques.</p>
    </div>
  );
};
```
