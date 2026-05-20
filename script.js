// ============================================
// BANCO DE DADOS DE PRODUTOS
// ============================================
const products = [
    { id: 1, name: "Camisa Oversized Black", price: 89.90, category: "camisetas", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400", featured: true },
    { id: 2, name: "Camisa Street White", price: 79.90, category: "camisetas", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", featured: true },
    
    { id: 4, name: "Regata Urban", price: 69.90, category: "camisetas", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400", featured: false },
    { id: 5, name: "Jeans Skinny", price: 159.90, category: "calcas", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400", featured: true },
    
    { id: 7, name: "Calça Jogger", price: 139.90, category: "calcas", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400", featured: false },
        
    { id: 9, name: "Boné Snapback", price: 49.90, category: "acessorios", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400", featured: true },
    { id: 10, name: "Mochila Urbana", price: 129.90, category: "acessorios", image: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=400", featured: false },
    { id: 11, name: "Relógio Casual", price: 89.90, category: "acessorios", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400", featured: false },
    { id: 12, name: "Cordão Prata", price: 39.90, category: "acessorios", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400", featured: true }
];

// ============================================
// CARRINHO DE COMPRAS
// ============================================
let carrinho = [];

function carregarCarrinho() {
    const salvo = localStorage.getItem('carrinho');
    if (salvo) {
        try {
            carrinho = JSON.parse(salvo);
        } catch(e) { carrinho = []; }
    }
    atualizarContadorCarrinho();
}

function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

function atualizarContadorCarrinho() {
    const contadores = document.querySelectorAll('.cart-count');
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    contadores.forEach(c => c.textContent = totalItens);
}

function adicionarAoCarrinho(productId) {
    const produto = products.find(p => p.id === productId);
    if (!produto) return;
    
    const existente = carrinho.find(item => item.id === productId);
    if (existente) {
        existente.quantidade++;
    } else {
        carrinho.push({
            id: produto.id,
            name: produto.name,
            price: produto.price,
            image: produto.image,
            quantidade: 1
        });
    }
    salvarCarrinho();
    showNotification(`${produto.name} adicionado ao carrinho!`);
}

function removerDoCarrinho(productId) {
    const index = carrinho.findIndex(item => item.id === productId);
    if (index !== -1) {
        carrinho.splice(index, 1);
        salvarCarrinho();
        if (window.location.pathname.includes('checkout.html')) {
            carregarCarrinhoCheckout();
        }
    }
}

function atualizarQuantidade(productId, novaQuantidade) {
    if (novaQuantidade <= 0) {
        removerDoCarrinho(productId);
        return;
    }
    const item = carrinho.find(item => item.id === productId);
    if (item) {
        item.quantidade = novaQuantidade;
        salvarCarrinho();
        if (window.location.pathname.includes('checkout.html')) {
            carregarCarrinhoCheckout();
        }
    }
}

function getTotalCarrinho() {
    return carrinho.reduce((total, item) => total + (item.price * item.quantidade), 0);
}

function irParaCheckout() {
    if (carrinho.length === 0) {
        showNotification('Seu carrinho está vazio!');
        return;
    }
    window.location.href = 'checkout.html';
}

// ============================================
// RENDERIZAÇÃO DO CARRINHO NA PÁGINA CHECKOUT
// ============================================
function carregarCarrinhoCheckout() {
    const container = document.getElementById('carrinho-items');
    const totalContainer = document.getElementById('totalCarrinho');
    if (!container) return;

    if (carrinho.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:2rem;">Seu carrinho está vazio. <a href="produtos.html">Voltar às compras</a></p>';
        if (totalContainer) totalContainer.innerHTML = 'R$ 0,00';
        return;
    }

    let html = '';
    carrinho.forEach(item => {
        html += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>R$ ${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="qty-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantidade}</span>
                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">R$ ${(item.price * item.quantidade).toFixed(2)}</div>
                <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;
    });
    container.innerHTML = html;
    if (totalContainer) totalContainer.innerHTML = `R$ ${getTotalCarrinho().toFixed(2)}`;

    // Eventos dos botões do carrinho
    document.querySelectorAll('.minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const item = carrinho.find(i => i.id === id);
            if (item) atualizarQuantidade(id, item.quantidade - 1);
        });
    });
    document.querySelectorAll('.plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const item = carrinho.find(i => i.id === id);
            if (item) atualizarQuantidade(id, item.quantidade + 1);
        });
    });
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            removerDoCarrinho(id);
        });
    });
    
    // Adiciona clique nas imagens do carrinho
    adicionarCliqueImagensProdutos();
}

// ============================================
// FORMATAÇÃO DE CAMPOS
// ============================================
function formatarCPF(input) {
    let v = input.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0,11);
    if (v.length >= 4) v = v.replace(/(\d{3})(\d)/, '$1.$2');
    if (v.length >= 7) v = v.replace(/(\d{3})(\d)/, '$1.$2');
    if (v.length >= 10) v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = v;
}
function formatarTelefone(input) {
    let v = input.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0,11);
    if (v.length === 11) v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    else if (v.length === 10) v = v.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    input.value = v;
}
function formatarCEP(input) {
    let v = input.value.replace(/\D/g, '');
    if (v.length > 8) v = v.slice(0,8);
    if (v.length === 8) v = v.replace(/(\d{5})(\d{3})/, '$1-$2');
    input.value = v;
}
function formatarCartao(input) {
    let v = input.value.replace(/\D/g, '');
    if (v.length > 16) v = v.slice(0,16);
    v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
    input.value = v.trim();
}
function formatarValidade(input) {
    let v = input.value.replace(/\D/g, '');
    if (v.length > 4) v = v.slice(0,4);
    if (v.length >= 2) v = v.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    input.value = v;
}

// ============================================
// BUSCA DE CEP VIA API (VIA CEP)
// ============================================
function configurarBuscaCEP() {
    const cepInput = document.getElementById('cep');
    if (!cepInput) return;
    cepInput.addEventListener('blur', async function() {
        let cep = this.value.replace(/\D/g, '');
        if (cep.length !== 8) return;
        try {
            this.style.backgroundColor = '#f0f0f0';
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();
            if (!data.erro) {
                if (document.getElementById('address')) document.getElementById('address').value = data.logradouro || '';
                if (document.getElementById('neighborhood')) document.getElementById('neighborhood').value = data.bairro || '';
                if (document.getElementById('city')) document.getElementById('city').value = data.localidade || '';
                if (document.getElementById('state')) document.getElementById('state').value = data.uf || '';
                const numField = document.getElementById('number');
                if (numField) numField.focus();
            } else {
                showNotification('CEP não encontrado!', 'error');
            }
        } catch (error) {
            showNotification('Erro ao buscar CEP', 'error');
        } finally {
            this.style.backgroundColor = '';
        }
    });
}

// ============================================
// PAGAMENTO: PIX E BOLETO (SIMULADOS)
// ============================================
function gerarCodigoPIX(valor, nome) {
    const valStr = valor.toFixed(2).replace('.', '');
    const nomeLimpo = (nome || 'Cliente').substring(0,25);
    return `00020126330014BR.GOV.BCB.PIX0111+5527999999995204000053039865405${valStr}5802BR5925${nomeLimpo}6009SAO PAULO62070503***6304${Math.floor(Math.random()*10000)}`;
}
function gerarCodigoBoleto(valor) {
    const num = Math.floor(Math.random()*10000000000000).toString().padStart(12,'0');
    return `23793.${num.slice(0,5)} 90870.${num.slice(5,10)} 58000.${num.slice(10,15)} 1 556200000${Math.floor(valor).toString().padStart(10,'0')}`;
}
function gerarQRCodeURL(texto) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(texto)}`;
}
function atualizarPix() {
    const total = getTotalCarrinho();
    const nome = document.getElementById('fullName')?.value.trim() || 'Cliente';
    const pixCode = gerarCodigoPIX(total, nome);
    document.getElementById('pixCodeText').innerHTML = `<strong>Código PIX para copiar:</strong><br>${pixCode}`;
    document.getElementById('qrCodeContainer').innerHTML = `<img src="${gerarQRCodeURL(pixCode)}" alt="QR Code PIX">`;
}
function atualizarBoleto() {
    const total = getTotalCarrinho();
    const boletoString = gerarCodigoBoleto(total);
    document.getElementById('boletoString').innerHTML = `<strong>Código de Barras:</strong><br>${boletoString}`;
}
function configurarPagamentos() {
    const radios = document.querySelectorAll('input[name="paymentMethod"]');
    const creditDiv = document.getElementById('creditCardFields');
    const codeArea = document.getElementById('paymentCodeArea');
    const pixDiv = document.getElementById('pixArea');
    const boletoDiv = document.getElementById('boletoArea');
    if (!radios.length) return;
    function toggle() {
        const selected = document.querySelector('input[name="paymentMethod"]:checked').value;
        if (creditDiv) creditDiv.style.display = selected === 'credit' ? 'block' : 'none';
        codeArea.classList.remove('show');
        pixDiv.style.display = 'none';
        boletoDiv.style.display = 'none';
        if (selected === 'pix') {
            atualizarPix();
            codeArea.classList.add('show');
            pixDiv.style.display = 'block';
        } else if (selected === 'boleto') {
            atualizarBoleto();
            codeArea.classList.add('show');
            boletoDiv.style.display = 'block';
        }
    }
    radios.forEach(r => r.addEventListener('change', toggle));
    toggle();
    // botões copiar
    document.getElementById('copyPixBtn')?.addEventListener('click', () => {
        const txt = document.getElementById('pixCodeText')?.innerText.replace('Código PIX para copiar:', '').trim();
        if (txt) { navigator.clipboard.writeText(txt); showNotification('✅ Código PIX copiado!'); }
    });
    document.getElementById('copyBoletoBtn')?.addEventListener('click', () => {
        const txt = document.getElementById('boletoString')?.innerText.replace('Código de Barras:', '').trim();
        if (txt) { navigator.clipboard.writeText(txt); showNotification('✅ Código de barras copiado!'); }
    });
}

// ============================================
// VALIDAÇÃO E ENVIO DO FORMULÁRIO DE PAGAMENTO
// ============================================
function configurarFormularioPagamento() {
    const form = document.getElementById('paymentForm');
    if (!form) return;
    // máscaras
    document.getElementById('cpf')?.addEventListener('input', e => formatarCPF(e.target));
    document.getElementById('phone')?.addEventListener('input', e => formatarTelefone(e.target));
    document.getElementById('cep')?.addEventListener('input', e => formatarCEP(e.target));
    document.getElementById('cardNumber')?.addEventListener('input', e => formatarCartao(e.target));
    document.getElementById('validity')?.addEventListener('input', e => formatarValidade(e.target));
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('fullName')?.value.trim();
        const cpf = document.getElementById('cpf')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const endereco = document.getElementById('address')?.value.trim();
        const numero = document.getElementById('number')?.value.trim();
        const bairro = document.getElementById('neighborhood')?.value.trim();
        const cidade = document.getElementById('city')?.value.trim();
        const estado = document.getElementById('state')?.value;
        const termos = document.getElementById('terms')?.checked;
        if (!nome || !cpf || !email || !endereco || !numero || !bairro || !cidade || !estado || !termos) {
            alert('Preencha todos os campos obrigatórios e aceite os termos.');
            return;
        }
        if (cpf.replace(/\D/g, '').length !== 11) { alert('CPF inválido'); return; }
        if (carrinho.length === 0) { alert('Carrinho vazio'); return; }
        let itens = '';
        carrinho.forEach(i => itens += `\n- ${i.name} (${i.quantidade}x) = R$ ${(i.price*i.quantidade).toFixed(2)}`);
        alert(`✅ Compra finalizada!\nProdutos:${itens}\nTotal: R$ ${getTotalCarrinho().toFixed(2)}\nObrigado!`);
        localStorage.removeItem('carrinho');
        carrinho = [];
        atualizarContadorCarrinho();
        form.reset();
        window.location.href = 'index.html';
    });
}

// ============================================
// NOTIFICAÇÃO FLUTUANTE
// ============================================
function showNotification(msg, type='success') {
    const div = document.createElement('div');
    div.textContent = msg;
    div.style.cssText = `position:fixed; bottom:20px; right:20px; background:${type==='error'?'#e74c3c':'#1a2a4f'}; color:white; padding:12px 24px; border-radius:8px; z-index:9999; animation:fadeInUp 0.3s ease;`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

// ============================================
// MODAL DE IMAGEM EM TELA CHEIA
// ============================================
function criarModalImagem() {
    if (document.getElementById('modalImagem')) return;
    const modal = document.createElement('div');
    modal.id = 'modalImagem';
    modal.className = 'modal-imagem';
    modal.innerHTML = `
        <span class="close-modal">&times;</span>
        <img id="modalImg" src="" alt="Ampliada">
    `;
    document.body.appendChild(modal);
    
    const modalImg = document.getElementById('modalImg');
    const closeBtn = modal.querySelector('.close-modal');
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target === closeBtn) {
            modal.style.display = 'none';
        }
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });
}

function abrirModalImagem(urlImagem) {
    const modal = document.getElementById('modalImagem') || criarModalImagem();
    const modalImg = document.getElementById('modalImg');
    modalImg.src = urlImagem;
    modal.style.display = 'flex';
}

function adicionarCliqueImagensProdutos() {
    const imagens = document.querySelectorAll('.product-image img, .cart-item img');
    imagens.forEach(img => {
        img.removeEventListener('click', handlerCliqueImagem);
        img.addEventListener('click', handlerCliqueImagem);
    });
}

function handlerCliqueImagem(e) {
    e.stopPropagation();
    const url = this.src;
    if (url) abrirModalImagem(url);
}

// ============================================
// RENDERIZAR PRODUTOS (HOME E LOJA)
// ============================================
function renderizarProdutosHome() {
    const container = document.getElementById('featured-grid');
    if (!container) return;
    const destaque = products.filter(p => p.featured);
    container.innerHTML = destaque.map(p => `
        <div class="product-card" data-id="${p.id}">
            <div class="product-image"><img src="${p.image}" alt="${p.name}" onerror="this.src='https://placehold.co/400x300/1a2a4f/white?text=Produto'"></div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p class="product-price">R$ ${p.price.toFixed(2)}</p>
                <div class="product-buttons">
                    <button class="btn-cart" data-id="${p.id}"><i class="fas fa-cart-plus"></i> Adicionar</button>
                    <button class="btn-buy" data-id="${p.id}">Comprar</button>
                </div>
            </div>
        </div>
    `).join('');
    document.querySelectorAll('.btn-cart').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); adicionarAoCarrinho(parseInt(btn.dataset.id)); }));
    document.querySelectorAll('.btn-buy').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); const id = parseInt(btn.dataset.id); carrinho = []; adicionarAoCarrinho(id); irParaCheckout(); }));
    document.querySelectorAll('.product-image').forEach(img => img.addEventListener('click', (e) => { const card = img.closest('.product-card'); if(card) adicionarAoCarrinho(parseInt(card.dataset.id)); }));
    
    adicionarCliqueImagensProdutos();
}

function renderizarProdutosLoja(categoria = 'todos') {
    const container = document.getElementById('products-grid');
    if (!container) return;
    let filtrados = categoria === 'todos' ? products : products.filter(p => p.category === categoria);
    container.innerHTML = filtrados.map(p => `
        <div class="product-card" data-id="${p.id}">
            <div class="product-image"><img src="${p.image}" alt="${p.name}" onerror="this.src='https://placehold.co/400x300/1a2a4f/white?text=Produto'"></div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p class="product-price">R$ ${p.price.toFixed(2)}</p>
                <div class="product-buttons">
                    <button class="btn-cart" data-id="${p.id}"><i class="fas fa-cart-plus"></i> Adicionar</button>
                    <button class="btn-buy" data-id="${p.id}">Comprar</button>
                </div>
            </div>
        </div>
    `).join('');
    document.querySelectorAll('.btn-cart').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); adicionarAoCarrinho(parseInt(btn.dataset.id)); }));
    document.querySelectorAll('.btn-buy').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); const id = parseInt(btn.dataset.id); carrinho = []; adicionarAoCarrinho(id); irParaCheckout(); }));
    document.querySelectorAll('.product-image').forEach(img => img.addEventListener('click', (e) => { const card = img.closest('.product-card'); if(card) adicionarAoCarrinho(parseInt(card.dataset.id)); }));
    
    adicionarCliqueImagensProdutos();
}

function configurarFiltros() {
    const botoes = document.querySelectorAll('.filter-btn');
    if (!botoes.length) return;
    botoes.forEach(btn => btn.addEventListener('click', () => {
        botoes.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderizarProdutosLoja(btn.dataset.category);
    }));
}

// ============================================
// CONTATO
// ============================================
function configurarContato() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const msg = document.getElementById('message')?.value.trim();
        if (!nome || nome.length<3) { document.getElementById('nameError').textContent='Nome inválido'; return; }
        if (!email || !email.includes('@')) { document.getElementById('emailError').textContent='Email inválido'; return; }
        if (!msg || msg.length<10) { document.getElementById('messageError').textContent='Mensagem muito curta'; return; }
        showNotification('Mensagem enviada com sucesso!');
        form.reset();
    });
}

// ============================================
// ICONE CARRINHO E MENU MOBILE
// ============================================
function configurarCarrinhoIcone() {
    const icon = document.querySelector('.cart-icon');
    if (icon) icon.addEventListener('click', irParaCheckout);
}
function configurarMenuMobile() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.nav-menu');
    if (hamburger && menu) {
        hamburger.addEventListener('click', () => menu.classList.toggle('active'));
        document.querySelectorAll('.nav-menu a').forEach(link => link.addEventListener('click', () => menu.classList.remove('active')));
    }
}

// ============================================
// CARROSSEL DE VANTAGENS
// ============================================
function iniciarCarrossel() {
    const slides = document.querySelectorAll('.carrossel-slide');
    const indicadores = document.getElementById('carrosselIndicadores');
    const prev = document.getElementById('prevSlide');
    const next = document.getElementById('nextSlide');
    if (!slides.length || !indicadores) return;
    let idx = 0;
    const total = slides.length;
    for (let i=0; i<total; i++) {
        const dot = document.createElement('div');
        dot.classList.add('indicador');
        if (i===0) dot.classList.add('active');
        dot.addEventListener('click', () => mostrar(i));
        indicadores.appendChild(dot);
    }
    function mostrar(i) {
        if (i<0) i = total-1;
        if (i>=total) i = 0;
        slides.forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.indicador').forEach(d => d.classList.remove('active'));
        slides[i].classList.add('active');
        document.querySelectorAll('.indicador')[i].classList.add('active');
        idx = i;
    }
    function prox() { mostrar(idx+1); }
    function ant() { mostrar(idx-1); }
    if (prev) prev.addEventListener('click', ant);
    if (next) next.addEventListener('click', prox);
    setInterval(prox, 5000);
}

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinho();
    configurarMenuMobile();
    configurarCarrinhoIcone();
    renderizarProdutosHome();
    renderizarProdutosLoja();
    configurarFiltros();
    configurarContato();
    carregarCarrinhoCheckout();
    configurarBuscaCEP();
    configurarPagamentos();
    configurarFormularioPagamento();
    iniciarCarrossel();
});