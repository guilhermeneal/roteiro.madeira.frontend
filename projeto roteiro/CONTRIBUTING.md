# 🤝 Guia de Contribuição - Roteiros Turísticos Madeira

## 📋 Como Contribuir

Estamos abertos a contribuições da comunidade! Este guia explica como você pode contribuir para o projeto.

---

## 🚀 Setup Rápido

### **1. Fork e Clone**
```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU_USERNAME/projeto-roteiro-react.git
cd projeto-roteiro-react/projeto roteiro
```

### **2. Instalação**
```bash
# Instalar dependências
npm install

# Instalar dependências de teste
cd ../testes && npm install && cd ..

# Iniciar servidor de desenvolvimento
npm run dev
```

---

## 🌿 Git Workflow

### **1. Branch Strategy**
```bash
# Branch principal (read-only)
main

# Branch de desenvolvimento
develop

# Feature branches
feature/nome-da-feature
bugfix/descricao-do-bug
hotfix/correcao-urgente
```

### **2. Criando Branch**
```bash
# Atualizar develop
git checkout develop
git pull origin develop

# Criar nova feature branch
git checkout -b feature/sua-feature
```

### **3. Commit Standards**
Usamos **Conventional Commits**:

```bash
# Features
git commit -m "feat: add user authentication system"

# Bug fixes
git commit -m "fix: resolve cart calculation error"

# Documentation
git commit -m "docs: update API documentation"

# Style changes
git commit -m "style: improve button hover effects"

# Refactoring
git commit -m "refactor: optimize cart context performance"

# Tests
git commit -m "test: add checkout flow tests"

# Performance
git commit -m "perf: reduce bundle size by 20%"
```

---

## 🔧 Desenvolvimento

### **1. Code Style**
- **ESLint**: Configuração automática
- **Prettier**: Formatação consistente
- **EditorConfig**: Configurações de editor

```bash
# Verificar linting
npm run lint

# Auto-fix problemas
npm run lint:fix
```

### **2. Component Guidelines**
```javascript
// ✅ Bom exemplo
const ProductCard = ({ product, onAddToCart, className }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAddToCart = useCallback(async () => {
    setIsLoading(true);
    try {
      await onAddToCart(product);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [product, onAddToCart]);
  
  return (
    <div className={`product-card ${className || ''}`}>
      {/* Component implementation */}
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default ProductCard;
```

### **3. State Management**
```javascript
// ✅ Context pattern
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  const addToCart = useCallback(async (product) => {
    // Implementation
  }, []);
  
  const value = useMemo(() => ({
    cartItems,
    addToCart,
    // ... other values
  }), [cartItems, addToCart]);
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
```

---

## 🧪 Testes

### **1. Tipos de Testes**
- **Unit Tests**: Lógica de componentes
- **Integration Tests**: Fluxos completos
- **E2E Tests**: Playwright automation

### **2. Escrevendo Testes**
```javascript
// tests/cart.spec.js
test('should add item to cart', async ({ page }) => {
  // Arrange
  await page.goto('/');
  
  // Act
  await page.locator('.add-to-cart-btn').first().click();
  
  // Assert
  await expect(page.locator('#cartCount')).toHaveText('1');
});
```

### **3. Executando Testes**
```bash
# Todos os testes
cd ../testes && npm test

# Testes específicos
npm test -- cart.spec.js

# Testes headed
npm run test:headed

# Gerar relatório
npm run test:report
```

---

## 🎨 UI/UX Guidelines

### **1. Design System**
- **Colors**: Usar CSS variables definidas
- **Typography**: Font Inter, pesos consistentes
- **Spacing**: Sistema de espaçamento consistente
- **Components**: Reutilizar componentes existentes

### **2. Responsive Design**
```css
/* Mobile-first approach */
.component {
  /* Mobile styles */
}

@media (min-width: 768px) {
  .component {
    /* Tablet styles */
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop styles */
  }
}
```

### **3. Accessibility**
- **ARIA labels**: Sempre incluir
- **Keyboard navigation**: Navegação por tab funcional
- **Color contrast**: WCAG AA compliance
- **Semantic HTML**: Usar elementos corretos

---

## 📝 Pull Request Process

### **1. Antes de Abrir PR**
```bash
# 1. Atualizar branch
git checkout develop
git pull origin develop

# 2. Merge develop na feature
git checkout feature/sua-feature
git merge develop

# 3. Rodar testes
npm run lint
cd ../testes && npm test

# 4. Build
npm run build
```

### **2. PR Template**
```markdown
## Descrição
Breve descrição da mudança

## Tipo de Mudança
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testes
- [ ] Unit tests passando
- [ ] E2E tests passando
- [ ] Manual testing realizado

## Screenshots
Se aplicável, adicionar screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Build successful
```

### **3. Code Review**
- **Peer review**: Mínimo 1 aprovação
- **Automated checks**: CI/CD pipeline
- **Documentation**: Atualizar docs se necessário

---

## 🚀 Deploy

### **1. Deploy Automático**
- **Develop branch**: Deploy automático para staging
- **Main branch**: Deploy automático para produção

### **2. Deploy Manual**
```bash
# Staging
npm run deploy:staging

# Produção
npm run deploy
```

---

## 🐛 Bug Reports

### **1. Report Template**
```markdown
## Bug Description
Descrição clara do bug

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
O que esperava acontecer

## Actual Behavior
O que aconteceu

## Environment
- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome 91, Firefox 89]
- Version: [e.g. v1.2.3]

## Screenshots
Se aplicável
```

---

## 💡 Feature Requests

### **1. Request Template**
```markdown
## Feature Description
Descrição da feature solicitada

## Problem Statement
Qual problema esta feature resolve?

## Proposed Solution
Como você imagina a implementação

## Alternatives Considered
Outras abordagens consideradas

## Additional Context
Informações adicionais
```

---

## 📚 Recursos

### **1. Documentação**
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Playwright](https://playwright.dev/)
- [Vite](https://vitejs.dev/)

### **2. Ferramentas**
- [VS Code](https://code.visualstudio.com/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/)

### **3. Design Resources**
- [Figma](https://www.figma.com/)
- [Google Fonts](https://fonts.google.com/)
- [Coolors](https://coolors.co/)

---

## 🎯 Diretrizes do Projeto

### **1. Performance**
- **Bundle size**: Manter < 500KB
- **Load time**: < 2s FCP
- **Lighthouse**: Score > 90

### **2. Code Quality**
- **Test coverage**: > 90%
- **ESLint**: Zero warnings
- **TypeScript**: Type safety quando possível

### **3. User Experience**
- **Mobile-first**: Design responsivo
- **Accessibility**: WCAG AA compliance
- **Performance**: Interações suaves

---

## 🏆 Reconhecimento

### **Contribuidores**
- Agradecemos todas as contribuições!
- Contribuidores são listados no README
- Badges especiais para contribuidores ativos

### **Code of Conduct**
- Seja respeitoso e inclusivo
- Ajude outros contribuidores
- Mantenha discussões construtivas

---

## 📞 Contato

### **Maintainers**
- **Lead Developer**: [email]
- **UI/UX Lead**: [email]
- **QA Lead**: [email]

### **Canais**
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Discord**: [Server link]

---

## 📋 Checklist Final

Antes de submeter sua contribuição, verifique:

- [ ] Código segue os padrões do projeto
- [ ] Testes estão passando
- [ ] Documentação atualizada
- [ ] Build bem-sucedido
- [ ] PR descritivo e claro
- [ ] Changeset adicionado (se necessário)

---

*Obrigado por contribuir! 🎉*

---

*Guia criado por Cascade AI*  
*Atualizado em 23 de Abril de 2026*
