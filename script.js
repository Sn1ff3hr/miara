const products = [
    { id: 'p1', name: 'Product One', name_es: 'Producto Uno', price: 12.00, qty: 0, img: 'https://via.placeholder.com/150' },
    { id: 'p2', name: 'Product Two', name_es: 'Producto Dos', price: 20.00, qty: 0, img: 'https://via.placeholder.com/150' },
    { id: 'p3', name: 'Product Three', name_es: 'Producto Tres', price: 18.50, qty: 0, img: 'https://via.placeholder.com/150' },
    { id: 'p4', name: 'Product Four', name_es: 'Producto Cuatro', price: 7.25, qty: 0, img: 'https://via.placeholder.com/150' },
    { id: 'p5', name: 'Product Five', name_es: 'Producto Cinco', price: 22.75, qty: 0, img: 'https://via.placeholder.com/150' },
  ];

  function toggleLang() {
    const btn = document.getElementById('langBtn');
    const title = document.getElementById('title');
    const pay = document.getElementById('submitBtn');
    const sum = document.getElementById('summaryTitle');
    // Determine target language BEFORE changing button text
    const isSwitchingToSpanish = btn.textContent === 'ES';

    if (isSwitchingToSpanish) {
      btn.textContent = 'EN';
      title.textContent = 'Aplicación de Pedido';
      pay.textContent = 'PAGAR';
      sum.textContent = 'Lista de Pedido';
    } else {
      btn.textContent = 'ES';
      title.textContent = 'Order App';
      pay.textContent = 'PAY';
      sum.textContent = 'Order List';
    }
    // Re-render products to apply language changes to product names and Qty
    renderProducts();
  }

  function renderProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';
    const langBtn = document.getElementById('langBtn');
    const isSpanish = langBtn.textContent === 'EN'; // Because 'EN' means Spanish is active

    products.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.img}" alt="${isSpanish ? p.name_es : p.name}" onclick="openModal('${p.img}')" />
        <div>${isSpanish ? p.name_es : p.name}</div>
        <div class="product-controls">
          <button class="btn-remove" onclick="updateQty(${i}, -1)">-</button>
          <button class="btn-add" onclick="updateQty(${i}, 1)">+</button>
        </div>
        <div>${isSpanish ? 'Cant.' : 'Qty:'} ${p.qty}</div>
        <div>$${p.price.toFixed(2)}</div>
      `;
      grid.appendChild(card);
    });
    updateSummary();
  }

  function scrollCarousel(direction) {
    const grid = document.getElementById('productGrid');
    const scrollAmount = 170;
    grid.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }

  function updateQty(index, change) {
    products[index].qty = Math.max(0, products[index].qty + change);
    renderProducts();
  }

  function updateSummary() {
    const list = document.getElementById('orderList');
    let subtotal = 0;
    let vatAmt = 0;
    list.innerHTML = '';
    const langBtn = document.getElementById('langBtn');
    const isSpanish = langBtn.textContent === 'EN';

    products.forEach(p => {
      if (p.qty > 0) {
        const totalItem = p.qty * p.price;
        subtotal += totalItem;
        vatAmt += totalItem * 0.12;
        const li = document.createElement('li');
        li.innerHTML = `<span>${isSpanish ? p.name_es : p.name} x ${p.qty}</span><span>$${totalItem.toFixed(2)}</span>`;
        list.appendChild(li);
      }
    });
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('vat').textContent = vatAmt.toFixed(2);
    document.getElementById('total').textContent = (subtotal + vatAmt).toFixed(2);
  }

  async function submitEncryptedOrder() {
    const key = crypto.getRandomValues(new Uint8Array(32));
    const order = products.filter(p => p.qty > 0);
    const encrypted = await encrypt(JSON.stringify(order), key);
    guardrail(encrypted);
  }

  async function encrypt(data, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const alg = { name: 'AES-GCM', iv };
    const cryptoKey = await crypto.subtle.importKey('raw', key, alg, false, ['encrypt']);
    const enc = new TextEncoder().encode(data);
    const buf = await crypto.subtle.encrypt(alg, cryptoKey, enc);
    return { iv: Array.from(iv), payload: Array.from(new Uint8Array(buf)) };
  }

  function guardrail(payload) {
    console.log('[GUARDRAIL] Secure:', payload);
    alert('✅ Encrypted order submitted.');
  }

  function openModal(src) {
    const overlay = document.getElementById('modalOverlay');
    const img = document.getElementById('modalImage');
    img.src = src;
    overlay.style.display = 'flex';
  }

  function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  renderProducts();
