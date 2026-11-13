// Open the trainer inside the learning page so visitors can return without losing their place.
const launch = document.querySelector('.hero-actions .primary');

if (launch) {
  launch.href = 'trainer/index.html';

  const dialog = document.createElement('dialog');
  dialog.setAttribute('aria-label', '3D space expedition');
  dialog.style.cssText = 'position:fixed;inset:0;width:100vw;max-width:none;height:100dvh;max-height:none;margin:0;padding:0;border:0;border-radius:0;background:#0d1720;overflow:hidden';
  dialog.innerHTML = '<button type="button" aria-label="Return to learning website" style="position:absolute;right:18px;top:18px;z-index:5;border:1px solid #ffffff55;border-radius:9px;padding:10px 14px;background:#152633;color:white;font:600 13px sans-serif;cursor:pointer">Back to website ×</button><iframe title="Interactive 3D Moon and Mars expedition" style="border:0;width:100%;height:100%;display:block" allow="fullscreen"></iframe>';
  document.body.append(dialog);

  const frame = dialog.querySelector('iframe');
  const closeButton = dialog.querySelector('button');
  let previousOverflow = '';

  launch.addEventListener('click', event => {
    event.preventDefault();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    frame.src = 'trainer/index.html';
    dialog.showModal();
  });

  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    frame.src = 'about:blank';
    document.body.style.overflow = previousOverflow;
    launch.focus();
  });
}
