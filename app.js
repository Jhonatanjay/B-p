const $ = (id) => document.getElementById(id);
const starterParts = [
  {id:"demo-1",name:"Filtro de óleo",category:"Filtros",code:"EXEMPLO-FILTRO-001",brand:"Referência ilustrativa",fitment:"A aplicação deve ser confirmada por motor, ano e código OEM.",verified:false,icon:"🛢️",description:"Elemento filtrante para o sistema de lubrificação."},
  {id:"demo-2",name:"Pastilha de freio dianteira",category:"Freios",code:"EXEMPLO-FREIO-002",brand:"Referência ilustrativa",fitment:"Confirmar sistema de freio, versão e código OEM.",verified:false,icon:"🛑",description:"Componente de desgaste do sistema de freios."},
  {id:"demo-3",name:"Amortecedor dianteiro",category:"Suspensão",code:"EXEMPLO-SUSP-003",brand:"Referência ilustrativa",fitment:"Confirmar lado, versão, suspensão e código OEM.",verified:false,icon:"🔩",description:"Componente de suspensão; aplicação varia por versão."},
  {id:"demo-4",name:"Vela de ignição",category:"Motor",code:"EXEMPLO-MOTOR-004",brand:"Referência ilustrativa",fitment:"Confirmar motor exato, combustível e especificação.",verified:false,icon:"⚡",description:"A especificação depende do motor e da aplicação."},
  {id:"demo-5",name:"Sensor de temperatura",category:"Elétrica",code:"EXEMPLO-ELE-005",brand:"Referência ilustrativa",fitment:"Conferir conector, leitura e código OEM.",verified:false,icon:"🌡️",description:"Sensor para monitoramento da temperatura do sistema."},
  {id:"demo-6",name:"Válvula termostática",category:"Arrefecimento",code:"EXEMPLO-ARREF-006",brand:"Referência ilustrativa",fitment:"Confirmar motorização e temperatura de abertura.",verified:false,icon:"🌡️",description:"Componente do controle térmico do motor."}
];
const STORAGE_KEY = "pecaCertaCatalogV1";
const VEHICLE_KEY = "pecaCertaVehicleV1";
let parts = loadParts();
let vehicle = loadVehicle();
let toastTimer;

function loadParts(){
  try { const saved = localStorage.getItem(STORAGE_KEY); if(saved) return JSON.parse(saved); } catch(e) {}
  return starterParts.map(p=>({...p}));
}
function saveParts(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(parts)); }
function loadVehicle(){
  try { return JSON.parse(localStorage.getItem(VEHICLE_KEY) || "null"); } catch(e){ return null; }
}
function saveVehicle(v){ vehicle=v; localStorage.setItem(VEHICLE_KEY,JSON.stringify(v)); }
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function notify(message){
  const t=$("toast");t.textContent=message;t.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2800);
}
function iconFor(category){
  return ({Motor:"⚙️",Freios:"🛑",Suspensão:"🔩",Elétrica:"⚡",Filtros:"🛢️",Arrefecimento:"🌡️"})[category]||"🔧";
}
function renderVehicle(){
  if(vehicle){
    $("brand").value=vehicle.brand||"";
    $("model").value=vehicle.model||"";
    $("year").value=vehicle.year||"";
    $("engine").value=vehicle.engine||"";
    $("vehicleSummary").textContent=`Veículo selecionado: ${vehicle.brand} ${vehicle.model} ${vehicle.year}${vehicle.engine ? " • "+vehicle.engine : ""}`;
  } else {
    $("vehicleSummary").textContent="Selecione um veículo para personalizar sua busca.";
  }
}
function renderParts(){
  const term=$("partSearch").value.trim().toLocaleLowerCase("pt-BR");
  const category=$("categoryFilter").value;
  const filtered=parts.filter(p=>{
    const hay=[p.name,p.category,p.code,p.brand,p.fitment,p.description].join(" ").toLocaleLowerCase("pt-BR");
    return (!term||hay.includes(term))&&(!category||p.category===category);
  });
  $("resultsMeta").textContent=`${filtered.length} ${filtered.length===1?"referência":"referências"} no catálogo • exemplos e cadastros locais`;
  $("partsGrid").innerHTML=filtered.map(p=>`
    <article class="part-card">
      <div class="part-icon">${escapeHtml(p.icon||iconFor(p.category))}</div>
      <div class="part-top"><span class="category-tag">${escapeHtml(p.category)}</span><span class="status-tag ${p.verified?"verified":""}">${p.verified?"✓ Verificada":"⚠ Conferir"}</span></div>
      <h3>${escapeHtml(p.name)}</h3>
      <div class="part-code">Ref.: ${escapeHtml(p.code||"Não informada")}</div>
      <p class="part-description">${escapeHtml(p.description||p.fitment||"Consulte a aplicação antes de comprar.")}</p>
      <button class="button button-outline" type="button" data-part-id="${escapeHtml(p.id)}">Ver detalhes →</button>
    </article>`).join("");
  $("emptyState").classList.toggle("hidden",filtered.length!==0);
  $("partsGrid").classList.toggle("hidden",filtered.length===0);
  document.querySelectorAll("[data-part-id]").forEach(btn=>btn.addEventListener("click",()=>showPart(btn.dataset.partId)));
}
function showPart(id){
  const p=parts.find(x=>x.id===id);if(!p)return;
  $("dialogContent").innerHTML=`
    <div class="dialog-art">${escapeHtml(p.icon||iconFor(p.category))}</div>
    <span class="category-tag">${escapeHtml(p.category)}</span>
    <h2 class="dialog-title">${escapeHtml(p.name)}</h2>
    <p class="dialog-copy">${escapeHtml(p.description||"Sem descrição.")}</p>
    <div class="dialog-facts">
      <div class="fact"><span>Código / referência</span><br><strong>${escapeHtml(p.code||"Não informado")}</strong></div>
      <div class="fact"><span>Fabricante</span><br><strong>${escapeHtml(p.brand||"Não informado")}</strong></div>
      <div class="fact"><span>Aplicação informada</span><br><strong>${escapeHtml(p.fitment||"Não informada")}</strong></div>
      <div class="fact"><span>Status</span><br><strong>${p.verified?"Referência marcada como verificada pelo cadastro":"Compatibilidade não confirmada"}</strong></div>
      <div class="fact"><span>Veículo selecionado</span><br><strong>${vehicle?escapeHtml(`${vehicle.brand} ${vehicle.model} ${vehicle.year} ${vehicle.engine||""}`):"Nenhum veículo selecionado"}</strong></div>
    </div>
    <p class="dialog-copy">${p.verified?"A verificação foi marcada por quem cadastrou a referência; confirme a fonte antes da compra.":"Este registro não confirma que a peça serve no veículo selecionado. Confira OEM, chassi e catálogo do fabricante."}</p>`;
  $("partDialog").showModal();
}
$("vehicleForm").addEventListener("submit",e=>{
  e.preventDefault();
  const v={brand:$("brand").value,model:$("model").value.trim(),year:$("year").value.trim(),engine:$("engine").value.trim()};
  if(!v.brand||!v.model||!v.year){notify("Preencha marca, modelo e ano.");return;}
  saveVehicle(v);renderVehicle();notify("Veículo salvo neste dispositivo.");
});
$("clearVehicle").addEventListener("click",()=>{
  saveVehicle(null);$("vehicleForm").reset();renderVehicle();notify("Seleção de veículo limpa.");
});
$("partSearch").addEventListener("input",renderParts);
$("categoryFilter").addEventListener("change",renderParts);
$("adminToggle").addEventListener("click",()=>{
  const open=$("adminBody").classList.contains("hidden");
  $("adminBody").classList.toggle("hidden",!open);
  $("adminToggle").setAttribute("aria-expanded",String(open));
  $("adminChevron").textContent=open?"−":"＋";
});
$("partForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("newPartName").value.trim();
  const category=$("newPartCategory").value;
  const code=$("newPartCode").value.trim();
  const brand=$("newPartBrand").value.trim();
  const fitment=$("newPartFitment").value.trim();
  const verified=$("newPartVerified").checked;
  if(!name){notify("Informe o nome da peça.");return;}
  parts.unshift({id:"local-"+Date.now(),name,category,code:code||"Não informado",brand:brand||"Não informado",fitment:fitment||"Aplicação não informada; validar antes da compra.",verified,icon:iconFor(category),description:verified?"Referência cadastrada como verificada; confira a fonte.":"Cadastro local aguardando validação."});
  saveParts();renderParts();e.target.reset();notify("Referência salva neste navegador.");
});
$("exportBtn").addEventListener("click",()=>{
  const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),vehicle,parts},null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="peca-certa-catalogo.json";a.click();URL.revokeObjectURL(url);notify("Exportação preparada.");
});
$("resetBtn").addEventListener("click",()=>{
  if(!confirm("Restaurar os exemplos? Isso apaga as referências cadastradas neste navegador."))return;
  parts=starterParts.map(p=>({...p}));saveParts();renderParts();notify("Catálogo de exemplos restaurado.");
});
$("dialogClose").addEventListener("click",()=>$("partDialog").close());
$("partDialog").addEventListener("click",e=>{if(e.target===$("partDialog"))$("partDialog").close();});
let installPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("installBtn").classList.remove("hidden");});
$("installBtn").addEventListener("click",async()=>{
  if(!installPrompt){notify("No navegador, use o menu e escolha 'Adicionar à tela inicial'.");return;}
  installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$("installBtn").classList.add("hidden");
});
if("serviceWorker" in navigator && location.protocol.startsWith("http")) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
renderVehicle();renderParts();
