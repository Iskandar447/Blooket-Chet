(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const defaults = { balance: 12450, profit: 294, auto: false, notify: false, compact: false, remember: true };
  let state = { ...defaults };
  try { const saved = JSON.parse(localStorage.getItem('blooketCryptoPanel') || '{}'); state = { ...state, ...saved }; } catch {}
  const coins = [
    {symbol:'BTC',name:'Bitcoin',price:67420.50,change:'+2.1%',icon:'₿'},
    {symbol:'ETH',name:'Ethereum',price:3520.18,change:'+1.4%',icon:'Ξ'},
    {symbol:'SOL',name:'Solana',price:182.76,change:'+3.8%',icon:'◎'}
  ];
  function save(){ if(state.remember) localStorage.setItem('blooketCryptoPanel',JSON.stringify(state)); else localStorage.removeItem('blooketCryptoPanel'); }
  function render(){
    $('balance').textContent = '$'+state.balance.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
    $('profit').textContent = (state.profit>=0?'+':'')+'$'+state.profit.toFixed(2);
    ['auto','notify','compact','remember'].forEach(k=>$(k).checked=!!state[k]);
    document.body.classList.toggle('compact',!!state.compact);
    $('coins').innerHTML = coins.map(c=>`<div class="coin"><div class="coin-icon">${c.icon}</div><div class="coin-info"><b>${c.symbol}</b><small>${c.name}</small></div><div class="coin-price">$${c.price.toLocaleString('en-US',{minimumFractionDigits:2})}<small>${c.change}</small></div></div>`).join('');
  }
  document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===btn));
    document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id===btn.dataset.tab));
    if(btn.dataset.tab==='stats') refreshStats();
  }));
  function refreshStats(){
    $('page-title').textContent = document.title || 'Untitled';
    $('text-length').textContent = (document.body.innerText || '').length.toLocaleString();
    $('button-count').textContent = document.querySelectorAll('button').length;
    $('snapshot').textContent = `Sahifa: ${location.hostname || 'local file'} · Sarlavha: ${document.title || '—'} · Vaqt: ${new Date().toLocaleString()}`;
  }
  $('refresh').addEventListener('click',refreshStats);
  ['auto','notify','compact','remember'].forEach(k=>$(k).addEventListener('change',e=>{state[k]=e.target.checked;save();render();}));
  $('buy').addEventListener('click',()=>trade('buy'));
  $('sell').addEventListener('click',()=>trade('sell'));
  function trade(side){
    const amount = Number($('amount').value);
    if(!Number.isFinite(amount)||amount<=0){$('trade-result').textContent='Miqdor 0 dan katta bo‘lishi kerak.';return;}
    state.profit += side==='buy' ? amount*.002 : amount*.001;
    $('trade-result').textContent=`Demo ${side.toUpperCase()}: $${amount.toFixed(2)} · ${$('asset').value}. Haqiqiy savdo bajarilmadi.`;
    save();render();
  }
  $('reset').addEventListener('click',()=>{state={...defaults};save();render();$('trade-result').textContent='';});
  $('close').addEventListener('click',hidePanel);
  $('hide').addEventListener('click',hidePanel);
  $('reopen').addEventListener('click',()=>{$('.app').hidden=false;$('reopen').hidden=true;});
  function hidePanel(){$('.app').hidden=true;$('reopen').hidden=false;}
  let seconds=0;setInterval(()=>{seconds++;$('session').textContent=new Date(seconds*1000).toISOString().slice(11,19);},1000);
  if(state.notify && 'Notification' in window && Notification.permission==='default') Notification.requestPermission();
  $('notify').addEventListener('change',async e=>{if(e.target.checked && 'Notification' in window && Notification.permission==='default') await Notification.requestPermission();});
  render();
})();