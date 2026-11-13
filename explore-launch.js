// The existing learning page stays mounted while the separate experience is open.
const launch=document.querySelector('.hero-actions .primary');
launch.href='trainer/index.html';
const sheet=document.createElement('dialog');
sheet.setAttribute('aria-label','3D space expedition');
sheet.style.cssText='position:fixed;inset:0;width:100vw;max-width:none;height:100dvh;max-height:none;margin:0;padding:0;border:0;border-radius:0;background:#0d1720;overflow:hidden';
sheet.innerHTML='<button aria-label="Return to learning website" style="position:absolute;right:18px;top:18px;z-index:5;border:1px solid #ffffff55;border-radius:9px;padding:10px 14px;background:#152633;color:white;font:600 13px sans-serif;cursor:pointer">Back to website ×</button><iframe title="Interactive 3D Moon and Mars expedition" style="border:0;width:100%;height:100%;display:block" allow="fullscreen"></iframe>';
document.body.append(sheet);
let previousOverflow='';
launch.addEventListener('click',e=>{e.preventDefault();previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';sheet.querySelector('iframe').src='trainer/index.html';sheet.showModal();});
sheet.querySelector('button').addEventListener('click',()=>sheet.close());
sheet.addEventListener('close',()=>{sheet.querySelector('iframe').src='about:blank';document.body.style.overflow=previousOverflow;launch.f