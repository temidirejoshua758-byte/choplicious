
const PHONE = "2349037954573"; // WhatsApp number for ordering
const cart = JSON.parse(localStorage.getItem("chopliciousCart") || "[]");

function money(n){ return "₦" + Number(n).toLocaleString("en-NG"); }

function saveCart(){
  localStorage.setItem("chopliciousCart", JSON.stringify(cart));
  renderCart();
}

function addToCart(name, price){
  const item = cart.find(x => x.name === name);
  if(item) item.qty += 1;
  else cart.push({name, price, qty:1});
  saveCart();
  openCart();
  toast(`${name} added to your order`);
}

function removeFromCart(name){
  const i = cart.findIndex(x => x.name === name);
  if(i > -1) cart.splice(i,1);
  saveCart();
}

function renderCart(){
  const box = document.querySelector("#cartItems");
  const totalEl = document.querySelector("#cartTotal");
  if(!box || !totalEl) return;
  if(!cart.length){
    box.innerHTML = `<div class="empty">Your order is empty.<br>Add something delicious from the menu.</div>`;
    totalEl.textContent = money(0);
    return;
  }
  let total = 0;
  box.innerHTML = cart.map(item => {
    total += item.price * item.qty;
    return `<div class="cart-item">
      <div><b>${item.name}</b><div style="color:#777;font-size:.85rem">${item.qty} × ${money(item.price)}</div></div>
      <button class="small-btn" onclick="removeFromCart('${item.name.replace(/'/g,"\\'")}')">Remove</button>
    </div>`;
  }).join("");
  totalEl.textContent = money(total);
}

function openCart(){ document.querySelector("#cart")?.classList.add("open"); }
function closeCart(){ document.querySelector("#cart")?.classList.remove("open"); }

function checkout(){
  if(!cart.length){ toast("Add at least one item first."); return; }
  const lines = cart.map(x => `• ${x.name} × ${x.qty} — ${money(x.price*x.qty)}`);
  const total = cart.reduce((s,x)=>s+x.price*x.qty,0);
  const msg = `Hello Choplicious! 👋\nI'd like to place an order:\n\n${lines.join("\n")}\n\nTotal: ${money(total)}\n\nPlease confirm availability and delivery/pickup details.`;
  window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, "_blank");
}

function toast(msg){
  const t = document.querySelector("#toast");
  if(!t) return;
  t.textContent = msg; t.style.display = "block";
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(()=>t.style.display="none",2200);
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderCart();
  document.querySelectorAll("[data-menu]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const target = btn.dataset.menu;
      document.querySelectorAll(".menu-card").forEach(card=>{
        card.style.display = target==="all" || card.dataset.category===target ? "" : "none";
      });
      document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===btn));
    });
  });
  document.querySelector("#mobileMenu")?.addEventListener("click",()=>{
    document.querySelector("#navLinks")?.classList.toggle("open");
  });
  document.querySelectorAll("#navLinks a").forEach(a=>a.addEventListener("click",()=>{
    document.querySelector("#navLinks")?.classList.remove("open");
  }));
  document.querySelectorAll("[data-order-form]").forEach(form=>{
    form.addEventListener("submit", e=>{
      e.preventDefault();
      const data = new FormData(form);
      const msg = `Hello Choplicious! 👋\n\nName: ${data.get("name")}\nPhone: ${data.get("phone")}\nOrder: ${data.get("order")}\nAddress/Location: ${data.get("location")}\nNote: ${data.get("note") || "None"}`;
      window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, "_blank");
    });
  });
  document.querySelector("#year")?.textContent = new Date().getFullYear();
});
